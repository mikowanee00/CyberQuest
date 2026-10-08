/* =====================================================================
 * views.js — Page views
 * ---------------------------------------------------------------------
 * Each page of the site is a class that extends `View`:
 *
 *   HomeView      #/              welcome screen + nickname entry
 *   LessonsView   #/lessons       grid of all 10 lessons
 *   LessonView    #/lesson/:id    Learn → Practice → Quiz for one lesson
 *   QuizView      #/quiz/:id      the quiz and its results screen
 *   ProgressView  #/progress      XP, badges, scores, saved data
 *   HelpView      #/help          how to play, scoring, glossary
 *   NotFoundView  anything else
 *
 * Life cycle (called by the router in app.js):
 *   render()  → returns the page HTML
 *   mount()   → attaches event listeners once the HTML is on the page
 *   destroy() → cleans up timers/listeners before the next page loads
 * ===================================================================== */
window.CQ = window.CQ || {};

(function () {
  'use strict';

  const icon = (name, cls) => CQ.icon(name, cls);
  const esc = CQ.esc;

  /* ==================================================================
   * Shared helpers
   * ================================================================== */

  /** Row of 0–3 stars. */
  function starsHTML(count) {
    let html = '';
    for (let i = 0; i < 3; i++) html += `<span class="star ${i < count ? 'on' : ''}">${icon('star')}</span>`;
    return `<span class="stars" role="img" aria-label="${count} of 3 stars">${html}</span>`;
  }

  /** Colored status label for a lesson. */
  function statusChip(status) {
    const map = {
      completed: ['chip-success', 'Completed'],
      attempted: ['chip-warn', 'Try again'],
      started: ['chip-info', 'In progress'],
      new: ['chip-muted', 'Not started']
    };
    const [cls, text] = map[status] || map.new;
    return `<span class="chip ${cls}">${text}</span>`;
  }

  /** The first lesson the player has not completed yet. */
  function nextLesson(store) {
    return CQ.LESSONS.find(l => store.status(l.id) !== 'completed') || CQ.LESSONS[CQ.LESSONS.length - 1];
  }

  function getLesson(id) {
    return CQ.LESSONS.find(l => l.id === Number(id)) || null;
  }

  /** Hero illustration: a phishing hook trying to catch an email, guarded by a shield. */
  const HERO_ART = `
    <svg class="hero-svg" viewBox="0 0 420 340" role="img" aria-label="Illustration of a fishing hook dangling over an email on a laptop, protected by a security shield">
      <circle cx="215" cy="185" r="140" class="h-blob"/>
      <g class="h-float h-float-1">
        <rect x="14" y="96" width="112" height="36" rx="18" class="h-card"/>
        <text x="34" y="120" class="h-mono">• • • • • •</text>
      </g>
      <g class="h-float h-float-2">
        <rect x="300" y="62" width="104" height="36" rx="18" class="h-card"/>
        <circle cx="322" cy="80" r="8" class="h-ok"/>
        <path d="m318 80 3 3 5-6" class="h-ok-check"/>
        <text x="338" y="85" class="h-label">2FA on</text>
      </g>
      <rect x="85" y="118" width="250" height="160" rx="14" class="h-laptop"/>
      <rect x="98" y="131" width="224" height="134" rx="6" class="h-screen"/>
      <path d="M58 278h304l-20 24H78z" class="h-base"/>
      <g class="h-envelope">
        <rect x="160" y="170" width="100" height="66" rx="7" class="h-env"/>
        <path d="m162 176 48 34 48-34" class="h-env-line"/>
        <circle cx="258" cy="172" r="13" class="h-alert"/>
        <text x="258" y="178" text-anchor="middle" class="h-alert-text">!</text>
      </g>
      <g class="h-hook">
        <path d="M210 0v140" class="h-line"/>
        <path d="M210 140v14a9 9 0 0 1-18 0v-5" class="h-hookpath"/>
        <path d="m192 149 5 5" class="h-hookpath"/>
      </g>
      <g class="h-shield">
        <path d="M348 196l-38 13v26c0 24 16 41 38 48 22-7 38-24 38-48v-26z" class="h-shield-body"/>
        <path d="m332 238 11 11 20-22" class="h-shield-check"/>
      </g>
    </svg>`;

  /* ==================================================================
   * Base class
   * ================================================================== */
  class View {
    constructor(app, params) {
      this.app = app;
      this.store = app.store;
      this.params = params || [];
    }
    get title() { return 'CyberQuest'; }
    get nav() { return ''; }   // which main-menu item to highlight
    render() { return ''; }
    mount() {}
    destroy() {}
  }

  /* ==================================================================
   * HOME
   * ================================================================== */
  class HomeView extends View {
    get title() { return 'Home'; }
    get nav() { return 'home'; }

    render() {
      const name = this.store.playerName;
      const done = this.store.completedCount();
      const next = nextLesson(this.store);

      const start = name
        ? `<div class="welcome-back">
             <p>Welcome back, <strong>${esc(name)}</strong>! You have completed <strong>${done}</strong> of 10 lessons.</p>
             <div class="btn-row">
               <a class="btn btn-primary btn-lg" href="#/lesson/${next.id}">${icon('play')} ${done ? 'Continue' : 'Start'}: Lesson ${next.id}</a>
               <a class="btn btn-secondary btn-lg" href="#/lessons">${icon('grid')} All lessons</a>
             </div>
           </div>`
        : `<form class="name-form" id="name-form" autocomplete="off" novalidate>
             <label for="player-name">What should we call you, agent?</label>
             <div class="name-row">
               <input id="player-name" name="name" type="text" maxlength="24" placeholder="A nickname works best" required aria-describedby="name-note name-error">
               <button class="btn btn-primary btn-lg" type="submit">Start the mission ${icon('arrowRight')}</button>
             </div>
             <p id="name-error" class="form-error" hidden>Please type a nickname to begin.</p>
             <p id="name-note" class="form-note">${icon('lock')} Tip from Lesson 9: you don't need your real name. It is only stored in this browser.</p>
           </form>`;

      return `
        <section class="hero">
          <div class="container hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">${icon('shield')} Cybersecurity Awareness Game</p>
              <h1>Think before<br>you <span class="hl">click.</span></h1>
              <p class="lead">Learn to spot phishing emails, scams and online tricks through 10 bite-sized lessons, hands-on simulations and fun quizzes. Earn XP, collect badges and become a <strong>Cyber Detective</strong>.</p>
              ${start}
              <ul class="hero-facts">
                <li><strong>10</strong> lessons</li>
                <li><strong>50</strong> quiz questions</li>
                <li><strong>10</strong> badges</li>
              </ul>
            </div>
            <div class="hero-art">${HERO_ART}</div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <h2 class="section-heading">How it works</h2>
            <div class="feature-grid">
              <article class="feature">
                <span class="feature-icon" style="--c:#6366f1">${icon('book')}</span>
                <h3>1. Learn</h3>
                <p>Short, clear lessons explain each threat with real-world examples.</p>
              </article>
              <article class="feature">
                <span class="feature-icon" style="--c:#14b8a6">${icon('target')}</span>
                <h3>2. Practice</h3>
                <p>Hunt for red flags in fake emails, chat with a scammer, test passwords and more.</p>
              </article>
              <article class="feature">
                <span class="feature-icon" style="--c:#f59e0b">${icon('award')}</span>
                <h3>3. Quiz &amp; earn</h3>
                <p>Answer fun quizzes with instant feedback, earn XP and stars, and unlock badges.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="section section-alt">
          <div class="container">
            <h2 class="section-heading">Why it matters</h2>
            <div class="feature-grid">
              <article class="feature feature-plain">
                <h3>🎣 Attackers target people</h3>
                <p>Most attacks don't break software — they trick a person into clicking, sharing or paying.</p>
              </article>
              <article class="feature feature-plain">
                <h3>🖱️ One click can be enough</h3>
                <p>A single fake login page or infected attachment can expose your email, money and identity.</p>
              </article>
              <article class="feature feature-plain">
                <h3>🛡️ Good habits are easy</h3>
                <p>A few simple habits — pause, check, verify — stop the vast majority of scams.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <div class="section-head-row">
              <h2 class="section-heading">Your mission: 10 lessons</h2>
              <a href="#/lessons" class="text-link">View all ${icon('arrowRight')}</a>
            </div>
            <ol class="mini-lessons">
              ${CQ.LESSONS.map(l => `
                <li><a href="#/lesson/${l.id}" style="--c:${l.color}">
                  <span class="mini-icon">${icon(l.icon)}</span>
                  <span><small>Lesson ${l.id}</small>${l.title}</span>
                  ${this.store.status(l.id) === 'completed' ? `<span class="mini-done" aria-label="completed">${icon('check')}</span>` : ''}
                </a></li>`).join('')}
            </ol>
          </div>
        </section>`;
    }

    mount(root) {
      const form = root.querySelector('#name-form');
      if (!form) return;
      const input = form.querySelector('#player-name');
      const error = form.querySelector('#name-error');
      form.addEventListener('submit', e => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) {
          error.hidden = false;
          input.setAttribute('aria-invalid', 'true');
          input.focus();
          return;
        }
        this.store.setPlayerName(name);
        this.app.sound.play('win');
        CQ.toast(`Welcome aboard, <strong>${esc(name)}</strong>! Your first mission awaits.`, 'success');
        location.hash = '#/lessons';
      });
      input.addEventListener('input', () => { error.hidden = true; input.removeAttribute('aria-invalid'); });
    }
  }

  /* ==================================================================
   * LESSONS LIST
   * ================================================================== */
  class LessonsView extends View {
    get title() { return 'Lessons'; }
    get nav() { return 'lessons'; }

    render() {
      const done = this.store.completedCount();
      const next = nextLesson(this.store);
      return `
        <section class="page-head">
          <div class="container page-head-inner">
            <div>
              <p class="eyebrow">${icon('grid')} Mission map</p>
              <h1>Lessons</h1>
              <p class="lead">Work through the lessons in order, or jump to any topic. Each one ends with a quiz — score 70% or more to earn its badge.</p>
            </div>
            <div class="overall card">
              <div class="overall-top"><strong>${done} / 10</strong> completed</div>
              <div class="progress-bar lg"><span style="width:${done * 10}%"></span></div>
              <a class="btn btn-primary" href="#/lesson/${next.id}">${icon('play')} ${done === 10 ? 'Replay the final challenge' : `Next up: Lesson ${next.id}`}</a>
            </div>
          </div>
        </section>
        <div class="container page-body">
          <div class="lesson-grid">
            ${CQ.LESSONS.map(l => this.card(l)).join('')}
          </div>
        </div>`;
    }

    card(l) {
      const status = this.store.status(l.id);
      const rec = this.store.peek(l.id);
      return `
        <a class="lesson-card ${l.final ? 'is-final' : ''}" href="#/lesson/${l.id}" style="--c:${l.color}">
          <div class="lc-top">
            <span class="lc-icon">${icon(l.icon)}</span>
            ${statusChip(status)}
          </div>
          <p class="lc-num">${l.final ? 'Final challenge' : `Lesson ${l.id}`}</p>
          <h3>${l.title}</h3>
          <p class="lc-summary">${l.summary}</p>
          <div class="lc-foot">
            <span>${icon('clock')} ${l.minutes} min</span>
            ${rec && rec.attempts ? `<span>Best ${rec.bestScore}/${rec.total}</span>` : ''}
            ${starsHTML(this.store.stars(l.id))}
          </div>
        </a>`;
    }
  }

  /* ==================================================================
   * SINGLE LESSON  (Learn → Practice → Quiz)
   * ================================================================== */
  class LessonView extends View {
    constructor(app, params) {
      super(app, params);
      this.lesson = getLesson(this.params[0]);
      this.activity = null;
    }
    get title() { return this.lesson ? this.lesson.title : 'Lesson not found'; }
    get nav() { return 'lessons'; }

    render() {
      const L = this.lesson;
      if (!L) return NotFoundView.markup();
      const prev = getLesson(L.id - 1);
      const next = getLesson(L.id + 1);
      const rec = this.store.peek(L.id);

      // Steps shown in the stepper (the final challenge has no practice step).
      const steps = [{ id: 'learn', label: 'Learn' }];
      if (L.activity) steps.push({ id: 'practice', label: 'Practice' });
      steps.push({ id: 'quiz-step', label: L.final ? 'Challenge' : 'Quiz' });
      const stepNo = id => steps.findIndex(s => s.id === id) + 1;

      const quizInfo = L.final
        ? `${L.finalSettings.count} random questions · ${L.finalSettings.seconds} seconds each · bonus XP for speed`
        : `${L.quiz.length} questions · instant feedback · score 70% to earn the <strong>${L.badge}</strong> badge`;

      return `
        <section class="lesson-hero" style="--c:${L.color}">
          <div class="container">
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="#/">Home</a><span aria-hidden="true">/</span>
              <a href="#/lessons">Lessons</a><span aria-hidden="true">/</span>
              <span aria-current="page">Lesson ${L.id}</span>
            </nav>
            <div class="lesson-hero-inner">
              <div class="lesson-hero-icon">${icon(L.icon)}</div>
              <div>
                <p class="eyebrow">Lesson ${L.id} of 10 · ${icon('clock')} ${L.minutes} min</p>
                <h1>${L.title}</h1>
                <p class="lead">${L.summary}</p>
              </div>
            </div>
            <ol class="stepper" aria-label="Lesson steps">
              ${steps.map((s, i) => `<li><button type="button" data-jump="${s.id}"><span class="step-no">${i + 1}</span> ${s.label}</button></li>`).join('')}
            </ol>
          </div>
        </section>

        <div class="container lesson-body">
          <section id="learn" class="lesson-step" aria-labelledby="learn-title">
            <h2 id="learn-title" class="step-title"><span class="step-no">${stepNo('learn')}</span> Learn</h2>
            <div class="lesson-sections">
              ${L.sections.map(s => `<article class="card lesson-section"><h3>${s.heading}</h3>${s.body}</article>`).join('')}
            </div>
            <aside class="takeaways" aria-label="Key takeaways">
              <h3>${icon('bulb')} Key takeaways</h3>
              <ul>${L.takeaways.map(t => `<li>${icon('check')} <span>${t}</span></li>`).join('')}</ul>
            </aside>
          </section>

          ${L.activity ? `
          <section id="practice" class="lesson-step" aria-labelledby="practice-title">
            <h2 id="practice-title" class="step-title"><span class="step-no">${stepNo('practice')}</span> Practice: ${L.activity.title}
              <span class="chip chip-success activity-badge" ${rec && rec.activityDone ? '' : 'hidden'}>${icon('check')} Done</span>
            </h2>
            <div class="card activity-panel" id="activity-root"></div>
          </section>` : ''}

          <section id="quiz-step" class="lesson-step" aria-labelledby="quiz-title">
            <div class="quiz-cta ${L.final ? 'is-final' : ''}" style="--c:${L.color}">
              <div>
                <h2 id="quiz-title" class="step-title"><span class="step-no">${stepNo('quiz-step')}</span> ${L.final ? 'Ready for the final challenge?' : 'Quiz time!'}</h2>
                <p>${quizInfo}</p>
                ${rec && rec.attempts ? `<p class="best-line">Your best: <strong>${rec.bestScore}/${rec.total}</strong> ${starsHTML(this.store.stars(L.id))}</p>` : ''}
              </div>
              <a class="btn btn-primary btn-lg" href="#/quiz/${L.id}">${L.final ? icon('trophy') + ' Start the challenge' : icon('play') + ' Start the quiz'}</a>
            </div>
          </section>

          <nav class="lesson-pager" aria-label="Lesson navigation">
            ${prev ? `<a class="pager-link" href="#/lesson/${prev.id}">${icon('arrowLeft')}<span><small>Previous</small>${prev.title}</span></a>` : '<span></span>'}
            ${next ? `<a class="pager-link pager-next" href="#/lesson/${next.id}"><span><small>Next</small>${next.title}</span>${icon('arrowRight')}</a>` : '<span></span>'}
          </nav>
        </div>`;
    }

    mount(root) {
      const L = this.lesson;
      if (!L) return;
      this.store.markVisited(L.id);

      // Stepper buttons scroll to their section (the URL hash is used by the router).
      root.querySelectorAll('[data-jump]').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = root.querySelector('#' + btn.dataset.jump);
          if (target) target.scrollIntoView({ behavior: CQ.prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        });
      });

      // Start the practice activity for this lesson.
      const holder = root.querySelector('#activity-root');
      if (holder && L.activity) {
        this.activity = CQ.Activities.create(holder, L.activity, () => {
          const firstTime = !this.store.lesson(L.id).activityDone;
          this.store.markActivityDone(L.id);
          const badge = root.querySelector('.activity-badge');
          if (badge) badge.hidden = false;
          if (firstTime) CQ.toast(`${icon('check')} Practice complete! Scroll down for the quiz.`, 'success');
        });
      }
    }

    destroy() {
      if (this.activity) this.activity.destroy();
    }
  }

  /* ==================================================================
   * QUIZ + RESULTS
   * ================================================================== */
  const PRAISE = ['Correct!', 'Nailed it!', 'Sharp eyes!', 'Exactly right!', 'Well spotted!'];
  const OOPS = ['Not quite.', 'Oops — that was a trap!', 'Close, but no.', 'Careful!'];
  const pick = list => list[Math.floor(Math.random() * list.length)];

  class QuizView extends View {
    constructor(app, params) {
      super(app, params);
      this.lesson = getLesson(this.params[0]);
      this.timerId = null;
      this.onKey = this.onKey.bind(this);
      if (!this.lesson) return;

      const L = this.lesson;
      if (L.final) {
        const s = L.finalSettings;
        this.engine = new CQ.QuizEngine(CQ.buildFinalQuestions(s.count), { timed: true, seconds: s.seconds, maxBonus: s.maxBonus });
      } else {
        this.engine = new CQ.QuizEngine(L.quiz);
      }
    }
    get title() { return this.lesson ? `Quiz: ${this.lesson.title}` : 'Quiz not found'; }
    get nav() { return 'lessons'; }

    render() {
      const L = this.lesson;
      if (!L) return NotFoundView.markup();
      return `
        <div class="quiz-page" style="--c:${L.color}">
          <div class="container quiz-container">
            <div class="quiz-top">
              <a class="text-link" href="#/lesson/${L.id}">${icon('x')} Exit ${L.final ? 'challenge' : 'quiz'}</a>
              <span class="quiz-label">${icon(L.icon)} ${L.title}</span>
            </div>
            <div id="quiz-stage"></div>
          </div>
        </div>`;
    }

    mount(root) {
      if (!this.lesson) return;
      this.stage = root.querySelector('#quiz-stage');
      document.addEventListener('keydown', this.onKey);
      this.showQuestion();
    }

    destroy() {
      this.stopTimer();
      document.removeEventListener('keydown', this.onKey);
    }

    /* ---------- Question screen ---------- */
    showQuestion() {
      const e = this.engine;
      const q = e.current;
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const isBinary = q.options.length === 2;

      this.stage.innerHTML = `
        <div class="quiz-progress">
          <div class="quiz-progress-row">
            <span>Question <strong>${e.number}</strong> of ${e.total}</span>
            <span class="quiz-score">${icon('check')} ${e.score} correct</span>
          </div>
          <div class="progress-bar"><span style="width:${((e.number - 1) / e.total) * 100}%"></span></div>
        </div>
        ${e.timed ? `<div class="timer" aria-hidden="true"><div class="timer-bar"><span></span></div><span class="timer-text">${icon('clock')} <b>${e.seconds}</b>s</span></div>` : ''}
        <div class="question-card card">
          ${q.fromLesson ? `<p class="q-from">${q.fromLesson === this.lesson.id ? 'Bonus scenario' : `From Lesson ${q.fromLesson}`}</p>` : ''}
          <h2 class="q-prompt" id="q-prompt" tabindex="-1">${q.prompt}</h2>
          ${q.visual ? `<div class="q-visual">${CQ.Visuals.render(q.visual)}</div>` : ''}
          <div class="options ${isBinary ? 'options-binary' : ''}" role="group" aria-labelledby="q-prompt">
            ${q.options.map((opt, i) => `
              <button type="button" class="option" data-i="${i}">
                <span class="opt-key" aria-hidden="true">${letters[i]}</span>
                <span class="opt-text">${opt}</span>
              </button>`).join('')}
          </div>
          <div class="feedback-slot" aria-live="assertive"></div>
        </div>
        <p class="kbd-hint">Tip: press <kbd>A</kbd>–<kbd>${letters[q.options.length - 1]}</kbd> (or <kbd>1</kbd>–<kbd>${q.options.length}</kbd>) to answer and <kbd>Enter</kbd> to continue.</p>`;

      this.stage.querySelectorAll('.option').forEach(btn => {
        btn.addEventListener('click', () => this.choose(+btn.dataset.i));
      });
      this.stage.querySelector('#q-prompt').focus({ preventScroll: true });
      if (e.number > 1) this.stage.scrollIntoView({ block: 'start', behavior: 'auto' });
      if (e.timed) this.startTimer();
    }

    /* ---------- Timer (final challenge only) ---------- */
    startTimer() {
      this.stopTimer();
      const total = this.engine.seconds * 1000;
      const endsAt = Date.now() + total;
      const bar = this.stage.querySelector('.timer-bar span');
      const text = this.stage.querySelector('.timer-text b');
      const timerEl = this.stage.querySelector('.timer');

      const tick = () => {
        const left = Math.max(0, endsAt - Date.now());
        this.secondsLeft = left / 1000;
        bar.style.width = (left / total) * 100 + '%';
        text.textContent = Math.ceil(this.secondsLeft);
        timerEl.classList.toggle('is-low', this.secondsLeft <= 5);
        if (left <= 0) {
          this.stopTimer();
          this.choose(-1); // time is up → counts as wrong
        }
      };
      tick();
      this.timerId = setInterval(tick, 100);
    }

    stopTimer() {
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = null;
    }

    /* ---------- Answering ---------- */
    choose(index) {
      const e = this.engine;
      if (e.answered) return;
      this.stopTimer();
      const rec = e.answer(index, this.secondsLeft || 0);
      const q = rec.question;

      // Color the options: green = correct answer, red = the wrong pick.
      this.stage.querySelectorAll('.option').forEach(btn => {
        const i = +btn.dataset.i;
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('is-correct');
        else if (i === index) btn.classList.add('is-wrong');
        else btn.classList.add('is-dim');
      });

      this.app.sound.play(rec.correct ? 'correct' : 'wrong');

      const headline = rec.timedOut ? "⏰ Time's up!" : rec.correct ? `✅ ${pick(PRAISE)}` : `❌ ${pick(OOPS)}`;
      const slot = this.stage.querySelector('.feedback-slot');
      slot.innerHTML = `
        <div class="feedback ${rec.correct ? 'good' : 'bad'}">
          <p><strong>${headline}</strong>${rec.bonus ? ` <span class="bonus">+${rec.bonus} speed bonus ${icon('zap')}</span>` : ''}</p>
          <p>${q.explain}</p>
        </div>
        <div class="quiz-actions">
          <button type="button" class="btn btn-primary btn-lg" id="next-btn">${e.isLast ? 'See my results' : 'Next question'} ${icon('arrowRight')}</button>
        </div>`;
      this.stage.querySelector('.quiz-score').innerHTML = `${icon('check')} ${e.score} correct`;
      const nextBtn = slot.querySelector('#next-btn');
      nextBtn.addEventListener('click', () => this.next());
      nextBtn.focus({ preventScroll: true });
      slot.scrollIntoView({ block: 'nearest', behavior: CQ.prefersReducedMotion() ? 'auto' : 'smooth' });
    }

    next() {
      if (this.engine.next()) this.showQuestion();
      else this.showResults();
    }

    /** Keyboard shortcuts: A–D / 1–4 to answer, Enter for next. */
    onKey(ev) {
      if (!this.engine || this.engine.finished) return;
      if (ev.target.matches('input, textarea')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const key = ev.key.toLowerCase();
      const count = this.engine.current.options.length;
      if (!this.engine.answered) {
        let idx = -1;
        if (/^[1-9]$/.test(key)) idx = Number(key) - 1;
        else if (/^[a-e]$/.test(key)) idx = key.charCodeAt(0) - 97;
        if (idx >= 0 && idx < count) { ev.preventDefault(); this.choose(idx); }
      } else if (key === 'enter' && ev.target.id !== 'next-btn') {
        ev.preventDefault();
        this.next();
      }
    }

    /* ---------- Results screen ---------- */
    showResults() {
      const L = this.lesson;
      const res = this.engine.result();
      const outcome = this.store.recordQuiz(L.id, res);
      const title = CQ.RESULT_TITLES.find(t => res.percent >= t.min);
      const passed = res.percent >= CQ.SCORING.PASS_PERCENT;
      const next = getLesson(L.id + 1);
      const circumference = 2 * Math.PI * 52;
      const name = this.store.playerName || 'Cyber Agent';

      this.app.updateHeader();
      document.title = `Results: ${L.title} · CyberQuest`;

      this.stage.innerHTML = `
        <section class="results card" aria-labelledby="results-title">
          <div class="score-ring" role="img" aria-label="Score ${res.score} out of ${res.total}">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" class="ring-bg"/>
              <circle cx="60" cy="60" r="52" class="ring-fg ${passed ? 'pass' : 'fail'}" style="stroke-dasharray:${circumference};stroke-dashoffset:${circumference}"/>
            </svg>
            <div class="score-ring-text"><strong>${res.score}/${res.total}</strong><span>${res.percent}%</span></div>
          </div>
          <p class="result-emoji" aria-hidden="true">${title.emoji}</p>
          <h2 id="results-title" class="result-title">${title.title}</h2>
          <p class="result-msg">${title.message}</p>
          ${starsHTML(Math.max(0, res.percent >= 100 ? 3 : res.percent >= 80 ? 2 : res.percent >= 70 ? 1 : 0))}

          <ul class="result-stats">
            <li><strong>+${outcome.xpGained}</strong><span>new XP${outcome.xpGained === 0 && this.store.peek(L.id).attempts > 1 ? ' (only your best score counts)' : ''}</span></li>
            ${L.final ? `<li><strong>${res.bonus}</strong><span>speed bonus</span></li>` : ''}
            <li><strong>${this.store.totalXP()}</strong><span>total XP</span></li>
            <li><strong>${this.store.level().current.name}</strong><span>your rank</span></li>
          </ul>

          ${outcome.newBadge ? `
            <div class="badge-earned" style="--c:${L.color}">
              <span class="badge-medal">${icon(L.icon)}</span>
              <div><small>New badge unlocked!</small><strong>${L.badge}</strong></div>
            </div>` : ''}

          ${!passed ? `<p class="muted">Score ${CQ.SCORING.PASS_PERCENT}% or more to complete this lesson${L.final ? ' and unlock your certificate' : ' and earn the badge'}.</p>` : ''}

          <div class="btn-row center">
            <button type="button" class="btn btn-secondary" id="retry-btn">${icon('refresh')} ${L.final ? 'New challenge' : 'Try again'}</button>
            ${!L.final && next ? `<a class="btn btn-primary" href="#/lesson/${next.id}">Next: ${next.title} ${icon('arrowRight')}</a>` : ''}
            ${L.final ? `<a class="btn btn-primary" href="#/progress">${icon('chart')} See my progress</a>` : `<a class="btn btn-ghost" href="#/lessons">${icon('grid')} All lessons</a>`}
          </div>
        </section>

        ${L.final && passed ? `
          <section class="certificate" id="certificate" aria-label="Certificate">
            <div class="cert-inner">
              <span class="cert-seal">${icon('logo')}</span>
              <p class="cert-kicker">Certificate of Completion</p>
              <p class="cert-small">This certifies that</p>
              <h2 class="cert-name">${esc(name)}</h2>
              <p class="cert-small">has completed the <strong>CyberQuest Cybersecurity Awareness Game</strong> and earned the rank of</p>
              <p class="cert-rank">${title.title.replace('!', '')}</p>
              <p class="cert-meta">Final challenge score: ${res.score}/${res.total} (${res.percent}%) · ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div class="btn-row center no-print"><button type="button" class="btn btn-secondary" id="print-btn">${icon('printer')} Print certificate</button></div>
          </section>` : ''}

        <details class="review card">
          <summary>${icon('eye')} Review your answers</summary>
          <ol class="review-list">
            ${res.answers.map(a => {
              const q = a.question;
              return `
                <li class="${a.correct ? 'ok' : 'bad'}">
                  <p class="rv-q">${a.correct ? '✅' : '❌'} ${q.prompt}</p>
                  <p>Your answer: <strong>${a.choice >= 0 ? q.options[a.choice] : 'No answer (time ran out)'}</strong></p>
                  ${a.correct ? '' : `<p>Correct answer: <strong>${q.options[q.answer]}</strong></p>`}
                  <p class="rv-explain">${q.explain}</p>
                </li>`;
            }).join('')}
          </ol>
        </details>`;

      // Animate the score ring after it is on screen.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const ring = this.stage.querySelector('.ring-fg');
        if (ring) ring.style.strokeDashoffset = circumference * (1 - res.score / res.total);
      }));

      this.stage.querySelector('#retry-btn').addEventListener('click', () => this.app.route(true));
      const printBtn = this.stage.querySelector('#print-btn');
      if (printBtn) printBtn.addEventListener('click', () => window.print());

      // Celebrate!
      if (passed) {
        this.app.sound.play('win');
        if (res.percent === 100 || outcome.newBadge) this.app.confetti.burst();
      }
      if (outcome.newBadge) CQ.toast(`${icon('award')} Badge unlocked: <strong>${L.badge}</strong>`, 'badge');

      window.scrollTo({ top: 0, behavior: 'auto' });
      this.stage.querySelector('#results-title').setAttribute('tabindex', '-1');
      this.stage.querySelector('#results-title').focus({ preventScroll: true });
    }
  }

  /* ==================================================================
   * PROGRESS
   * ================================================================== */
  class ProgressView extends View {
    get title() { return 'My Progress'; }
    get nav() { return 'progress'; }

    render() {
      const s = this.store;
      const lvl = s.level();
      const name = s.playerName;
      const badges = CQ.LESSONS.filter(l => s.status(l.id) === 'completed').length;
      const lessonTitle = id => (getLesson(id) || {}).title || `Lesson ${id}`;

      return `
        <section class="page-head">
          <div class="container">
            <p class="eyebrow">${icon('chart')} Dashboard</p>
            <h1>My Progress</h1>
            <p class="lead">Track your XP, rank, badges and quiz history.</p>
          </div>
        </section>

        <div class="container page-body">
          <div class="progress-top">
            <div class="card player-card">
              <span class="avatar avatar-lg" aria-hidden="true">${name ? esc(name.charAt(0).toUpperCase()) : icon('user')}</span>
              <div class="player-info">
                <form id="rename-form" class="rename-form" autocomplete="off">
                  <label class="field-label" for="rename-input">Agent nickname</label>
                  <div class="name-row">
                    <input id="rename-input" type="text" maxlength="24" value="${esc(name)}" placeholder="Choose a nickname">
                    <button class="btn btn-secondary btn-sm" type="submit">Save</button>
                  </div>
                </form>
                <p class="rank-line">Rank: <strong>${lvl.current.name}</strong> · ${lvl.xp} XP</p>
                <div class="progress-bar lg"><span style="width:${lvl.progress}%"></span></div>
                <p class="muted small">${lvl.next ? `${lvl.next.min - lvl.xp} XP to reach <strong>${lvl.next.name}</strong>` : 'Maximum rank reached — legendary! 🏆'}</p>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat"><span class="stat-icon">${icon('zap')}</span><strong>${lvl.xp}</strong><span>Total XP</span></div>
              <div class="stat"><span class="stat-icon">${icon('book')}</span><strong>${s.completedCount()}/10</strong><span>Lessons completed</span></div>
              <div class="stat"><span class="stat-icon">${icon('award')}</span><strong>${badges}</strong><span>Badges earned</span></div>
              <div class="stat"><span class="stat-icon">${icon('target')}</span><strong>${s.quizzesTaken()}</strong><span>Quizzes taken</span></div>
            </div>
          </div>

          <h2 class="section-heading">Badges</h2>
          <div class="badge-grid">
            ${CQ.LESSONS.map(l => {
              const earned = s.status(l.id) === 'completed';
              return `
                <a class="badge ${earned ? 'earned' : 'locked'}" href="#/lesson/${l.id}" style="--c:${l.color}" aria-label="${l.badge} badge, ${earned ? 'earned' : 'locked'}">
                  <span class="badge-medal">${earned ? icon(l.icon) : icon('lock')}</span>
                  <strong>${l.badge}</strong>
                  <small>${earned ? 'Earned' : `Pass Lesson ${l.id}`}</small>
                </a>`;
            }).join('')}
          </div>

          <h2 class="section-heading">Lesson scores</h2>
          <div class="table-wrap card">
            <table>
              <thead><tr><th scope="col">Lesson</th><th scope="col">Status</th><th scope="col">Best score</th><th scope="col">Stars</th><th scope="col">Attempts</th><th scope="col">XP</th></tr></thead>
              <tbody>
                ${CQ.LESSONS.map(l => {
                  const rec = s.peek(l.id);
                  return `<tr>
                    <td><a href="#/lesson/${l.id}">${l.id}. ${l.title}</a></td>
                    <td>${statusChip(s.status(l.id))}</td>
                    <td>${rec && rec.attempts ? `${rec.bestScore}/${rec.total} (${rec.bestPercent}%)` : '—'}</td>
                    <td>${starsHTML(s.stars(l.id))}</td>
                    <td>${rec ? rec.attempts : 0}</td>
                    <td>${s.lessonXP(l.id)}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>

          <h2 class="section-heading">Recent quiz attempts</h2>
          ${s.history.length ? `
            <div class="table-wrap card">
              <table>
                <thead><tr><th scope="col">Date</th><th scope="col">Lesson</th><th scope="col">Score</th><th scope="col">Result</th></tr></thead>
                <tbody>
                  ${s.history.slice(0, 10).map(h => `<tr>
                    <td>${CQ.formatDate(h.date)}</td>
                    <td>${esc(lessonTitle(h.lessonId))}</td>
                    <td>${h.score}/${h.total} (${h.percent}%)${h.bonus ? ` +${h.bonus} bonus` : ''}</td>
                    <td>${h.percent >= CQ.SCORING.PASS_PERCENT ? '<span class="chip chip-success">Passed</span>' : '<span class="chip chip-warn">Not yet</span>'}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>` : `
            <div class="empty card"><p>No quizzes taken yet. <a href="#/lesson/1">Start with Lesson 1</a> — it only takes a few minutes!</p></div>`}

          <h2 class="section-heading">Your saved data</h2>
          <div class="card data-card">
            <p>Your progress is saved <strong>only in this browser</strong> using <code>localStorage</code> (key: <code>${CQ.STORAGE_KEY}</code>). Nothing is sent to any server. You can download a copy or erase everything.</p>
            <div class="btn-row">
              <button type="button" class="btn btn-secondary" id="export-btn">${icon('download')} Download my progress (JSON)</button>
              <button type="button" class="btn btn-danger-ghost" id="reset-btn">${icon('refresh')} Reset all progress</button>
            </div>
          </div>
        </div>`;
    }

    mount(root) {
      root.querySelector('#rename-form').addEventListener('submit', e => {
        e.preventDefault();
        const value = root.querySelector('#rename-input').value.trim();
        if (!value) return CQ.toast('Please enter a nickname.', 'error');
        this.store.setPlayerName(value);
        CQ.toast(`Nickname saved: <strong>${esc(value)}</strong>`, 'success');
        this.app.route(true);
      });

      // Download the saved progress as a .json file.
      root.querySelector('#export-btn').addEventListener('click', () => {
        const blob = new Blob([this.store.exportJSON()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cyberquest-progress.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });

      root.querySelector('#reset-btn').addEventListener('click', () => {
        if (window.confirm('Erase all CyberQuest progress, XP and badges? This cannot be undone.')) {
          this.store.reset();
          CQ.toast('Progress reset. Fresh start!', 'info');
          this.app.route(true);
        }
      });
    }
  }

  /* ==================================================================
   * HELP / HOW TO PLAY
   * ================================================================== */
  class HelpView extends View {
    get title() { return 'How to Play'; }
    get nav() { return 'help'; }

    render() {
      const glossary = [
        ['Phishing', 'Pretending to be a trusted person or organization to steal information or money.'],
        ['Smishing / Vishing', 'Phishing by text message (SMS) / by voice call.'],
        ['Spear phishing', 'A targeted phishing message that uses details about you to look believable.'],
        ['Social engineering', 'Manipulating people into breaking security rules.'],
        ['Malware', 'Malicious software such as viruses, ransomware or spyware.'],
        ['Two-factor authentication (2FA)', 'Logging in with two different types of proof, e.g. a password plus a phone code.'],
        ['Password manager', 'An app that creates, stores and fills in unique passwords for you.'],
        ['Evil twin', 'A fake Wi-Fi hotspot that imitates a real one.'],
        ['VPN', 'A Virtual Private Network that encrypts your internet traffic.'],
        ['PII', 'Personally identifiable information — data that can identify you.']
      ];
      return `
        <section class="page-head">
          <div class="container">
            <p class="eyebrow">${icon('help')} Help</p>
            <h1>How to Play</h1>
            <p class="lead">Everything you need to know to become a Cyber Detective.</p>
          </div>
        </section>
        <div class="container page-body help-grid">
          <div>
            <h2 class="section-heading">Getting started</h2>
            <ol class="steps-list">
              <li><strong>Choose a nickname</strong> on the Home page and press <em>Start the mission</em>.</li>
              <li><strong>Open a lesson</strong> from the <a href="#/lessons">Lessons</a> page. Lessons can be played in any order, but the numbered order is recommended.</li>
              <li><strong>Learn:</strong> read the short sections and the key takeaways.</li>
              <li><strong>Practice:</strong> complete the interactive activity (it shows a green “Done” label when finished).</li>
              <li><strong>Quiz:</strong> press <em>Start the quiz</em>, pick an answer and read the instant feedback.</li>
              <li><strong>Results:</strong> see your score, stars, XP and badge. Review your answers, retry, or go to the next lesson.</li>
              <li><strong>Final challenge:</strong> Lesson 10 is a timed, randomized quiz. Score 70%+ for a printable certificate.</li>
            </ol>

            <h2 class="section-heading">Scoring</h2>
            <div class="table-wrap card">
              <table>
                <tbody>
                  <tr><th scope="row">Correct answer</th><td>+${CQ.SCORING.XP_PER_CORRECT} XP</td></tr>
                  <tr><th scope="row">Passing a lesson (70%+)</th><td>+${CQ.SCORING.XP_COMPLETION_BONUS} XP and a badge</td></tr>
                  <tr><th scope="row">Final challenge speed bonus</th><td>up to +5 XP per question</td></tr>
                  <tr><th scope="row">Stars</th><td>★ 70%+ · ★★ 80%+ · ★★★ 100%</td></tr>
                  <tr><th scope="row">Replays</th><td>Only your best score counts, so feel free to retry!</td></tr>
                </tbody>
              </table>
            </div>

            <h2 class="section-heading">Ranks</h2>
            <ul class="rank-list">
              ${CQ.LEVELS.map(l => `<li><strong>${l.name}</strong><span>${l.min}+ XP</span></li>`).join('')}
            </ul>
          </div>

          <div>
            <h2 class="section-heading">Keyboard shortcuts</h2>
            <div class="card">
              <ul class="kbd-list">
                <li><kbd>Tab</kbd> move between buttons and links</li>
                <li><kbd>Enter</kbd> / <kbd>Space</kbd> press the focused button</li>
                <li><kbd>A</kbd>–<kbd>D</kbd> or <kbd>1</kbd>–<kbd>4</kbd> answer a quiz question</li>
                <li><kbd>Enter</kbd> go to the next question</li>
              </ul>
            </div>

            <h2 class="section-heading">Glossary</h2>
            <dl class="glossary card">
              ${glossary.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}
            </dl>

            <h2 class="section-heading">Privacy</h2>
            <div class="card">
              <p>CyberQuest does not use accounts, cookies or servers. Your nickname and scores are stored only in your browser's local storage, and you can erase them at any time from <a href="#/progress">My Progress</a>. The password lab never saves what you type.</p>
            </div>
          </div>
        </div>`;
    }
  }

  /* ==================================================================
   * 404
   * ================================================================== */
  class NotFoundView extends View {
    get title() { return 'Page not found'; }
    static markup() {
      return `
        <section class="container not-found">
          <p class="result-emoji" aria-hidden="true">🕳️</p>
          <h1>Page not found</h1>
          <p class="lead">This link leads nowhere — good thing you didn't enter a password! 😉</p>
          <a class="btn btn-primary" href="#/">${icon('arrowLeft')} Back to home</a>
        </section>`;
    }
    render() { return NotFoundView.markup(); }
  }

  CQ.Views = { HomeView, LessonsView, LessonView, QuizView, ProgressView, HelpView, NotFoundView };
})();
