/* =====================================================================
 * controllers/userController.js — Player accounts
 * ---------------------------------------------------------------------
 *   POST   /api/users          register (nickname + consent)
 *   POST   /api/users/login    log in with nickname + player code
 *   GET    /api/me             my profile, progress and history
 *   PATCH  /api/me             change my nickname
 *   POST   /api/me/reset       erase my progress (keep account)
 *   GET    /api/me/export      download all my data
 *   DELETE /api/me             delete my account and all my data
 * ===================================================================== */
const User = require('../models/User');
const LessonProgress = require('../models/LessonProgress');
const QuizAttempt = require('../models/QuizAttempt');
const { AppError, asyncHandler, generatePlayerCode, hashCode, codeMatches } = require('../utils/helpers');
const progressService = require('../services/progressService');

/** POST /api/users */
const register = asyncHandler(async (req, res) => {
  const nickname = String(req.body.nickname || '').trim();
  if (req.body.consent !== true) {
    throw new AppError(400, 'Please tick the consent box to create your player profile.');
  }

  const playerCode = generatePlayerCode();
  const user = await User.create({
    nickname,
    consent: true,
    consentAt: new Date(),
    playerCodeHash: hashCode(playerCode)
  });

  // The plain player code is returned ONCE so the player can write it down.
  res.status(201).json({
    playerCode,
    summary: await progressService.getPlayerSummary(user._id)
  });
});

/** POST /api/users/login */
const login = asyncHandler(async (req, res) => {
  const nickname = String(req.body.nickname || '').trim().toLowerCase();
  const user = await User.findOne({ nicknameKey: nickname }).select('+playerCodeHash');
  if (!user || !codeMatches(req.body.playerCode, user.playerCodeHash)) {
    throw new AppError(401, 'Nickname or player code is incorrect.');
  }
  user.lastActiveAt = new Date();
  await user.save();
  res.json({ summary: await progressService.getPlayerSummary(user._id) });
});

/** GET /api/me */
const getMe = asyncHandler(async (req, res) => {
  res.json(await progressService.getPlayerSummary(req.user._id));
});

/** PATCH /api/me */
const updateMe = asyncHandler(async (req, res) => {
  if (typeof req.body.nickname !== 'string') throw new AppError(400, 'Please send a nickname.');
  req.user.nickname = req.body.nickname.trim();
  await req.user.save(); // runs validation; duplicate names give a 409 error
  res.json(await progressService.getPlayerSummary(req.user._id));
});

/** POST /api/me/reset */
const resetMe = asyncHandler(async (req, res) => {
  await progressService.resetProgress(req.user._id);
  res.json(await progressService.getPlayerSummary(req.user._id));
});

/** GET /api/me/export — everything stored about me (data portability) */
const exportMe = asyncHandler(async (req, res) => {
  const [progress, attempts] = await Promise.all([
    LessonProgress.find({ user: req.user._id }).sort('lessonId').lean(),
    QuizAttempt.find({ user: req.user._id }).sort('createdAt').lean()
  ]);
  res.json({ exportedAt: new Date(), user: req.user.toJSON(), progress, attempts });
});

/** DELETE /api/me */
const deleteMe = asyncHandler(async (req, res) => {
  await progressService.deleteUserCompletely(req.user._id);
  res.status(204).end();
});

module.exports = { register, login, getMe, updateMe, resetMe, exportMe, deleteMe };
