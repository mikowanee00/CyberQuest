/* =====================================================================
 * controllers/adminController.js — Teacher / researcher dashboard
 * ---------------------------------------------------------------------
 * All routes require the x-admin-key header (see middleware/auth.js).
 *
 *   GET    /api/admin/summary            totals + statistics per lesson
 *   GET    /api/admin/users              every player with their results
 *   GET    /api/admin/users/:id          one player in detail (all attempts)
 *   DELETE /api/admin/users/:id          remove a player and their data
 *   GET    /api/admin/attempts           quiz attempts (?lessonId=&userId=)
 *   GET    /api/admin/questions          % correct for every question
 *   GET    /api/admin/export/:dataset    CSV download: users | attempts | lessons | questions
 * ===================================================================== */
const mongoose = require('mongoose');
const User = require('../models/User');
const LessonProgress = require('../models/LessonProgress');
const QuizAttempt = require('../models/QuizAttempt');
const { LESSONS, lessonTitle } = require('../config/constants');
const { AppError, asyncHandler, toCSV } = require('../utils/helpers');
const { lessonXP, levelFor } = require('../utils/scoring');
const progressService = require('../services/progressService');

const round1 = n => (n === null || n === undefined ? null : Math.round(n * 10) / 10);

/* ------------------------------------------------------------------
 * Data builders (shared by the JSON endpoints and the CSV exports)
 * ------------------------------------------------------------------ */

/** One row per player with totals and best % for every lesson. */
async function buildUserRows() {
  const [users, records] = await Promise.all([
    User.find().sort('-createdAt').lean(),
    LessonProgress.find().lean()
  ]);

  // Group progress records by user id
  const byUser = {};
  for (const r of records) (byUser[r.user] = byUser[r.user] || []).push(r);

  return users.map(u => {
    const recs = byUser[u._id] || [];
    const totalXP = recs.reduce((sum, r) => sum + lessonXP(r), 0);
    const attempted = recs.filter(r => r.attempts > 0);
    const lessons = {};
    for (const r of recs) if (r.attempts > 0) lessons[r.lessonId] = r.bestPercent;

    return {
      id: String(u._id),
      nickname: u.nickname,
      joinedAt: u.createdAt,
      lastActiveAt: u.lastActiveAt,
      consent: u.consent,
      lessonsVisited: recs.filter(r => r.visited).length,
      activitiesDone: recs.filter(r => r.activityDone).length,
      lessonsCompleted: recs.filter(r => r.passed).length,
      quizzesTaken: recs.reduce((sum, r) => sum + r.attempts, 0),
      avgBestPercent: attempted.length
        ? round1(attempted.reduce((sum, r) => sum + r.bestPercent, 0) / attempted.length)
        : null,
      totalXP,
      rank: levelFor(totalXP).current.name,
      finalChallengePassed: recs.some(r => r.lessonId === 10 && r.passed),
      lessons
    };
  });
}

/** One row per lesson with attempt and completion statistics. */
async function buildLessonRows() {
  const [attemptStats, progressStats] = await Promise.all([
    QuizAttempt.aggregate([
      {
        $group: {
          _id: '$lessonId',
          attempts: { $sum: 1 },
          avgPercent: { $avg: '$percent' },
          passCount: { $sum: { $cond: ['$passed', 1, 0] } },
          avgDuration: { $avg: '$durationSeconds' },
          players: { $addToSet: '$user' }
        }
      },
      { $project: { attempts: 1, avgPercent: 1, passCount: 1, avgDuration: 1, players: { $size: '$players' } } }
    ]),
    LessonProgress.aggregate([
      {
        $group: {
          _id: '$lessonId',
          visited: { $sum: { $cond: ['$visited', 1, 0] } },
          activityDone: { $sum: { $cond: ['$activityDone', 1, 0] } },
          completed: { $sum: { $cond: ['$passed', 1, 0] } }
        }
      }
    ])
  ]);

  return LESSONS.map(l => {
    const a = attemptStats.find(s => s._id === l.id) || {};
    const p = progressStats.find(s => s._id === l.id) || {};
    return {
      lessonId: l.id,
      title: l.title,
      playersVisited: p.visited || 0,
      activitiesCompleted: p.activityDone || 0,
      quizAttempts: a.attempts || 0,
      playersAttempted: a.players || 0,
      averageScorePercent: a.attempts ? round1(a.avgPercent) : null,
      passRatePercent: a.attempts ? round1((a.passCount / a.attempts) * 100) : null,
      playersCompleted: p.completed || 0,
      avgDurationSeconds: a.attempts ? Math.round(a.avgDuration) : null
    };
  });
}

