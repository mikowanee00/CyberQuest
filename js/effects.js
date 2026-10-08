/* =====================================================================
 * effects.js — Feedback effects
 * ---------------------------------------------------------------------
 *   CQ.toast()     short pop-up messages (also read out by screen readers)
 *   CQ.Sound       tiny sound effects generated with the Web Audio API
 *   CQ.Confetti    celebration animation drawn on a <canvas>
 * No audio or image files are needed — everything is generated in code.
 * ===================================================================== */
window.CQ = window.CQ || {};

(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * Toasts
   * ------------------------------------------------------------------ */

  /**
   * Shows a small message in the bottom corner for a few seconds.
   * @param {string} message  HTML allowed (only pass trusted text)
   * @param {'info'|'success'|'error'|'badge'} type
   */
  CQ.toast = function (message, type) {
    const region = document.getElementById('toast-region');
    if (!region) return;
    const el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'info');
    el.innerHTML = message;
    region.appendChild(el);
    // Fade out, then remove from the page.
    setTimeout(() => el.classList.add('toast-hide'), 3200);
    setTimeout(() => el.remove(), 3700);
  };

  /* ------------------------------------------------------------------
   * Sound effects
   * ------------------------------------------------------------------ */
  class Sound {
    constructor(store) {
      this.store = store;
      this.ctx = null; // AudioContext is created on first use (browsers require a user gesture)
    }

    get enabled() {
      return !!this.store.getSetting('sound');
    }

    toggle() {
      this.store.setSetting('sound', !this.enabled);
      if (this.enabled) this.play('click');
      return this.enabled;
    }

    /** Plays one short tone. */
    tone(freq, start, duration, type, volume) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume || 0.12, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration + 0.02);
    }

    /** @param {'correct'|'wrong'|'win'|'click'} kind */
    play(kind) {
      if (!this.enabled) return;
      try {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        switch (kind) {
          case 'correct':
            this.tone(660, 0, 0.12, 'sine');
            this.tone(880, 0.1, 0.18, 'sine');
            break;
          case 'wrong':
            this.tone(220, 0, 0.25, 'square', 0.06);
            break;
          case 'win':
            [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.11, 0.22, 'triangle'));
            break;
          default:
            this.tone(500, 0, 0.05, 'sine', 0.06);
        }
      } catch (err) {
        // Audio is a nice-to-have; ignore browsers that block it.
      }
    }
  }
  CQ.Sound = Sound;

  /* ------------------------------------------------------------------
   * Confetti
   * ------------------------------------------------------------------ */
  class Confetti {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.pieces = [];
      this.running = false;
      this.colors = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ec4899', '#ef4444'];
    }

    /** Launches a burst of confetti (skipped if the user prefers reduced motion). */
    burst(amount) {
      if (!this.ctx || CQ.prefersReducedMotion()) return;
      this.resize();
      const count = amount || 140;
      for (let i = 0; i < count; i++) {
        this.pieces.push({
          x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: this.canvas.height * 0.35,
          vx: (Math.random() - 0.5) * 14,
          vy: Math.random() * -14 - 4,
          size: Math.random() * 7 + 5,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          color: this.colors[i % this.colors.length],
          life: 0
        });
      }
      if (!this.running) {
        this.running = true;
        requestAnimationFrame(() => this.frame());
      }
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    /** One animation step: move, rotate and fade every piece. */
    frame() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.pieces.forEach(p => {
        p.vy += 0.35;   // gravity
        p.vx *= 0.99;   // air resistance
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;
        p.life += 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - p.life / 160);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      // Remove pieces that faded out or fell off the screen.
      this.pieces = this.pieces.filter(p => p.life < 160 && p.y < this.canvas.height + 40);
      if (this.pieces.length) {
        requestAnimationFrame(() => this.frame());
      } else {
        this.running = false;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }
  CQ.Confetti = Confetti;
})();
