/* =====================================================================
 * services/progressService.js — Business logic for player progress
 * ---------------------------------------------------------------------
 * Controllers stay short by calling these functions. The service is the
 * only place that knows how XP, badges and "best score" rules work.
 * ===================================================================== */
const User = require('../models/User');
const LessonProgress = require('../models/LessonProgress');
const QuizAttempt = require('../models/QuizAttempt');
const { SCORING, REGULAR_LESSON_COUNT, FINAL_LESSON_ID } = require('../config/constants');
const { lessonXP, levelFor } = require('../utils/scoring');

/** Total XP of one player (sum over all lessons). */
async function totalXPFor(userId) {
  const records = await LessonProgress.find({ user: userId }).lean();
  return records.reduce((sum, r) => sum + lessonXP(r), 0);
}

/**
 * Everything the React app needs about the logged-in player:
 * profile, per-lesson records, recent quiz history and totals.
 */
async function getPlayerSummary(userId) {
  const [user, records, history] = await Promise.all([
    User.findById(userId),
    LessonProgress.find({ user: userId }).sort('lessonId').lean(),
    QuizAttempt.find({ user: userId }).sort('-createdAt').limit(20).select('-answers').lean()
  ]);
  if (!user) return null;

  const lessons = {};
  let totalXP = 0;
  let completedCount = 0; // regular lessons (1–10) passed
  let badges = 0;         // every passed lesson, including the final challenge
  let quizzesTaken = 0;
  for (const r of records) {
    const xp = lessonXP(r);
    lessons[r.lessonId] = {
      visited: r.visited,
      activityDone: r.activityDone,
      attempts: r.attempts,
      bestScore: r.bestScore,
      bestPercent: r.bestPercent,
      bestBonus: r.bestBonus,
      total: r.total,
      passed: r.passed,
      completedAt: r.completedAt,
      xp
    };
    totalXP += xp;
    if (r.passed) badges += 1;
    if (r.passed && r.lessonId <= REGULAR_LESSON_COUNT) completedCount += 1;
    quizzesTaken += r.attempts;
  }

  return {
    user: user.toJSON(),
    lessons,
    history: history.map(h => ({
      id: h._id, lessonId: h.lessonId, score: h.score, total: h.total,
      percent: h.percent, bonus: h.bonus, passed: h.passed, date: h.createdAt
    })),
    stats: {
      totalXP,
      completedCount,
      badges,
      quizzesTaken,
      finalPassed: !!(lessons[FINAL_LESSON_ID] && lessons[FINAL_LESSON_ID].passed),
      level: levelFor(totalXP)
    }
  };
}

/** Marks a lesson as opened (creates the record if needed). */
async function markVisited(userId, lessonId) {
  await LessonProgress.updateOne(
    { user: userId, lessonId },
    { $set: { visited: true } },
    { upsert: true }
  );
  await User.updateOne({ _id: userId }, { lastActiveAt: new Date() });
}

/** Marks the lesson's practice activity as completed. */
async function markActivityDone(userId, lessonId) {
  // Find the record (or create it), then set the "done" flag only once.
  const record = await LessonProgress.findOneAndUpdate(
    { user: userId, lessonId },
    { $set: { visited: true } },
    { upsert: true, new: true }
  );
  if (!record.activityDone) {
    record.activityDone = true;
    record.activityDoneAt = new Date();
    await record.save();
  }
}

/**
 * Saves a finished quiz and updates the player's best result.
 * @param {object} quiz  validated { score, total, bonus, durationSeconds, answers }
 * @returns {{ newBadge, improved, xpGained, percent, passed }}
 */
async function recordQuizAttempt(userId, lessonId, quiz) {
  const xpBefore = await totalXPFor(userId);
  const percent = Math.round((quiz.score / quiz.total) * 100);
  const passed = percent >= SCORING.PASS_PERCENT;
  const now = new Date();

  const record = (await LessonProgress.findOne({ user: userId, lessonId })) ||
    new LessonProgress({ user: userId, lessonId });
  const wasPassed = record.passed;
  const improved = quiz.score > record.bestScore;

  record.visited = true;
  record.attempts += 1;
  record.total = quiz.total;
  record.lastPlayedAt = now;
  if (improved) record.bestScore = quiz.score;
  record.bestBonus = Math.max(record.bestBonus, quiz.bonus);
  record.bestPercent = Math.round((record.bestScore / quiz.total) * 100);
  if (passed && !record.passed) {
    record.passed = true;
    record.completedAt = now;
  }
  await record.save();

  await QuizAttempt.create({
    user: userId,
    lessonId,
    score: quiz.score,
    total: quiz.total,
    percent,
    bonus: quiz.bonus,
    passed,
    durationSeconds: quiz.durationSeconds,
    answers: quiz.answers
  });
  await User.updateOne({ _id: userId }, { lastActiveAt: now });

  const xpAfter = await totalXPFor(userId);
  return { newBadge: !wasPassed && record.passed, improved, xpGained: xpAfter - xpBefore, percent, passed };
}

/** Deletes all progress and quiz attempts of a player (keeps the account). */
async function resetProgress(userId) {
  await Promise.all([
    LessonProgress.deleteMany({ user: userId }),
    QuizAttempt.deleteMany({ user: userId })
  ]);
}

/** Deletes a player and every piece of data about them. */
async function deleteUserCompletely(userId) {
  await resetProgress(userId);
  await User.deleteOne({ _id: userId });
}

module.exports = {
  totalXPFor, getPlayerSummary, markVisited, markActivityDone,
  recordQuizAttempt, resetProgress, deleteUserCompletely
};
