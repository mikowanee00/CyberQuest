/* =====================================================================
 * app.js — App class (start-up, router, header, theme)
 * ---------------------------------------------------------------------
 * CyberQuest is a single-page application. Instead of loading separate
 * HTML files, the part of the URL after "#" decides which view to show:
 *
 *   #/            → HomeView         #/quiz/3     → QuizView (lesson 3)
 *   #/lessons     → LessonsView      #/progress   → ProgressView
 *   #/lesson/3    → LessonView       #/help       → HelpView
 *
 * When the hash changes, the router destroys the old view, renders the
 * new one into <main>, and updates the menu, title and XP counter.
 * Using the hash means the browser Back/Forward buttons work and the
 * site runs on any static host (or straight from the file system).
 * ===================================================================== */
window.CQ = window.CQ || {};

(function () {
  'use strict';

  const icon = (name, cls) => CQ.icon(name, cls);
  const V = CQ.Views;

  class App {
    constructor() {
      this.store = new CQ.ProgressStore();
      this.sound = new CQ.Sound(this.store);
      this.confetti = new CQ.Confetti(document.getElementById('confetti'));
      this.main = document.getElementById('main');
      this.currentView = null;

      // Route table: URL pattern → view class. Captured groups become view params.
      this.routes = [
        { pattern: /^\/?$/, view: V.HomeView },
        { pattern: /^\/lessons\/?$/, view: V.LessonsView },
        { pattern: /^\/lesson\/(\d+)\/?$/, view: V.LessonView },
        { pattern: /^\/quiz\/(\d+)\/?$/, view: V.QuizView },
        { pattern: /^\/progress\/?$/, view: V.ProgressView },
        { pattern: /^\/help\/?$/, view: V.HelpView }
      ];
    }

    /** Called once when the page loads. */
    start() {
      document.getElementById('brand-mark').innerHTML = icon('logo');
      this.initTheme();
      this.initSound();
      this.initMenu();
      this.initLinkPreview();

      window.addEventListener('hashchange', () => this.route());
      this.route();
    }

    /* ---------------- Router ---------------- */

    /**
     * Shows the view that matches the current URL hash.
     * @param {boolean} force re-render even if the hash did not change (e.g. "Try again")
     */
    route(force) {
      const hash = window.location.hash;
      // In-page anchors like "#main" (skip link) are not routes — ignore them.
      if (hash && !hash.startsWith('#/') && this.currentView && !force) return;

      const path = hash.startsWith('#/') ? hash.slice(1) : '/';
      let ViewClass = V.NotFoundView;
      let params = [];
      for (const r of this.routes) {
        const match = path.match(r.pattern);
        if (match) {
          ViewClass = r.view;
          params = match.slice(1);
          break;
        }
      }

      if (this.currentView) this.currentView.destroy();
      const view = new ViewClass(this, params);
      this.currentView = view;

      this.main.innerHTML = view.render();
      view.mount(this.main);

      document.title = `${view.title} · CyberQuest`;
      this.setActiveNav(view.nav);
      this.updateHeader();
      this.closeMenu();

      // Start each page at the top and move keyboard focus to the content.
      window.scrollTo(0, 0);
      if (!(view instanceof V.QuizView)) this.main.focus({ preventScroll: true });
    }

    /* ---------------- Header ---------------- */

    setActiveNav(name) {
      document.querySelectorAll('[data-nav]').forEach(a => {
        const active = a.dataset.nav === name;
        a.classList.toggle('is-active', active);
        if (active) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }

    /** Refreshes the XP / rank pill in the header. */
    updateHeader() {
      const lvl = this.store.level();
      document.getElementById('xp-pill').innerHTML =
        `${icon('zap')} <strong>${lvl.xp}</strong><span class="xp-word">&nbsp;XP</span> <span class="xp-rank">· ${lvl.current.name}</span>`;
    }

    /* Mobile hamburger menu */
    initMenu() {
      const toggle = document.getElementById('nav-toggle');
      const nav = document.getElementById('site-nav');
      toggle.innerHTML = icon('menu');
      toggle.addEventListener('click', () => {
        const open = !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        toggle.innerHTML = icon(open ? 'x' : 'menu');
      });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') this.closeMenu(); });
    }

    closeMenu() {
      const toggle = document.getElementById('nav-toggle');
      const nav = document.getElementById('site-nav');
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.innerHTML = icon('menu');
    }

    /* ---------------- Theme (light / dark) ---------------- */

    initTheme() {
      const saved = this.store.getSetting('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(saved || (prefersDark ? 'dark' : 'light'));
      document.getElementById('theme-toggle').addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        this.store.setSetting('theme', nextTheme);
      });
    }

    applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
      const btn = document.getElementById('theme-toggle');
      btn.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.title = btn.getAttribute('aria-label');
    }

    /* ---------------- Sound on/off ---------------- */

    initSound() {
      const btn = document.getElementById('sound-toggle');
      const paint = () => {
        const on = this.sound.enabled;
        btn.innerHTML = icon(on ? 'volume' : 'volumeOff');
        btn.setAttribute('aria-pressed', String(on));
        btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
        btn.title = btn.getAttribute('aria-label');
      };
      paint();
      btn.addEventListener('click', () => {
        const on = this.sound.toggle();
        paint();
        CQ.toast(on ? `${icon('volume')} Sound effects on` : `${icon('volumeOff')} Sound effects off`, 'info');
      });
    }

    /* ---------------- Link preview ("hover to check the link") ----------------
     * Mock emails contain fake links with a data-href attribute. Hovering or
     * focusing one shows its real destination in the email's status bar,
     * just like a real browser — the key skill taught in Lesson 2.
     */
    initLinkPreview() {
      const show = (target, on) => {
        const link = target.closest && target.closest('[data-href]');
        if (!link) return;
        const box = link.closest('.has-status');
        const bar = box && box.querySelector('.status-bar');
        if (!bar) return;
        bar.textContent = on ? link.dataset.href : '';
        bar.classList.toggle('show', on);
      };
      document.addEventListener('mouseover', e => show(e.target, true));
      document.addEventListener('mouseout', e => show(e.target, false));
      document.addEventListener('focusin', e => show(e.target, true));
      document.addEventListener('focusout', e => show(e.target, false));
    }
  }

  // Start the app once the HTML is ready.
  document.addEventListener('DOMContentLoaded', () => {
    CQ.app = new App();
    CQ.app.start();
  });
})();
