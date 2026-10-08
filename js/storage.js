/* =====================================================================
 * storage.js — ProgressStore class
 * ---------------------------------------------------------------------
 * Saves and loads the player's progress using the browser's
 * localStorage (a small key/value "database" built into every browser).
 * Nothing is ever sent to a server: all data stays on the user's device.
 *
 * Saved under the key "cyberquest.progress.v1" as JSON:
 * {
 *   version: 1,
 *   player:   { name, createdAt },
 *   settings: { theme, sound },
 *   lessons:  { "1": { visited, activityDone, attempts, bestScore,
 *                      bestPercent, bestBonus, total, passed,
 *                      completedAt, lastPlayed }, ... },
 *   history:  [ { lessonId, score, total, percent, bonus, date }, ... ]
 * }
 * ===================================================================== */
window.CQ = window.CQ || {};

(function () {
  'use strict';

  /* Scoring rules — kept in one place so they are easy to tune. */
  const SCORING = {
    PASS_PERCENT: 70,        // score needed to "complete" a lesson and earn its badge
    XP_PER_CORRECT: 10,      // XP for each correct answer (best attempt counts)
    XP_COMPLETION_BONUS: 20, // one-off XP for passing a lesson
    HISTORY_LIMIT: 50        // how many past attempts to keep
  };
  CQ.SCORING = SCORING;

  const STORAGE_KEY = 'cyberquest.progress.v1';

  /** A brand-new, empty save file. */
  function freshState() {
    return {
      version: 1,
      player: { name: '', createdAt: new Date().toISOString() },
      settings: { theme: null, sound: false },
      lessons: {},
      history: []
    };
  }

  class ProgressStore {
    constructor(key) {
      this.key = key || STORAGE_KEY;
      this.state = this.load();
    }

    /* ---------------- Reading & writing ---------------- */

    /** Loads saved progress, or returns a fresh state if none / corrupted. */
    load() {
      try {
        const raw = window.localStorage.getItem(this.key);
        if (!raw) return freshState();
        const saved = JSON.parse(raw);
        const base = freshState();
        // Merge with the defaults so an older save never misses a field.
        return {
          version: base.version,
          player: Object.assign(base.player, saved.player),
          settings: Object.assign(base.settings, saved.settings),
          lessons: saved.lessons || {},
          history: Array.isArray(saved.history) ? saved.history : []
        };
      } catch (err) {
        // Private browsing, blocked storage or corrupted JSON: keep playing in memory.
        console.warn('CyberQuest: saved progress could not be read; starting fresh.', err);
        return freshState();
      }
    }

    /** Writes the current state to localStorage. */
    save() {
      try {
        window.localStorage.setItem(this.key, JSON.stringify(this.state));
      } catch (err) {
        console.warn('CyberQuest: progress could not be saved (storage unavailable).', err);
      }
    }

    /* ---------------- Player & settings ---------------- */

    get playerName() {
      return this.state.player.name || '';
    }

    setPlayerName(name) {
      this.state.player.name = String(name).trim().slice(0, 24);
      this.save();
    }

    getSetting(name) {
      return this.state.settings[name];
    }

    setSetting(name, value) {
      this.state.settings[name] = value;
      this.save();
    }

    /* ---------------- Lesson records ---------------- */

    /** Returns the record for a lesson, creating an empty one if needed. */
    lesson(id) {
      const key = String(id);
      if (!this.state.lessons[key]) {
        this.state.lessons[key] = {
          visited: false,
          activityDone: false,
          attempts: 0,
          bestScore: 0,
          bestPercent: 0,
          bestBonus: 0,
          total: 0,
          passed: false,
          completedAt: null,
          lastPlayed: null
        };
      }
      return this.state.lessons[key];
    }

    /** Returns the record for a lesson WITHOUT creating it (may be null). */
    peek(id) {
      return this.state.lessons[String(id)] || null;
    }

    markVisited(id) {
      const rec = this.lesson(id);
      if (!rec.visited) {
        rec.visited = true;
        this.save();
      }
    }

    markActivityDone(id) {
      const rec = this.lesson(id);
      if (!rec.activityDone) {
        rec.activityDone = true;
        this.save();
      }
    }

    /**
     * Stores the result of a finished quiz.
     * Only the BEST score counts towards XP, so replaying cannot farm points.
     * @returns {{newBadge:boolean, improved:boolean, xpGained:number}}
     */
    recordQuiz(id, result) {
      const rec = this.lesson(id);
      const xpBefore = this.totalXP();
      const wasPassed = rec.passed;
      const now = new Date().toISOString();

      rec.visited = true;
      rec.attempts += 1;
      rec.total = result.total;
      rec.lastPlayed = now;

      const improved = result.score > rec.bestScore;
      if (improved) rec.bestScore = result.score;
      rec.bestBonus = Math.max(rec.bestBonus, result.bonus || 0);
      rec.bestPercent = Math.round((rec.bestScore / result.total) * 100);

      if (result.percent >= SCORING.PASS_PERCENT && !rec.passed) {
        rec.passed = true;
        rec.completedAt = now;
      }

      // Newest attempt first; keep the list short.
      this.state.history.unshift({
        lessonId: id,
        score: result.score,
        total: result.total,
        percent: result.percent,
        bonus: result.bonus || 0,
        date: now
      });
      this.state.history = this.state.history.slice(0, SCORING.HISTORY_LIMIT);

      this.save();
      return {
        newBadge: !wasPassed && rec.passed,
        improved: improved,
        xpGained: this.totalXP() - xpBefore
      };
    }

    /** 'new' | 'started' | 'attempted' | 'completed' */
    status(id) {
      const rec = this.peek(id);
      if (!rec) return 'new';
      if (rec.passed) return 'completed';
      if (rec.attempts > 0) return 'attempted';
      return rec.visited ? 'started' : 'new';
    }

    /** 0–3 stars based on the best score. */
    stars(id) {
      const rec = this.peek(id);
      if (!rec || !rec.attempts) return 0;
      const p = rec.bestPercent;
      if (p >= 100) return 3;
      if (p >= 80) return 2;
      if (p >= SCORING.PASS_PERCENT) return 1;
      return 0;
    }

    /* ---------------- Totals & levels ---------------- */

    lessonXP(id) {
      const rec = this.peek(id);
      if (!rec) return 0;
      return rec.bestScore * SCORING.XP_PER_CORRECT +
        rec.bestBonus +
        (rec.passed ? SCORING.XP_COMPLETION_BONUS : 0);
    }

    totalXP() {
      return Object.keys(this.state.lessons).reduce((sum, id) => sum + this.lessonXP(id), 0);
    }

    completedCount() {
      return Object.values(this.state.lessons).filter(rec => rec.passed).length;
    }

    quizzesTaken() {
      return Object.values(this.state.lessons).reduce((sum, rec) => sum + rec.attempts, 0);
    }

    /** Current level, the next level and % progress between them. */
    level() {
      const xp = this.totalXP();
      const levels = CQ.LEVELS;
      let index = 0;
      levels.forEach((lvl, i) => { if (xp >= lvl.min) index = i; });
      const current = levels[index];
      const next = levels[index + 1] || null;
      const progress = next ? Math.round(((xp - current.min) / (next.min - current.min)) * 100) : 100;
      return { xp, current, next, progress };
    }

    get history() {
      return this.state.history;
    }

    /* ---------------- Maintenance ---------------- */

    /** Clears all progress but keeps the theme/sound preferences. */
    reset() {
      const settings = this.state.settings;
      this.state = freshState();
      this.state.settings = settings;
      this.save();
    }

    /** Pretty-printed JSON of everything saved (for the download button). */
    exportJSON() {
      return JSON.stringify(this.state, null, 2);
    }
  }

  CQ.ProgressStore = ProgressStore;
  CQ.STORAGE_KEY = STORAGE_KEY;
})();
