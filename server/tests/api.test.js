/* =====================================================================
 * tests/api.test.js — Automated API tests
 *   npm test   (from the server folder)
 * Uses Node's built-in test runner, Supertest (fake HTTP requests) and a
 * temporary in-memory MongoDB, so your real database is never touched.
 * ===================================================================== */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server-core');
const createApp = require('../src/app');

let mongod;
let app;
const ADMIN = 'test-admin-key';
const player = {}; // filled in by the registration test

/** Builds a valid quiz submission with `score` correct answers out of `total`. */
function quizBody(score, total, extra = {}) {
  const answers = Array.from({ length: total }, (_, i) => ({
    question: `Question ${i + 1}?`,
    chosen: i < score ? 'Right' : 'Wrong',
    correctAnswer: 'Right',
    correct: i < score
  }));
  return { score, total, durationSeconds: 42, answers, ...extra };
}

const asPlayer = req => req.set('x-user-id', player.id).set('x-player-code', player.code);

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri('cyberquest-test'));
  process.env.ADMIN_KEY = ADMIN;
  app = createApp();
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test('health check works', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.database, 'connected');
});

test('registration requires consent', async () => {
  const res = await request(app).post('/api/users').send({ nickname: 'Alex' });
  assert.equal(res.status, 400);
});

test('registration rejects invalid nicknames', async () => {
  const res = await request(app).post('/api/users').send({ nickname: '<script>', consent: true });
  assert.equal(res.status, 400);
});

test('a player can register and gets a player code', async () => {
  const res = await request(app).post('/api/users').send({ nickname: 'Alex', consent: true });
  assert.equal(res.status, 201);
  assert.match(res.body.playerCode, /^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
  assert.equal(res.body.summary.user.nickname, 'Alex');
  assert.equal(res.body.summary.user.playerCodeHash, undefined, 'hash must never be returned');
  player.id = res.body.summary.user._id;
  player.code = res.body.playerCode;
});

test('nicknames are unique (case-insensitive)', async () => {
  const res = await request(app).post('/api/users').send({ nickname: 'alex', consent: true });
  assert.equal(res.status, 409);
});

test('login needs the correct player code', async () => {
  const bad = await request(app).post('/api/users/login').send({ nickname: 'alex', playerCode: 'AAAA-AAAA' });
  assert.equal(bad.status, 401);
  const good = await request(app).post('/api/users/login').send({ nickname: 'ALEX', playerCode: player.code.toLowerCase() });
  assert.equal(good.status, 200);
  assert.equal(good.body.summary.user._id, player.id);
});

test('/api/me requires valid credentials', async () => {
  assert.equal((await request(app).get('/api/me')).status, 401);
  const wrong = await request(app).get('/api/me').set('x-user-id', player.id).set('x-player-code', 'ZZZZ-ZZZZ');
  assert.equal(wrong.status, 401);
  assert.equal((await asPlayer(request(app).get('/api/me'))).status, 200);
});

test('visiting a lesson and finishing an activity are saved', async () => {
  assert.equal((await asPlayer(request(app).post('/api/me/lessons/2/visit'))).status, 204);
  const res = await asPlayer(request(app).post('/api/me/lessons/2/activity'));
  assert.equal(res.status, 200);
  assert.equal(res.body.summary.lessons['2'].activityDone, true);
});

test('invalid lesson ids are rejected', async () => {
  assert.equal((await asPlayer(request(app).post('/api/me/lessons/11/visit'))).status, 400);
});

test('passing a quiz awards XP and a badge', async () => {
  const res = await asPlayer(request(app).post('/api/me/lessons/2/quiz')).send(quizBody(4, 5));
  assert.equal(res.status, 201);
  assert.equal(res.body.outcome.passed, true);
  assert.equal(res.body.outcome.newBadge, true);
  assert.equal(res.body.outcome.xpGained, 60); // 4 × 10 + 20 completion bonus
  assert.equal(res.body.summary.stats.completedCount, 1);
});

test('a worse attempt does not lower the best score', async () => {
  const res = await asPlayer(request(app).post('/api/me/lessons/2/quiz')).send(quizBody(1, 5));
  assert.equal(res.body.outcome.improved, false);
  assert.equal(res.body.outcome.xpGained, 0);
  assert.equal(res.body.summary.lessons['2'].bestScore, 4);
  assert.equal(res.body.summary.lessons['2'].attempts, 2);
});

test('tampered quiz results are rejected', async () => {
  const body = quizBody(3, 5);
  body.score = 5; // claims 5 but only 3 answers are correct
  assert.equal((await asPlayer(request(app).post('/api/me/lessons/3/quiz')).send(body)).status, 400);
  assert.equal((await asPlayer(request(app).post('/api/me/lessons/3/quiz')).send(quizBody(6, 5))).status, 400);
});

test('admin routes require the admin key', async () => {
  assert.equal((await request(app).get('/api/admin/users')).status, 401);
  assert.equal((await request(app).get('/api/admin/users').set('x-admin-key', 'nope')).status, 401);
});

test('admin can list users, lessons and questions', async () => {
  const users = await request(app).get('/api/admin/users').set('x-admin-key', ADMIN);
  assert.equal(users.status, 200);
  assert.equal(users.body.users.length, 1);
  assert.equal(users.body.users[0].lessonsCompleted, 1);
  assert.equal(users.body.users[0].quizzesTaken, 2);

  const summary = await request(app).get('/api/admin/summary').set('x-admin-key', ADMIN);
  assert.equal(summary.body.totals.players, 1);
  assert.equal(summary.body.totals.quizAttempts, 2);
  assert.equal(summary.body.lessons.find(l => l.lessonId === 2).passRatePercent, 50);

  const questions = await request(app).get('/api/admin/questions').set('x-admin-key', ADMIN);
  assert.equal(questions.body.questions.length, 5);
});

test('admin CSV export works', async () => {
  const res = await request(app).get('/api/admin/export/users').set('x-admin-key', ADMIN);
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /text\/csv/);
  assert.ok(res.text.startsWith('﻿Nickname,Joined'));
  assert.ok(res.text.includes('Alex'));
  assert.equal((await request(app).get('/api/admin/export/nope').set('x-admin-key', ADMIN)).status, 404);
});

test('a player can export and then delete all their data', async () => {
  const exp = await asPlayer(request(app).get('/api/me/export'));
  assert.equal(exp.body.attempts.length, 2);
  assert.equal((await asPlayer(request(app).delete('/api/me'))).status, 204);
  const users = await request(app).get('/api/admin/users').set('x-admin-key', ADMIN);
  assert.equal(users.body.users.length, 0);
  const summary = await request(app).get('/api/admin/summary').set('x-admin-key', ADMIN);
  assert.equal(summary.body.totals.quizAttempts, 0);
});
