/* =====================================================================
 * models/LessonProgress.js — One player's progress in one lesson
 * ---------------------------------------------------------------------
 * There is at most one document per (user, lesson) pair. It stores the
 * player's BEST result, so replaying a quiz can never lower a score.
 * ===================================================================== */
const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lessonId: { type: Number, required: true, min: 1, max: 10 },
    visited: { type: Boolean, default: false },
    activityDone: { type: Boolean, default: false },
    activityDoneAt: { type: Date },
    attempts: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    bestPercent: { type: Number, default: 0 },
    bestBonus: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    completedAt: { type: Date },
    lastPlayedAt: { type: Date }
  },
  { timestamps: true }
);

// A player can only have one progress record per lesson.
lessonProgressSchema.index({ user: 1, lessonId: 1 }, { unique: true });

lessonProgressSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);
