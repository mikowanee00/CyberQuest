/* =====================================================================
 * models/User.js — A player of the game
 * ---------------------------------------------------------------------
 * Players sign up with only a nickname (no email, no real name) and get
 * a random "player code". The code works like a simple password: only
 * a SHA-256 hash of it is stored, never the code itself.
 * ===================================================================== */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: [true, 'Please choose a nickname.'],
      trim: true,
      minlength: [2, 'Nickname must be at least 2 characters.'],
      maxlength: [24, 'Nickname must be 24 characters or fewer.'],
      match: [/^[\p{L}\p{N} _.'-]+$/u, 'Nickname can only use letters, numbers, spaces and - _ . \''],
    },
    // Lower-case copy of the nickname so "Alex" and "alex" count as the same name.
    nicknameKey: { type: String, required: true, unique: true },
    // Hash of the player code (select:false = never returned unless asked for).
    playerCodeHash: { type: String, required: true, select: false },
    // Informed consent to store results for the class project.
    consent: { type: Boolean, required: true },
    consentAt: { type: Date },
    lastActiveAt: { type: Date, default: Date.now }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Keep nicknameKey in sync before validation runs.
userSchema.pre('validate', function setNicknameKey(next) {
  if (this.nickname) this.nicknameKey = this.nickname.trim().toLowerCase();
  next();
});

// Hide internal fields whenever a user is sent as JSON.
userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.nicknameKey;
    delete ret.playerCodeHash;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
