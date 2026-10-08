/* =====================================================================
 * logic/QuizEngine.js — Quiz logic with NO user interface
 * ---------------------------------------------------------------------
 * Keeps track of the current question, checks answers, calculates the
 * time bonus and builds the final result. QuizPage.jsx shows it.
 * ===================================================================== */
import { LESSONS } from '../data/lessons.js';

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class QuizEngine {
  /**
   * @param {Array}  questions  question objects from data/lessons.js
   * @param {object} options    { timed, seconds, maxBonus }
   */
  constructor(questions, options = {}) {
    this.questions = questions.map(QuizEngine.normalize);
    this.timed = !!options.timed;
    this.seconds = options.seconds || 25;
    this.maxBonus = options.maxBonus || 5;
    this.index = 0;
    this.answers = [];
  }

  /** True/False questions become 2-option multiple choice. */
  static normalize(q) {
    if (q.type === 'tf') return { ...q, options: ['True', 'False'], answer: q.answer ? 0 : 1 };
    return q;
  }

  get current() { return this.questions[this.index]; }
  get total() { return this.questions.length; }
  get number() { return this.index + 1; }
  get answered() { return this.answers.length > this.index; }
  get isLast() { return this.index === this.total - 1; }
  get finished() { return this.index >= this.total; }
  get score() { return this.answers.filter(a => a.correct).length; }

  /**
   * Checks an answer. choice = option index, or -1 when time ran out.
   * Faster correct answers in timed mode earn up to `maxBonus` XP.
   */
  answer(choice, secondsLeft = 0) {
    if (this.answered) return this.answers[this.index];
    const question = this.current;
    const correct = choice === question.answer;
    const bonus = this.timed && correct
      ? Math.ceil((Math.max(0, secondsLeft) / this.seconds) * this.maxBonus)
      : 0;
    const record = { question, choice, correct, bonus, timedOut: choice === -1 };
    this.answers.push(record);
    return record;
  }

  /** Moves on; returns false when there are no more questions. */
  next() {
    if (this.answered) this.index += 1;
    return !this.finished;
  }

  result() {
    const score = this.score;
    return {
      score,
      total: this.total,
      percent: Math.round((score / this.total) * 100),
      bonus: this.answers.reduce((sum, a) => sum + a.bonus, 0),
      answers: this.answers
    };
  }
}

/** Final challenge: random questions from every lesson's quiz. */
export function buildFinalQuestions(count = 10) {
  const pool = [];
  LESSONS.forEach(lesson => lesson.quiz.forEach(q => pool.push({ ...q, fromLesson: lesson.id })));
  return shuffle(pool).slice(0, count);
}

/** Creates the right engine for a lesson (normal or timed final). */
export function createEngine(lesson) {
  if (lesson.final) {
    const s = lesson.finalSettings;
    return new QuizEngine(buildFinalQuestions(s.count), { timed: true, seconds: s.seconds, maxBonus: s.maxBonus });
  }
  return new QuizEngine(lesson.quiz.map(q => ({ ...q, fromLesson: lesson.id })));
}
