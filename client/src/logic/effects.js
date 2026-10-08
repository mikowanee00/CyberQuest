/* =====================================================================
 * logic/effects.js — Sound effects, confetti and small browser helpers
 * No audio or image files: sounds are generated with the Web Audio API
 * and confetti is drawn on a <canvas>.
 * ===================================================================== */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
 * Sound (off by default; the choice is remembered in localStorage)
 * ------------------------------------------------------------------ */
class Sound {
  constructor() {
    this.ctx = null;
    try { this.enabled = localStorage.getItem('cyberquest.sound') === 'on'; } catch { this.enabled = false; }
  }

  toggle() {
    this.enabled = !this.enabled;
    try { localStorage.setItem('cyberquest.sound', this.enabled ? 'on' : 'off'); } catch { /* ignore */ }
    if (this.enabled) this.play('click');
    return this.enabled;
  }

  tone(freq, start, duration, type = 'sine', volume = 0.12) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration + 0.02);
  }

  /** kind: 'correct' | 'wrong' | 'win' | 'click' */
  play(kind) {
    if (!this.enabled) return;
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      if (kind === 'correct') { this.tone(660, 0, 0.12); this.tone(880, 0.1, 0.18); }
      else if (kind === 'wrong') this.tone(220, 0, 0.25, 'square', 0.06);
      else if (kind === 'win') [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.11, 0.22, 'triangle'));
      else this.tone(500, 0, 0.05, 'sine', 0.06);
    } catch { /* audio is optional */ }
  }
}
export const sound = new Sound();

/* ------------------------------------------------------------------
 * Confetti
 * ------------------------------------------------------------------ */
class Confetti {
  constructor() {
    this.canvas = null;
    this.pieces = [];
    this.running = false;
    this.colors = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ec4899', '#ef4444'];
  }

  attach(canvas) {
    if (canvas) this.canvas = canvas;
  }

  burst(amount = 140) {
    if (!this.canvas || prefersReducedMotion()) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    for (let i = 0; i < amount; i++) {
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

  /** One animation step: gravity, movement, rotation and fading. */
  frame() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pieces.forEach(p => {
      p.vy += 0.35;
      p.vx *= 0.99;
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
    this.pieces = this.pieces.filter(p => p.life < 160 && p.y < this.canvas.height + 40);
    if (this.pieces.length) requestAnimationFrame(() => this.frame());
    else { this.running = false; ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
  }
}
export const confetti = new Confetti();

/** "Oct 7, 2026, 3:15 PM" */
export function formatDate(value) {
  try {
    return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return String(value);
  }
}
