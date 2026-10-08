/* =====================================================================
 * models/QuizAttempt.js — Every finished quiz (one document per attempt)
 * ---------------------------------------------------------------------
 * This is the main data source for your charts: who took which quiz,
 * when, how they scored and which questions they got right or wrong.
 * ===================================================================== */
const mongoose = require('mongoose');

// One answered question inside an attempt
const answerSchema = new mongoose.Schema(
  {
    question: { type: String, maxlength: 500 },
    fromLesson: { type: Number, min: 1, max: 10 }, // final-challenge questions come from other lessons
    chosen: { type: String, maxlength: 300 },
    correctAnswer: { type: String, maxlength: 300 },
    correct: { type: Boolean, default: false },
    timedOut: { type: Boolean, default: false }
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: Number, required: true, min: 1, max: 10 },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    percent: { type: Number, required: true, min: 0, max: 100 },
    bonus: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    durationSeconds: { type: Number, default: 0 },
    answers: [answerSchema]
  },
  { timestamps: true }
);

quizAttemptSchema.index({ user: 1, createdAt: -1 });
quizAttemptSchema.index({ lessonId: 1 });

quizAttemptSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
