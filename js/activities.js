/* =====================================================================
 * activities.js — Interactive "Practice" activities
 * ---------------------------------------------------------------------
 * Every lesson has one hands-on activity. Each activity type is a class
 * that extends the base `Activity` class:
 *
 *   FlipCards     – tap cards to reveal definitions        (lesson 1)
 *   HotspotHunt   – click the red flags in a mock screen    (lessons 2, 5)
 *   PasswordLab   – live password-strength meter            (lesson 3)
 *   ChatScenario  – branching chat with a social engineer   (lesson 4)
 *   ChoiceExplorer– compare options (Wi-Fi networks)        (lesson 6)
 *   Sorter        – sort items into groups (drag or click)  (lessons 7, 9)
 *   Triage        – rapid-fire "scam or legit?" cards       (lesson 8)
 *
 * CQ.Activities.create(type, container, config, onComplete) is a small
 * factory that picks the right class from the lesson data.
 *
 * CQ.Visuals renders realistic-looking emails, texts and pop-ups that
 * are shared by the activities and the quiz.
 * ===================================================================== */
window.CQ = window.CQ || {};

(function () {
  'use strict';

  const icon = (name, cls) => CQ.icon(name, cls);
  const sound = kind => { if (CQ.app) CQ.app.sound.play(kind); };

  /* ==================================================================
   * Visuals — mock emails, SMS, pop-ups, notifications, listings
   * ================================================================== */
  CQ.Visuals = {
    render(v) {
      if (!v) return '';
      const fn = this[v.type];
      return fn ? fn.call(this, v) : '';
    },

    email(v) {
      return `
        <div class="v-email has-status">
          <div class="mock-toolbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="mock-app">Inbox</span></div>
          <div class="v-email-head">
            <div class="v-subject">${v.subject}</div>
            <div class="v-from">
              <span class="avatar" aria-hidden="true">${v.fromName.charAt(0)}</span>
              <div><strong>${v.fromName}</strong> <span class="v-addr">&lt;${v.fromAddr}&gt;</span><div class="v-to">to me</div></div>
            </div>
          </div>
          <div class="v-email-body">${v.body}</div>
          ${v.attachment ? `<div class="mock-attach">📎 ${v.attachment}</div>` : ''}
          <div class="status-bar" aria-hidden="true"></div>
        </div>`;
    },

    sms(v) {
      return `
        <div class="v-phone">
          <div class="v-phone-top"><span class="avatar avatar-sm" aria-hidden="true">${icon('message')}</span><div><strong>${v.sender}</strong><small>${v.number || 'Text message'}</small></div></div>
          <div class="v-phone-body">
            <div class="bubble bubble-them">${v.text}</div>
            <small class="v-time">Today 9:41 AM</small>
          </div>
        </div>`;
    },

    popup(v) {
      return `
        <div class="v-popup">
          <div class="v-popup-bar"><span>${v.title}</span><span aria-hidden="true">✕</span></div>
          <div class="v-popup-body">
            <div class="v-popup-icon" aria-hidden="true">⚠</div>
            <p>${v.text}</p>
            ${v.cta ? `<span class="v-popup-btn">${v.cta}</span>` : ''}
          </div>
        </div>`;
    },

    notification(v) {
      return `
        <div class="v-notif">
          <span class="v-notif-icon" aria-hidden="true">${v.app.charAt(0)}</span>
          <div><div class="v-notif-top"><strong>${v.app}</strong><small>now</small></div><p>${v.text}</p></div>
        </div>`;
    },

    listing(v) {
      return `
        <div class="v-listing">
          <div class="v-listing-img" aria-hidden="true">🏠</div>
          <div class="v-listing-info">
            <strong>${v.title}</strong>
            <div class="v-price">${v.price}</div>
            <p>${v.text}</p>
            <small>${v.seller}</small>
          </div>
        </div>`;
    }
  };

  /* ==================================================================
   * Base class
   * ================================================================== */
  class Activity {
    /**
     * @param {HTMLElement} el        element the activity is drawn into
     * @param {object}      config    the lesson's `activity` object
     * @param {Function}    onComplete called once when the activity is finished
     */
    constructor(el, config, onComplete) {
      this.el = el;
      this.config = config;
      this.onComplete = onComplete;
      this.done = false;
      this.alive = true;
    }

    /** Draws the activity. Implemented by each subclass. */
    render() {}

    /** Marks the activity as finished (only fires once). */
    complete() {
      if (this.done) return;
      this.done = true;
      if (typeof this.onComplete === 'function') this.onComplete();
    }

    /** Called when the user leaves the page (stops timers etc.). */
    destroy() {
      this.alive = false;
    }

    /** Shared header text for every activity. */
    hint() {
      return `<p class="activity-hint">${icon('bulb')} <span>${this.config.instructions}</span></p>`;
    }
  }

  /* ==================================================================
   * FlipCards
   * ================================================================== */
  class FlipCards extends Activity {
    render() {
      const cards = this.config.cards;
      this.flipped = new Set();
      this.el.innerHTML = `
        ${this.hint()}
        <div class="flip-grid">
          ${cards.map((c, i) => `
            <button type="button" class="flip-card" data-i="${i}" aria-pressed="false" aria-label="${c.title} — flip card">
              <span class="flip-inner">
                <span class="flip-face flip-front">
                  <span class="flip-emoji" aria-hidden="true">${c.emoji}</span>
                  <strong>${c.title}</strong>
                  <span class="flip-tap">Tap to flip ↻</span>
                </span>
                <span class="flip-face flip-back">
                  <strong>${c.title}</strong>
                  <span>${c.text}</span>
                  <em>Example: ${c.example}</em>
                </span>
              </span>
            </button>`).join('')}
        </div>
        <p class="activity-status" aria-live="polite">0 / ${cards.length} cards explored</p>`;

      const status = this.el.querySelector('.activity-status');
      this.el.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', () => {
          const flipped = card.classList.toggle('is-flipped');
          card.setAttribute('aria-pressed', String(flipped));
          this.flipped.add(card.dataset.i);
          sound('click');
          status.textContent = `${this.flipped.size} / ${cards.length} cards explored`;
          if (this.flipped.size === cards.length) {
            status.innerHTML = `${icon('check')} All ${cards.length} cards explored — nice!`;
            status.classList.add('is-done');
            this.complete();
          }
        });
      });
    }
  }

  /* ==================================================================
   * HotspotHunt — find the red flags in a mock email / post
   * Any element in the mock HTML with data-hs="key" becomes clickable.
   * Several elements may share one key (they count as one red flag).
   * ================================================================== */
  class HotspotHunt extends Activity {
    render() {
      const spots = this.config.spots;
      const total = Object.keys(spots).length;
      this.found = new Set();

      this.el.innerHTML = `
        ${this.hint()}
        <div class="hunt">
          <div class="hunt-stage">${this.config.html}</div>
          <aside class="hunt-side" aria-label="Red flags found">
            <div class="hunt-counter"><span class="hunt-count">0</span> / ${total} <span>red flags found</span></div>
            <div class="progress-bar"><span style="width:0%"></span></div>
            <ol class="hunt-list" aria-live="polite"></ol>
            <p class="hunt-empty muted">Click anything that looks suspicious…</p>
            <button type="button" class="btn btn-ghost btn-sm hunt-reveal">${icon('eye')} Show me the answers</button>
          </aside>
        </div>`;

      this.countEl = this.el.querySelector('.hunt-count');
      this.barEl = this.el.querySelector('.hunt-side .progress-bar span');
      this.listEl = this.el.querySelector('.hunt-list');
      this.total = total;

      // Turn every data-hs element into an accessible button.
      this.el.querySelectorAll('[data-hs]').forEach(node => {
        node.classList.add('hs');
        node.tabIndex = 0;
        node.setAttribute('role', 'button');
        node.addEventListener('click', () => this.find(node.dataset.hs));
        node.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.find(node.dataset.hs);
          }
        });
      });

      this.el.querySelector('.hunt-reveal').addEventListener('click', () => {
        Object.keys(spots).forEach(key => this.find(key, true));
      });
    }

    /** Records a found red flag and explains why it is suspicious. */
    find(key, revealed) {
      const spot = this.config.spots[key];
      if (!spot) return;
      if (this.found.has(key)) {
        // Clicking a red flag again just highlights its explanation.
        const li = this.listEl.querySelector(`[data-key="${key}"]`);
        if (li) { li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash'); }
        return;
      }
      this.found.add(key);
      this.el.querySelectorAll(`[data-hs="${key}"]`).forEach(n => n.classList.add('hs-found'));

      const li = document.createElement('li');
      li.dataset.key = key;
      li.innerHTML = `<strong>${spot.label}</strong><span>${spot.why}</span>`;
      this.listEl.appendChild(li);
      this.el.querySelector('.hunt-empty').hidden = true;

      this.countEl.textContent = this.found.size;
      this.barEl.style.width = (this.found.size / this.total) * 100 + '%';
      if (!revealed) sound('correct');

      if (this.found.size === this.total) {
        const btn = this.el.querySelector('.hunt-reveal');
        btn.outerHTML = `<p class="activity-status is-done">${icon('check')} ${revealed ? 'All red flags revealed.' : 'Amazing — you found every red flag!'}</p>`;
        this.complete();
      }
    }
  }

  /* ==================================================================
   * PasswordLab — live password-strength analysis
   * Runs entirely in the browser; nothing typed is stored or sent.
   * ================================================================== */
  const COMMON_PASSWORDS = [
    'password', '123456', '12345678', '123456789', 'qwerty', 'abc123', 'letmein', 'monkey', 'dragon',
    'football', 'baseball', 'iloveyou', 'admin', 'welcome', 'sunshine', 'princess', 'master', 'shadow',
    'superman', 'trustno1', 'login', 'starwars', 'hello', 'freedom', 'whatever', '111111', '123123',
    '000000', '654321', 'qazwsx', 'passw0rd', 'secret', 'computer', 'summer', 'winter', 'charlie'
  ];
  const KEY_SEQUENCES = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  const PASSPHRASE_WORDS = [
    'anchor', 'banjo', 'cactus', 'dolphin', 'ember', 'falcon', 'galaxy', 'harbor', 'igloo', 'jigsaw',
    'kettle', 'lantern', 'meadow', 'nectar', 'orbit', 'pancake', 'quartz', 'rocket', 'saddle', 'tundra',
    'umbrella', 'violin', 'walrus', 'yodel', 'zephyr', 'acorn', 'bramble', 'canyon', 'denim', 'eclipse',
    'fjord', 'gravel', 'hammock', 'island', 'jasmine', 'koala', 'lobster', 'mango', 'nimbus', 'oyster',
    'pepper', 'quiver', 'ribbon', 'sprout', 'tornado', 'unicorn', 'velvet', 'waffle', 'yonder', 'zigzag',
    'basil', 'comet', 'dune', 'fossil', 'glacier', 'helmet', 'ivory', 'jungle', 'kayak', 'lemon',
    'marble', 'noodle', 'olive', 'puzzle', 'raven', 'sapphire', 'tulip', 'voyage', 'wizard', 'yeti'
  ];

  class PasswordLab extends Activity {
    render() {
      this.el.innerHTML = `
        ${this.hint()}
        <div class="pw-lab">
          <label class="field-label" for="pw-input">Practice password <span class="muted">(never type a real one — nothing here is saved or sent)</span></label>
          <div class="pw-field">
            <input id="pw-input" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="64" placeholder="Type a password to test…">
            <button type="button" class="btn btn-ghost btn-sm pw-show" aria-pressed="false">${icon('eye')} Show</button>
          </div>
          <div class="pw-meter" data-level="-1" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
          <div class="pw-verdict" aria-live="polite"><strong class="pw-level">Start typing…</strong> <span class="pw-time"></span></div>
          <div class="pw-grid">
            <ul class="pw-checks" aria-label="Password checklist">
              <li data-check="length">At least 14 characters</li>
              <li data-check="lower">Lowercase letters</li>
              <li data-check="upper">Uppercase letters</li>
              <li data-check="digit">Numbers</li>
              <li data-check="symbol">Symbols, dashes or spaces</li>
              <li data-check="pattern">No common password or pattern</li>
            </ul>
            <ul class="pw-warnings" aria-live="polite"></ul>
          </div>
          <div class="pw-gen">
            <div><strong>Need inspiration?</strong> Generate a random 4-word passphrase.</div>
            <div class="pw-gen-row">
              <code class="pw-phrase">—</code>
              <button type="button" class="btn btn-secondary btn-sm pw-gen-btn">${icon('refresh')} Generate</button>
              <button type="button" class="btn btn-ghost btn-sm pw-try" disabled>Test it</button>
            </div>
          </div>
        </div>`;

      const input = this.el.querySelector('#pw-input');
      const showBtn = this.el.querySelector('.pw-show');
      const phraseEl = this.el.querySelector('.pw-phrase');
      const tryBtn = this.el.querySelector('.pw-try');

      input.addEventListener('input', () => this.update(input.value));

      showBtn.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        showBtn.setAttribute('aria-pressed', String(show));
        showBtn.innerHTML = `${icon('eye')} ${show ? 'Hide' : 'Show'}`;
      });

      this.el.querySelector('.pw-gen-btn').addEventListener('click', () => {
        phraseEl.textContent = PasswordLab.passphrase(4);
        tryBtn.disabled = false;
        sound('click');
      });

      tryBtn.addEventListener('click', () => {
        input.value = phraseEl.textContent;
        input.type = 'text';
        showBtn.innerHTML = `${icon('eye')} Hide`;
        showBtn.setAttribute('aria-pressed', 'true');
        this.update(input.value);
      });
    }

    /** Re-draws the meter, checklist and warnings for the typed value. */
    update(pw) {
      const result = PasswordLab.analyze(pw);
      const meter = this.el.querySelector('.pw-meter');
      meter.dataset.level = pw ? result.score : -1;

      this.el.querySelector('.pw-level').textContent = pw ? result.label : 'Start typing…';
      this.el.querySelector('.pw-time').textContent = pw ? `· Time to crack: ${result.crackTime}` : '';

      Object.keys(result.checks).forEach(name => {
        const li = this.el.querySelector(`[data-check="${name}"]`);
        if (li) li.classList.toggle('ok', !!pw && result.checks[name]);
      });

      this.el.querySelector('.pw-warnings').innerHTML = result.warnings
        .map(w => `<li>${icon('alert')} <span>${w}</span></li>`).join('');

      if (pw && result.score >= 3 && !this.done) {
        CQ.toast(`${icon('check')} Strong password created — activity complete!`, 'success');
        sound('correct');
        this.complete();
      }
    }

    /**
     * Estimates password strength.
     *   1. Character-pool entropy:  bits = length × log2(pool size)
     *   2. Penalties for common passwords, keyboard sequences, repeats, years
     *   3. Crack time assuming 10 billion guesses per second (offline attack)
     */
    static analyze(pw) {
      const checks = {
        length: pw.length >= 14,
        lower: /[a-z]/.test(pw),
        upper: /[A-Z]/.test(pw),
        digit: /\d/.test(pw),
        symbol: /[^A-Za-z0-9]/.test(pw),
        pattern: true
      };
      const warnings = [];

      let pool = 0;
      if (checks.lower) pool += 26;
      if (checks.upper) pool += 26;
      if (checks.digit) pool += 10;
      if (checks.symbol) pool += 33;
      let bits = pw.length * Math.log2(pool || 1);

      // Common passwords, including "l33t" swaps like P@ssw0rd! or password123
      const lower = pw.toLowerCase();
      const trimmed = lower.replace(/^[^a-z@$]+|[^a-z0-9@$]+$/g, '').replace(/\d+$/, '');
      const unLeet = trimmed.replace(/[@4]/g, 'a').replace(/0/g, 'o').replace(/[1!|]/g, 'i')
        .replace(/3/g, 'e').replace(/[$5]/g, 's').replace(/7/g, 't');
      if ([lower, trimmed, unLeet].some(c => c && COMMON_PASSWORDS.includes(c))) {
        checks.pattern = false;
        bits = Math.min(bits, 12);
        warnings.push('This is (or is based on) one of the most common passwords. Attackers try these first.');
      }

      // Keyboard / alphabet sequences such as 1234, abcd, qwer
      const hasSequence = KEY_SEQUENCES.some(seq => {
        const rev = seq.split('').reverse().join('');
        for (let i = 0; i <= lower.length - 4; i++) {
          const part = lower.substr(i, 4);
          if (seq.includes(part) || rev.includes(part)) return true;
        }
        return false;
      });
      if (hasSequence) {
        checks.pattern = false;
        bits -= 15;
        warnings.push('Contains a predictable sequence like “1234”, “abcd” or “qwer”.');
      }

      if (/(.)\1\1/.test(pw)) {
        checks.pattern = false;
        bits -= 10;
        warnings.push('Repeated characters (like “aaa”) add very little strength.');
      }

      if (/(19|20)\d{2}/.test(pw)) {
        bits -= 8;
        warnings.push('Looks like it contains a year — birth years are easy to guess.');
      }

      if (pw.length > 0 && pw.length < 8) {
        warnings.push('Very short passwords can be cracked almost instantly.');
      }

      bits = Math.max(0, bits);
      const levels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
      const score = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;

      // On average an attacker finds the password after trying half the possibilities.
      const seconds = Math.pow(2, bits) / 2 / 1e10;

      return { score, label: levels[score], bits: Math.round(bits), crackTime: PasswordLab.formatTime(seconds), checks, warnings };
    }

    /** Turns seconds into friendly text ("3 hours", "centuries"). */
    static formatTime(s) {
      if (s < 1) return 'instantly';
      const units = [
        ['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]
      ];
      if (s >= 31536000 * 1000) return 'centuries';
      for (const [name, size] of units) {
        if (s >= size) {
          const n = Math.floor(s / size);
          return `about ${n} ${name}${n === 1 ? '' : 's'}`;
        }
      }
      return 'instantly';
    }

    /** Builds a random passphrase using the browser's secure random generator. */
    static passphrase(wordCount) {
      const random = new Uint32Array(wordCount);
      window.crypto.getRandomValues(random);
      return Array.from(random, n => PASSPHRASE_WORDS[n % PASSPHRASE_WORDS.length]).join('-');
    }
  }

  /* ==================================================================
   * ChatScenario — branching conversation (a tiny state machine)
   * Each node has incoming messages and either choices or an ending.
   * ================================================================== */
  class ChatScenario extends Activity {
    render() {
      const c = this.config.contact;
      this.el.innerHTML = `
        ${this.hint()}
        <div class="chat">
          <div class="chat-header">
            <span class="avatar avatar-pink" aria-hidden="true">${c.name.charAt(0)}</span>
            <div><strong>${c.name}</strong><small>${c.subtitle}</small></div>
          </div>
          <div class="chat-log" role="log" aria-live="polite"></div>
          <div class="chat-choices"></div>
        </div>`;
      this.log = this.el.querySelector('.chat-log');
      this.choicesEl = this.el.querySelector('.chat-choices');
      this.restart();
    }

    restart() {
      this.run = (this.run || 0) + 1; // invalidates any conversation still "typing"
      this.log.innerHTML = '';
      this.goTo(this.config.start, this.run);
    }

    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, CQ.prefersReducedMotion() ? 0 : ms));
    }

    addBubble(who, html) {
      const b = document.createElement('div');
      b.className = `bubble bubble-${who}`;
      b.innerHTML = html;
      this.log.appendChild(b);
      this.log.scrollTop = this.log.scrollHeight;
      return b;
    }

    /** Shows a typing indicator, then the message. */
    async typeMessage(text, run) {
      const typing = this.addBubble('them typing', '<span></span><span></span><span></span>');
      await this.wait(700 + Math.min(text.length * 12, 900));
      typing.remove();
      if (!this.alive || run !== this.run) return false;
      this.addBubble('them', text);
      return true;
    }

    async goTo(nodeId, run) {
      const node = this.config.nodes[nodeId];
      this.choicesEl.innerHTML = '';
      for (const msg of node.messages || []) {
        const ok = await this.typeMessage(msg, run);
        if (!ok) return; // user restarted or left the page
      }
      if (node.end) return this.showEnding(node);

      this.choicesEl.innerHTML = `<p class="chat-prompt">How do you reply?</p>` +
        node.choices.map((ch, i) => `<button type="button" class="chat-choice" data-i="${i}">${ch.text}</button>`).join('');

      this.choicesEl.querySelectorAll('.chat-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          const choice = node.choices[+btn.dataset.i];
          this.choicesEl.innerHTML = '';
          this.addBubble('me', choice.text);
          if (choice.note) {
            const note = this.addBubble(`note note-${choice.tone}`, `${choice.tone === 'bad' ? '⚠️' : choice.tone === 'good' ? '✅' : '💭'} ${choice.note}`);
            note.setAttribute('role', 'note');
          }
          sound(choice.tone === 'bad' ? 'wrong' : 'click');
          this.goTo(choice.next, run);
        });
      });
      const first = this.choicesEl.querySelector('.chat-choice');
      if (first && this.alive) first.focus({ preventScroll: true });
    }

    showEnding(node) {
      const win = node.end === 'win';
      sound(win ? 'win' : 'wrong');
      this.choicesEl.innerHTML = `
        <div class="chat-ending ${win ? 'is-win' : 'is-lose'}">
          <strong>${win ? '🎉' : '😬'} ${node.title}</strong>
          <p>${node.text}</p>
          <button type="button" class="btn btn-secondary btn-sm chat-restart">${icon('refresh')} ${win ? 'Try another path' : 'Try again'}</button>
        </div>`;
      this.choicesEl.querySelector('.chat-restart').addEventListener('click', () => this.restart());
      this.complete();
    }

    destroy() {
      super.destroy();
      this.run += 1;
    }
  }

  /* ==================================================================
   * ChoiceExplorer — compare several options (e.g. Wi-Fi networks)
   * ================================================================== */
  class ChoiceExplorer extends Activity {
    render() {
      const opts = this.config.options;
      this.viewed = new Set();
      const ratingText = { best: 'Best choice', ok: 'OK with care', risky: 'Risky' };

      this.el.innerHTML = `
        ${this.hint()}
        <div class="explorer">
          <div class="wifi-panel">
            <div class="wifi-panel-head">${icon('wifi')} <strong>Wi-Fi</strong><span class="muted">Choose a network</span></div>
            <ul class="wifi-list">
              ${opts.map((o, i) => `
                <li><button type="button" class="wifi-item" data-i="${i}">
                  ${ChoiceExplorer.signal(o.signal)}
                  <span class="wifi-name"><strong>${o.label}</strong><small>${o.sub}</small></span>
                  <span class="wifi-lock" aria-label="${o.secured ? 'Secured' : 'Open'}">${o.secured ? icon('lock') : '<span class="open-tag">Open</span>'}</span>
                </button></li>`).join('')}
            </ul>
          </div>
          <div class="explorer-feedback" aria-live="polite">
            <p class="muted">${icon('arrowLeft')} Select a network to see if it is a good idea.</p>
          </div>
        </div>
        <p class="activity-status">0 / ${opts.length} networks checked</p>`;

      const feedback = this.el.querySelector('.explorer-feedback');
      const status = this.el.querySelector('.activity-status');

      this.el.querySelectorAll('.wifi-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const o = opts[+btn.dataset.i];
          this.el.querySelectorAll('.wifi-item').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active', 'is-viewed', `rate-${o.rating}`);
          this.viewed.add(btn.dataset.i);
          sound(o.rating === 'risky' ? 'wrong' : 'correct');

          feedback.innerHTML = `
            <span class="chip chip-${o.rating}">${ratingText[o.rating]}</span>
            <h4>${o.label}</h4>
            <p>${o.feedback}</p>`;

          status.textContent = `${this.viewed.size} / ${opts.length} networks checked`;
          if (this.viewed.size === opts.length) {
            status.innerHTML = `${icon('check')} You checked every network. Remember: mobile data or your own hotspot for anything sensitive!`;
            status.classList.add('is-done');
            this.complete();
          }
        });
      });
    }

    /** Small Wi-Fi signal-strength graphic (1–4 bars). */
    static signal(level) {
      let bars = '';
      for (let i = 1; i <= 4; i++) {
        bars += `<rect x="${(i - 1) * 5}" y="${16 - i * 4}" width="3.5" height="${i * 4}" rx="1" class="${i <= level ? 'on' : ''}"/>`;
      }
      return `<svg class="signal" viewBox="0 0 19 16" aria-label="Signal ${level} of 4">${bars}</svg>`;
    }
  }

  /* ==================================================================
   * Sorter — put items into the right group
   * Works with click-then-click (touch & keyboard friendly) and with
   * HTML5 drag-and-drop on desktop.
   * ================================================================== */
  class Sorter extends Activity {
    render() {
      const { buckets } = this.config;
      // Show items in a random order each time.
      this.items = CQ.shuffle(this.config.items.map((it, i) => Object.assign({ idx: i }, it)));
      this.placed = 0;
      this.selected = null;
      this.mistakes = 0;

      this.el.innerHTML = `
        ${this.hint()}
        <div class="sorter">
          <div class="sort-pool" aria-label="Items to sort">
            ${this.items.map(it => `<button type="button" class="sort-item" draggable="true" data-idx="${it.idx}" aria-pressed="false">${it.label}</button>`).join('')}
          </div>
          <div class="sort-buckets" style="--cols:${buckets.length}">
            ${buckets.map(b => `
              <div class="bucket" data-bucket="${b.id}">
                <button type="button" class="bucket-head" data-bucket="${b.id}">${b.label}<span class="bucket-cta">Place here</span></button>
                <ul class="bucket-items"></ul>
              </div>`).join('')}
          </div>
          <p class="sort-feedback" aria-live="polite"></p>
        </div>`;

      this.feedbackEl = this.el.querySelector('.sort-feedback');
      const sorterEl = this.el.querySelector('.sorter');

      // --- Click to select, click to place ---
      this.el.querySelectorAll('.sort-item').forEach(btn => {
        btn.addEventListener('click', () => this.select(btn));
        btn.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', btn.dataset.idx);
          e.dataTransfer.effectAllowed = 'move';
          this.select(btn, true);
        });
      });

      this.el.querySelectorAll('.bucket').forEach(bucket => {
        const id = bucket.dataset.bucket;
        bucket.querySelector('.bucket-head').addEventListener('click', () => {
          if (this.selected) this.place(this.selected, id);
          else this.say('Select an item first, then choose a group.', 'info');
        });
        // --- Drag and drop ---
        bucket.addEventListener('dragover', e => { e.preventDefault(); bucket.classList.add('is-over'); });
        bucket.addEventListener('dragleave', () => bucket.classList.remove('is-over'));
        bucket.addEventListener('drop', e => {
          e.preventDefault();
          bucket.classList.remove('is-over');
          const btn = this.el.querySelector(`.sort-item[data-idx="${e.dataTransfer.getData('text/plain')}"]`);
          if (btn) this.place(btn, id);
        });
      });

      this.sorterEl = sorterEl;
    }

    select(btn, force) {
      if (this.selected === btn && !force) {
        btn.classList.remove('is-selected');
        btn.setAttribute('aria-pressed', 'false');
        this.selected = null;
        this.sorterEl.classList.remove('has-selection');
        return;
      }
      this.el.querySelectorAll('.sort-item').forEach(b => { b.classList.remove('is-selected'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-selected');
      btn.setAttribute('aria-pressed', 'true');
      this.selected = btn;
      this.sorterEl.classList.add('has-selection');
    }

    /** Checks the chosen group and gives instant feedback. */
    place(btn, bucketId) {
      const item = this.config.items[+btn.dataset.idx];
      const bucket = this.config.buckets.find(b => b.id === bucketId);

      if (item.bucket === bucketId) {
        const li = document.createElement('li');
        li.innerHTML = `${icon('check')} ${item.label}`;
        this.el.querySelector(`.bucket[data-bucket="${bucketId}"] .bucket-items`).appendChild(li);
        btn.remove();
        this.placed += 1;
        this.say(`<strong>Correct!</strong> ${item.why}`, 'good');
        sound('correct');
      } else {
        this.mistakes += 1;
        btn.classList.remove('shake');
        void btn.offsetWidth; // restart the CSS animation
        btn.classList.add('shake');
        this.say(`<strong>Not quite.</strong> “${item.label}” doesn't belong in “${bucket.label.replace(/^\S+\s/, '')}”. Try another group.`, 'bad');
        sound('wrong');
      }

      this.selected = null;
      this.sorterEl.classList.remove('has-selection');
      this.el.querySelectorAll('.sort-item').forEach(b => { b.classList.remove('is-selected'); b.setAttribute('aria-pressed', 'false'); });

      if (this.placed === this.config.items.length) {
        this.el.querySelector('.sort-pool').innerHTML = `<p class="activity-status is-done">${icon('check')} All sorted${this.mistakes === 0 ? ' with zero mistakes — perfect!' : ` (${this.mistakes} ${this.mistakes === 1 ? 'retry' : 'retries'}).`}</p>`;
        this.complete();
      }
    }

    say(html, tone) {
      this.feedbackEl.className = `sort-feedback is-${tone}`;
      this.feedbackEl.innerHTML = html;
    }
  }

  /* ==================================================================
   * Triage — one card at a time: "Scam" or "Legit"?
   * ================================================================== */
  class Triage extends Activity {
    render() {
      this.index = 0;
      this.correct = 0;
      this.el.innerHTML = `${this.hint()}<div class="triage"></div>`;
      this.stage = this.el.querySelector('.triage');
      this.showCard();
    }

    showCard() {
      const cards = this.config.cards;
      const card = cards[this.index];
      this.stage.innerHTML = `
        <div class="triage-top"><span>Message ${this.index + 1} of ${cards.length}</span><span>${icon('check')} ${this.correct} correct</span></div>
        <div class="triage-card">${CQ.Visuals.render(card.visual)}</div>
        <div class="triage-actions">
          <button type="button" class="btn btn-danger btn-lg" data-answer="scam">🚩 Scam</button>
          <button type="button" class="btn btn-success btn-lg" data-answer="legit">✅ Legit</button>
        </div>
        <div class="triage-feedback" aria-live="polite"></div>`;

      this.stage.querySelectorAll('[data-answer]').forEach(btn => {
        btn.addEventListener('click', () => this.answer(btn.dataset.answer));
      });
    }

    answer(choice) {
      const cards = this.config.cards;
      const card = cards[this.index];
      const right = choice === card.answer;
      if (right) this.correct += 1;
      sound(right ? 'correct' : 'wrong');

      this.stage.querySelectorAll('[data-answer]').forEach(b => {
        b.disabled = true;
        if (b.dataset.answer === card.answer) b.classList.add('is-answer');
      });

      const last = this.index === cards.length - 1;
      const fb = this.stage.querySelector('.triage-feedback');
      fb.className = `triage-feedback feedback ${right ? 'good' : 'bad'}`;
      fb.innerHTML = `
        <p><strong>${right ? 'Correct!' : 'Not quite.'}</strong> This one is <strong>${card.answer === 'scam' ? 'a scam' : 'legit'}</strong>. ${card.why}</p>
        <button type="button" class="btn btn-primary btn-sm triage-next">${last ? 'See my score' : 'Next message'} ${icon('arrowRight')}</button>`;
      const next = fb.querySelector('.triage-next');
      next.focus({ preventScroll: true });
      next.addEventListener('click', () => {
        if (last) return this.finish();
        this.index += 1;
        this.showCard();
      });
    }

    finish() {
      const total = this.config.cards.length;
      const great = this.correct >= total - 1;
      sound(great ? 'win' : 'click');
      this.stage.innerHTML = `
        <div class="triage-summary">
          <div class="triage-score">${this.correct}<span>/${total}</span></div>
          <p><strong>${great ? 'Sharp eyes! 🕵️' : 'Good practice! 💪'}</strong> ${great ? 'You are ready for the quiz.' : 'Re-read the red flags above, then try again or move on to the quiz.'}</p>
          <button type="button" class="btn btn-secondary btn-sm triage-again">${icon('refresh')} Play again</button>
        </div>`;
      this.stage.querySelector('.triage-again').addEventListener('click', () => { this.index = 0; this.correct = 0; this.showCard(); });
      this.complete();
    }
  }

  /* ==================================================================
   * Factory — maps the "type" in lessons.js to a class
   * ================================================================== */
  const TYPES = {
    flipCards: FlipCards,
    hotspots: HotspotHunt,
    passwordLab: PasswordLab,
    chat: ChatScenario,
    explorer: ChoiceExplorer,
    sorter: Sorter,
    triage: Triage
  };

  CQ.Activities = {
    create(container, config, onComplete) {
      const ActivityClass = TYPES[config.type];
      if (!ActivityClass) {
        container.innerHTML = '<p>Activity not available.</p>';
        return null;
      }
      const activity = new ActivityClass(container, config, onComplete);
      activity.render();
      return activity;
    },
    PasswordLab // exposed so the analyser can be reused/tested
  };
})();
