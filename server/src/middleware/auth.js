/* =====================================================================
 * middleware/auth.js — Who is making this request?
 * ---------------------------------------------------------------------
 * requirePlayer: the React app sends two headers with every request:
 *     x-user-id       the player's database id
 *     x-player-code   the player's secret code
 *   If they match, the user is attached to req.user for the controller.
 *
 * requireAdmin: the admin dashboard sends the header x-admin-key, which
 *   must equal ADMIN_KEY from server/.env.
 * ===================================================================== */
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const { AppError, asyncHandler, codeMatches } = require('../utils/helpers');

const requirePlayer = asyncHandler(async (req, res, next) => {
  const userId = req.get('x-user-id');
  const code = req.get('x-player-code');
  if (!userId || !code || !mongoose.isValidObjectId(userId)) {
    throw new AppError(401, 'Please create a player profile or log in first.');
  }
  const user = await User.findById(userId).select('+playerCodeHash');
  if (!user || !codeMatches(code, user.playerCodeHash)) {
    throw new AppError(401, 'Your session is no longer valid. Please log in again.');
  }
  req.user = user;
  next();
});

function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return next(new AppError(503, 'ADMIN_KEY is not set in server/.env, so the dashboard is disabled.'));
  // Hash both values so they have equal length, then compare in constant time.
  const given = crypto.createHash('sha256').update(req.get('x-admin-key') || '').digest();
  const wanted = crypto.createHash('sha256').update(expected).digest();
  if (!crypto.timingSafeEqual(given, wanted)) return next(new AppError(401, 'Wrong admin key.'));
  next();
}

/** Checks the :lessonId URL parameter is 1–10 and stores it as a number. */
function validateLessonId(req, res, next) {
  const id = Number(req.params.lessonId);
  if (!Number.isInteger(id) || id < 1 || id > 10) return next(new AppError(400, 'Lesson id must be a number from 1 to 10.'));
  req.lessonId = id;
  next();
}

module.exports = { requirePlayer, requireAdmin, validateLessonId };
