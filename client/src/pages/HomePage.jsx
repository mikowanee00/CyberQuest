/* =====================================================================
 * pages/HomePage.jsx — Welcome screen, sign-up and log-in
 * ===================================================================== */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { LESSONS } from '../data/lessons.js';
import { nextLesson } from '../logic/scoring.js';
import { sound } from '../logic/effects.js';

/* Hero illustration: a phishing hook over an email, guarded by a shield. */
const HERO_ART = `
  <svg class="hero-svg" viewBox="0 0 420 340" role="img" aria-label="A fishing hook dangling over an email on a laptop, protected by a security shield">
    <circle cx="215" cy="185" r="140" class="h-blob"/>
    <g class="h-float h-float-1"><rect x="14" y="96" width="112" height="36" rx="18" class="h-card"/><text x="34" y="120" class="h-mono">• • • • • •</text></g>
    <g class="h-float h-float-2"><rect x="300" y="62" width="104" height="36" rx="18" class="h-card"/><circle cx="322" cy="80" r="8" class="h-ok"/><path d="m318 80 3 3 5-6" class="h-ok-check"/><text x="338" y="85" class="h-label">2FA on</text></g>
    <rect x="85" y="118" width="250" height="160" rx="14" class="h-laptop"/>
    <rect x="98" y="131" width="224" height="134" rx="6" class="h-screen"/>
    <path d="M58 278h304l-20 24H78z" class="h-base"/>
    <g class="h-envelope"><rect x="160" y="170" width="100" height="66" rx="7" class="h-env"/><path d="m162 176 48 34 48-34" class="h-env-line"/><circle cx="258" cy="172" r="13" class="h-alert"/><text x="258" y="178" text-anchor="middle" class="h-alert-text">!</text></g>
    <g class="h-hook"><path d="M210 0v140" class="h-line"/><path d="M210 140v14a9 9 0 0 1-18 0v-5" class="h-hookpath"/><path d="m192 149 5 5" class="h-hookpath"/></g>
    <g class="h-shield"><path d="M348 196l-38 13v26c0 24 16 41 38 48 22-7 38-24 38-48v-26z" class="h-shield-body"/><path d="m332 238 11 11 20-22" class="h-shield-check"/></g>
  </svg>`;