/** % correct for every question (hardest first). */
async function buildQuestionRows() {
  const rows = await QuizAttempt.aggregate([
    { $unwind: '$answers' },
    {
      $group: {
        _id: { question: '$answers.question', lesson: '$answers.fromLesson' },
        answered: { $sum: 1 },
        correct: { $sum: { $cond: ['$answers.correct', 1, 0] } },
        timedOut: { $sum: { $cond: ['$answers.timedOut', 1, 0] } }
      }
    }
  ]);
  return rows
    .map(r => ({
      lessonId: r._id.lesson,
      lessonTitle: lessonTitle(r._id.lesson),
      question: r._id.question,
      timesAnswered: r.answered,
      timesCorrect: r.correct,
      timesTimedOut: r.timedOut,
      percentCorrect: round1((r.correct / r.answered) * 100)
    }))
    .sort((a, b) => a.percentCorrect - b.percentCorrect || a.lessonId - b.lessonId);
}

/** Quiz attempts with the player's nickname (optionally filtered). */
async function buildAttemptRows(filter = {}, limit = 0) {
  let query = QuizAttempt.find(filter).sort('-createdAt').select('-answers').populate('user', 'nickname');
  if (limit) query = query.limit(limit);
  const attempts = await query.lean();
  return attempts.map(a => ({
    id: String(a._id),
    date: a.createdAt,
    userId: a.user ? String(a.user._id) : '',
    nickname: a.user ? a.user.nickname : '(deleted)',
    lessonId: a.lessonId,
    lessonTitle: lessonTitle(a.lessonId),
    score: a.score,
    total: a.total,
    percent: a.percent,
    passed: a.passed,
    bonus: a.bonus,
    durationSeconds: a.durationSeconds
  }));
}

/* ------------------------------------------------------------------
 * Route handlers
 * ------------------------------------------------------------------ */

const getSummary = asyncHandler(async (req, res) => {
  const [players, attemptTotals, lessons, users] = await Promise.all([
    User.countDocuments(),
    QuizAttempt.aggregate([{ $group: { _id: null, attempts: { $sum: 1 }, avgPercent: { $avg: '$percent' } } }]),
    buildLessonRows(),
    buildUserRows()
  ]);
  const t = attemptTotals[0] || { attempts: 0, avgPercent: null };
  res.json({
    totals: {
      players,
      quizAttempts: t.attempts,
      averageScorePercent: t.attempts ? round1(t.avgPercent) : null,
      lessonCompletions: lessons.reduce((sum, l) => sum + l.playersCompleted, 0),
      playersFinishedAllLessons: users.filter(u => u.lessonsCompleted === 10).length,
      playersPassedFinal: users.filter(u => u.finalChallengePassed).length
    },
    lessons
  });
});

const listUsers = asyncHandler(async (req, res) => {
  res.json({ users: await buildUserRows() });
});

const getUser = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError(400, 'Invalid user id.');
  const summary = await progressService.getPlayerSummary(req.params.id);
  if (!summary) throw new AppError(404, 'User not found.');
  const attempts = await QuizAttempt.find({ user: req.params.id }).sort('-createdAt').lean();
  res.json({ ...summary, attempts });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError(400, 'Invalid user id.');
  await progressService.deleteUserCompletely(req.params.id);
  res.status(204).end();
});

