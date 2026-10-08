/* =====================================================================
 * controllers/progressController.js — Lessons, activities and quizzes
 * ---------------------------------------------------------------------
 *   POST /api/me/lessons/:lessonId/visit      lesson opened
 *   POST /api/me/lessons/:lessonId/activity   practice activity finished
 *   POST /api/me/lessons/:lessonId/quiz       quiz finished (saves attempt)
 * ===================================================================== */
const { SCORING } = require('../config/constants');
const { AppError, asyncHandler } = require('../utils/helpers');
const progressService = require('../services/progressService');

/** POST .../visit */
const visitLesson = asyncHandler(async (req, res) => {
  await progressService.markVisited(req.user._id, req.lessonId);
  res.status(204).end();
});

/** POST .../activity */
const completeActivity = asyncHandler(async (req, res) => {
  await progressService.markActivityDone(req.user._id, req.lessonId);
  res.json({ summary: await progressService.getPlayerSummary(req.user._id) });
});

/** Checks and cleans the quiz result sent by the browser. */
function validateQuiz(body, lessonId) {
  const { score, total } = body;
  const bonus = body.bonus === undefined ? 0 : body.bonus;
  const durationSeconds = Math.max(0, Math.round(Number(body.durationSeconds) || 0));
  const answers = Array.isArray(body.answers) ? body.answers : null;

  if (!Number.isInteger(total) || total < 1 || total > SCORING.MAX_QUESTIONS) {
    throw new AppError(400, `"total" must be a whole number between 1 and ${SCORING.MAX_QUESTIONS}.`);
  }
  if (!Number.isInteger(score) || score < 0 || score > total) {
    throw new AppError(400, '"score" must be a whole number between 0 and total.');
  }
  if (!Number.isInteger(bonus) || bonus < 0 || bonus > total * SCORING.MAX_BONUS_PER_QUESTION) {
    throw new AppError(400, '"bonus" is out of range.');
  }
  if (!answers || answers.length !== total) {
    throw new AppError(400, '"answers" must contain one entry per question.');
  }

  const cleanAnswers = answers.map(a => ({
    question: String(a.question || '').slice(0, 500),
    fromLesson: Number.isInteger(a.fromLesson) && a.fromLesson >= 1 && a.fromLesson <= 10 ? a.fromLesson : lessonId,
    chosen: String(a.chosen || '').slice(0, 300),
    correctAnswer: String(a.correctAnswer || '').slice(0, 300),
    correct: a.correct === true,
    timedOut: a.timedOut === true
  }));

  // The score must agree with the individual answers.
  if (cleanAnswers.filter(a => a.correct).length !== score) {
    throw new AppError(400, 'The score does not match the answers.');
  }

  return { score, total, bonus, durationSeconds, answers: cleanAnswers };
}

/** POST .../quiz */
const submitQuiz = asyncHandler(async (req, res) => {
  const quiz = validateQuiz(req.body, req.lessonId);
  const outcome = await progressService.recordQuizAttempt(req.user._id, req.lessonId, quiz);
  res.status(201).json({ outcome, summary: await progressService.getPlayerSummary(req.user._id) });
});

module.exports = { visitLesson, completeActivity, submitQuiz, validateQuiz };
