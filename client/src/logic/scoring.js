/* =====================================================================
 * logic/scoring.js — Game rules used by the React pages
 * (The server applies the same rules in server/src/config/constants.js.)
 * ===================================================================== */
import { LEVELS, RESULT_TITLES, REGULAR_LESSONS, FINAL } from '../data/lessons.js';

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

/** The 10 regular lessons the player hasn't completed yet. */
export const lessonsLeft = status => REGULAR_LESSONS.filter(l => status(l.id) !== 'completed');

/** The final challenge unlocks once all 10 lessons are completed. */
export const isFinalUnlocked = status => lessonsLeft(status).length === 0;

/** The next thing to do: the first unfinished lesson, otherwise the final challenge. */
export const nextLesson = status => lessonsLeft(status)[0] || FINAL;

/** "Lesson 3" or "Final challenge". */
export const lessonLabel = lesson => (lesson.final ? 'Final challenge' : `Lesson ${lesson.id}`);

export { LEVELS };
