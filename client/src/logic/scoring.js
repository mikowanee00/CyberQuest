/* =====================================================================
 * logic/scoring.js — Game rules used by the React pages
 * (The server applies the same rules in server/src/config/constants.js.)
 * ===================================================================== */
import { LESSONS, LEVELS, RESULT_TITLES } from '../data/lessons.js';

export const SCORING = {
  PASS_PERCENT: 70,
  XP_PER_CORRECT: 10,
  XP_COMPLETION_BONUS: 20
};

/** 'new' | 'started' | 'attempted' | 'completed' for one lesson record. */
export function statusFor(rec) {
  if (!rec) return 'new';
  if (rec.passed) return 'completed';
  if (rec.attempts > 0) return 'attempted';
  return rec.visited ? 'started' : 'new';
}

/** 0–3 stars from a percentage. */
export function starsForPercent(p) {
  if (p >= 100) return 3;
  if (p >= 80) return 2;
  if (p >= SCORING.PASS_PERCENT) return 1;
  return 0;
}

/** Stars for a lesson record (best score). */
export const starsFor = rec => (rec && rec.attempts ? starsForPercent(rec.bestPercent) : 0);

/** Fun title ("Phish Food" … "Cyber Detective!") for a quiz percentage. */
export const resultTitleFor = percent => RESULT_TITLES.find(t => percent >= t.min);

/** The first lesson the player has not completed. */
export const nextLesson = status =>
  LESSONS.find(l => status(l.id) !== 'completed') || LESSONS[LESSONS.length - 1];

export { LEVELS };