/** Sign-up and log-in forms (shown to visitors without a profile). */
function StartForms({ onRegistered }) {
  const { register, login } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [mode, setMode] = useState('register');
  const [nickname, setNickname] = useState('');
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onRegister(e) {
    e.preventDefault();
    const name = nickname.trim();
    if (name.length < 2) return setError('Please choose a nickname with at least 2 characters.');
    if (!consent) return setError('Please tick the box to agree before you start.');
    setBusy(true);
    setError('');
    try {
      const data = await register(name, true);
      sound.play('win');
      onRegistered(data.playerCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    if (!nickname.trim() || !code.trim()) return setError('Please enter your nickname and player code.');
    setBusy(true);
    setError('');
    try {
      const data = await login(nickname.trim(), code.trim());
      toast(<>Welcome back, <strong>{data.summary.user.nickname}</strong>!</>, 'success');
      navigate(location.state?.from || '/lessons');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const switchTo = m => { setMode(m); setError(''); };

  return (
    <div className="start-card">
      <div className="auth-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'register'} className={`auth-tab ${mode === 'register' ? 'is-active' : ''}`} onClick={() => switchTo('register')}>New player</button>
        <button type="button" role="tab" aria-selected={mode === 'login'} className={`auth-tab ${mode === 'login' ? 'is-active' : ''}`} onClick={() => switchTo('login')}>I already have a code</button>
      </div>

      {mode === 'register' ? (
        <form className="name-form" onSubmit={onRegister} noValidate>
          <label htmlFor="player-name">What should we call you, agent?</label>
          <div className="name-row">
            <input id="player-name" type="text" maxLength={24} placeholder="A nickname works best" autoComplete="off"
              value={nickname} onChange={e => setNickname(e.target.value)} aria-invalid={!!error} />
            <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
              {busy ? 'Creating…' : <>Start the mission <Icon name="arrowRight" /></>}
            </button>
          </div>
          <label className="checkbox-row">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
            <span>I agree that my <strong>nickname and quiz results</strong> are saved for a class research project. I can delete them at any time.</span>
          </label>
          <p className="form-note"><Icon name="lock" /> Tip from Lesson 9: don't use your real name — a nickname is safer.</p>
        </form>
      ) : (
        <form className="name-form" onSubmit={onLogin} noValidate>
          <label htmlFor="login-name">Nickname</label>
          <input id="login-name" className="text-input" type="text" maxLength={24} autoComplete="off"
            value={nickname} onChange={e => setNickname(e.target.value)} />
          <label htmlFor="login-code">Player code</label>
          <div className="name-row">
            <input id="login-code" type="text" maxLength={12} placeholder="ABCD-1234" autoComplete="off" className="mono"
              value={code} onChange={e => setCode(e.target.value)} />
            <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Continue'}</button>
          </div>
        </form>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}

/** Shown once, right after signing up. */
function PlayerCodeCard({ code, onContinue }) {
  const toast = useToast();
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      toast('Player code copied!', 'success');
    } catch {
      toast('Could not copy — please write the code down.', 'error');
    }
  }
  return (
    <div className="code-card">
      <p><strong>Welcome aboard! 🎉</strong> This is your secret <strong>player code</strong>:</p>
      <div className="player-code">{code}</div>
      <p className="muted small">Write it down. You need your nickname + this code to continue on another device or browser. Never share it — just like a password.</p>
      <div className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={copy}><Icon name="copy" /> Copy code</button>
        <button type="button" className="btn btn-primary" onClick={onContinue}>Go to the lessons <Icon name="arrowRight" /></button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { player, stats, status } = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();
  const [newCode, setNewCode] = useState(null);
  const next = nextLesson(status);

  let start;
  if (newCode) {
    start = <PlayerCodeCard code={newCode} onContinue={() => navigate(location.state?.from || '/lessons')} />;
  } else if (player) {
    start = (
      <div className="welcome-back">
        <p>Welcome back, <strong>{player.nickname}</strong>! You have completed <strong>{stats.completedCount}</strong> of 10 lessons.</p>
        <div className="btn-row">
          <Link className="btn btn-primary btn-lg" to={`/lesson/${next.id}`}><Icon name="play" /> {stats.completedCount ? 'Continue' : 'Start'}: Lesson {next.id}</Link>
          <Link className="btn btn-secondary btn-lg" to="/lessons"><Icon name="grid" /> All lessons</Link>
        </div>
      </div>
    );
  } else {
    start = (
      <>
        {location.state?.needPlayer && (
          <p className="banner banner-info"><Icon name="user" /> Create a player profile (or log in) first, so your progress can be saved.</p>
        )}
        <StartForms onRegistered={setNewCode} />
      </>
    );
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><Icon name="shield" /> Cybersecurity Awareness Game</p>
            <h1>Think before<br />you <span className="hl">click.</span></h1>
            <p className="lead">
              Learn to spot phishing emails, scams and online tricks through 10 bite-sized lessons, hands-on simulations
              and fun quizzes. Earn XP, collect badges and become a <strong>Cyber Detective</strong>.
            </p>
            {start}
            <ul className="hero-facts">
              <li><strong>10</strong> lessons</li>
              <li><strong>50</strong> quiz questions</li>
              <li><strong>10</strong> badges</li>
            </ul>
          </div>
          <div className="hero-art" dangerouslySetInnerHTML={{ __html: HERO_ART }} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-heading">How it works</h2>
          <div className="feature-grid">
            <article className="feature">
              <span className="feature-icon" style={{ '--c': '#6366f1' }}><Icon name="book" /></span>
              <h3>1. Learn</h3>
              <p>Short, clear lessons explain each threat with real-world examples.</p>
            </article>
            <article className="feature">
              <span className="feature-icon" style={{ '--c': '#14b8a6' }}><Icon name="target" /></span>
              <h3>2. Practice</h3>
              <p>Hunt for red flags in fake emails, chat with a scammer, test passwords and more.</p>
            </article>
            <article className="feature">
              <span className="feature-icon" style={{ '--c': '#f59e0b' }}><Icon name="award" /></span>
              <h3>3. Quiz &amp; earn</h3>
              <p>Answer fun quizzes with instant feedback, earn XP and stars, and unlock badges.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-heading">Why it matters</h2>
          <div className="feature-grid">
            <article className="feature feature-plain"><h3>🎣 Attackers target people</h3><p>Most attacks don't break software — they trick a person into clicking, sharing or paying.</p></article>
            <article className="feature feature-plain"><h3>🖱️ One click can be enough</h3><p>A single fake login page or infected attachment can expose your email, money and identity.</p></article>
            <article className="feature feature-plain"><h3>🛡️ Good habits are easy</h3><p>A few simple habits — pause, check, verify — stop the vast majority of scams.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <h2 className="section-heading">Your mission: 10 lessons</h2>
            <Link to="/lessons" className="text-link">View all <Icon name="arrowRight" /></Link>
          </div>
          <ol className="mini-lessons">
            {LESSONS.map(l => (
              <li key={l.id}>
                <Link to={`/lesson/${l.id}`} style={{ '--c': l.color }}>
                  <span className="mini-icon"><Icon name={l.icon} /></span>
                  <span><small>Lesson {l.id}</small>{l.title}</span>
                  {status(l.id) === 'completed' && <span className="mini-done" aria-label="completed"><Icon name="check" /></span>}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}