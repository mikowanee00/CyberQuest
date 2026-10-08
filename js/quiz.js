/* =====================================================================
 * quiz.js — QuizEngine class
 * ---------------------------------------------------------------------
 * Pure quiz logic with NO HTML: it keeps track of the current question,
 * checks answers, calculates time bonuses and produces the final result.
 * The QuizView (js/views.js) is responsible for showing it on screen.
 * Keeping logic and display apart makes both easier to read and test.
 * ===================================================================== */
window.CQ = window.CQ || {};

(function () {
  'use strict';

  class QuizEngine {
    /**
     * @param {Array}  questions  question objects from lessons.js
     * @param {object} options    { timed, seconds, maxBonus }
     */
    constructor(questions, options) {
      const opts = options || {};
      this.questions = questions.map(QuizEngine.normalize);
      this.timed = !!opts.timed;
      this.seconds = opts.seconds || 25;   // time limit per question (timed mode)
      this.maxBonus = opts.maxBonus || 5;  // bonus XP for an instant correct answer
      this.index = 0;                      // current question number (0-based)
      this.answers = [];                   // one record per answered question
    }

    /** Converts True/False questions into the same shape as multiple choice. */
    static normalize(q) {
      if (q.type === 'tf') {
        return Object.assign({}, q, { options: ['True', 'False'], answer: q.answer ? 0 : 1 });
      }
      return q;
    }

    get current()  { return this.questions[this.index]; }
    get total()    { return this.questions.length; }
    get number()   { return this.index + 1; }
    get answered() { return this.answers.length > this.index; }
    get isLast()   { return this.index === this.total - 1; }
    get finished() { return this.index >= this.total; }
    get score()    { return this.answers.filter(a => a.correct).length; }

    /**
     * Checks an answer for the current question.
     * @param {number} choice       option index, or -1 if the timer ran out
     * @param {number} secondsLeft  remaining time (timed mode only)
     * @returns the answer record { question, choice, correct, bonus, timedOut }
     */
    answer(choice, secondsLeft) {
      if (this.answered) return this.answers[this.index]; // ignore double clicks
      const q = this.current;
      const correct = choice === q.answer;

      // Faster correct answers earn more bonus XP (0 … maxBonus).
      let bonus = 0;
      if (this.timed && correct) {
        bonus = Math.ceil((Math.max(0, secondsLeft) / this.seconds) * this.maxBonus);
      }

      const record = { question: q, choice, correct, bonus, timedOut: choice === -1 };
      this.answers.push(record);
      return record;
    }

    /** Moves to the next question. Returns false when the quiz is over. */
    next() {
      if (this.answered) this.index += 1;
      return !this.finished;
    }

    /** Summary used by the results screen and saved by ProgressStore. */
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

  CQ.QuizEngine = QuizEngine;

  /**
   * Builds the question set for the Final Challenge:
   * every question from lessons 1–9 plus the final's own extra questions,
   * shuffled, then the first `count` are used. Each attempt is different.
   */
  CQ.buildFinalQuestions = function (count) {
    const pool = [];
    CQ.LESSONS.forEach(lesson => {
      lesson.quiz.forEach(q => pool.push(Object.assign({ fromLesson: lesson.id }, q)));
    });
    return CQ.shuffle(pool).slice(0, count || 10);
  };
})();
