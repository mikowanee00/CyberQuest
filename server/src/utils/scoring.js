/* =====================================================================
 * utils/scoring.js — XP and rank calculations
 * ===================================================================== */
const { SCORING, LEVELS } = require('../config/constants');

/** XP earned in one lesson (best score + speed bonus + pass bonus). */
function lessonXP(record) {
  if (!record) return 0;
  return record.bestScore * SCORING.XP_PER_CORRECT +
    (record.bestBonus || 0) +
    (record.passed ? SCORING.XP_COMPLETION_BONUS : 0);
}

/** Current rank, next rank and % progress between them. */
function levelFor(xp) {
  let index = 0;
  LEVELS.forEach((lvl, i) => { if (xp >= lvl.min) index = i; });
  const current = LEVELS[index];
  const next = LEVELS[index + 1] || null;
  const progress = next ? Math.round(((xp - current.min) / (next.min - current.min)) * 100) : 100;
  return { current, next, progress };
}

module.exports = { lessonXP, levelFor };