const listAttempts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.lessonId) filter.lessonId = Number(req.query.lessonId);
  if (req.query.userId && mongoose.isValidObjectId(req.query.userId)) filter.user = req.query.userId;
  res.json({ attempts: await buildAttemptRows(filter, 500) });
});

const questionStats = asyncHandler(async (req, res) => {
  res.json({ questions: await buildQuestionRows() });
});

/* ------------------------------------------------------------------
 * CSV exports (open them in Excel to make charts)
 * ------------------------------------------------------------------ */
const EXPORTS = {
  users: async () => {
    const rows = await buildUserRows();
    // Flatten per-lesson scores into columns L1 … L10
    rows.forEach(r => LESSONS.forEach(l => { r[`L${l.id}`] = r.lessons[l.id] ?? ''; }));
    return toCSV([
      { key: 'nickname', label: 'Nickname' },
      { key: 'joinedAt', label: 'Joined' },
      { key: 'lastActiveAt', label: 'Last active' },
      { key: 'consent', label: 'Consent' },
      { key: 'lessonsVisited', label: 'Lessons visited' },
      { key: 'activitiesDone', label: 'Activities done' },
      { key: 'lessonsCompleted', label: 'Lessons completed' },
      { key: 'quizzesTaken', label: 'Quizzes taken' },
      { key: 'avgBestPercent', label: 'Average best score %' },
      { key: 'totalXP', label: 'Total XP' },
      { key: 'rank', label: 'Rank' },
      ...LESSONS.map(l => ({ key: `L${l.id}`, label: `L${l.id} best %` }))
    ], rows);
  },
  attempts: async () => toCSV([
    { key: 'date', label: 'Date' },
    { key: 'nickname', label: 'Nickname' },
    { key: 'lessonId', label: 'Lesson' },
    { key: 'lessonTitle', label: 'Lesson title' },
    { key: 'score', label: 'Score' },
    { key: 'total', label: 'Total' },
    { key: 'percent', label: 'Percent' },
    { key: 'passed', label: 'Passed' },
    { key: 'bonus', label: 'Speed bonus' },
    { key: 'durationSeconds', label: 'Duration (s)' }
  ], await buildAttemptRows()),
  lessons: async () => toCSV([
    { key: 'lessonId', label: 'Lesson' },
    { key: 'title', label: 'Title' },
    { key: 'playersVisited', label: 'Players visited' },
    { key: 'activitiesCompleted', label: 'Activities completed' },
    { key: 'quizAttempts', label: 'Quiz attempts' },
    { key: 'playersAttempted', label: 'Players attempted' },
    { key: 'averageScorePercent', label: 'Average score %' },
    { key: 'passRatePercent', label: 'Pass rate %' },
    { key: 'playersCompleted', label: 'Players completed' },
    { key: 'avgDurationSeconds', label: 'Average duration (s)' }
  ], await buildLessonRows()),
  questions: async () => toCSV([
    { key: 'lessonId', label: 'Lesson' },
    { key: 'lessonTitle', label: 'Lesson title' },
    { key: 'question', label: 'Question' },
    { key: 'timesAnswered', label: 'Times answered' },
    { key: 'timesCorrect', label: 'Times correct' },
    { key: 'timesTimedOut', label: 'Times timed out' },
    { key: 'percentCorrect', label: 'Percent correct' }
  ], await buildQuestionRows())
};

const exportCSV = asyncHandler(async (req, res) => {
  const build = EXPORTS[req.params.dataset];
  if (!build) throw new AppError(404, 'Unknown export. Use users, attempts, lessons or questions.');
  const csv = await build();
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="cyberquest-${req.params.dataset}-${date}.csv"`);
  res.send(csv);
});

module.exports = { getSummary, listUsers, getUser, deleteUser, listAttempts, questionStats, exportCSV };
