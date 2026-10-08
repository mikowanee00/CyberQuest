/* =====================================================================
 * components/Header.jsx — Logo, main menu, XP pill, sound & theme toggles
 * ===================================================================== */
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { sound } from '../logic/effects.js';

const THEME_KEY = 'cyberquest.theme';

/** Light/dark theme: saved choice, otherwise the operating-system setting. */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
    } catch { /* ignore */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);
  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))];
}

const navClass = ({ isActive }) => (isActive ? 'is-active' : '');

export default function Header() {
  const { player, stats } = usePlayer();
  const toast = useToast();
  const location = useLocation();
  const [theme, toggleTheme] = useTheme();
  const [soundOn, setSoundOn] = useState(sound.enabled);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu after navigating or pressing Escape.
  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function toggleSound() {
    const on = sound.toggle();
    setSoundOn(on);
    toast(<><Icon name={on ? 'volume' : 'volumeOff'} /> Sound effects {on ? 'on' : 'off'}</>);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="CyberQuest home">
          <span className="brand-mark"><Icon name="logo" /></span>
          <span className="brand-name">Cyber<span>Quest</span></span>
        </Link>

        <nav id="site-nav" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/lessons" className={({ isActive }) => (isActive || /^\/(lesson|quiz)\//.test(location.pathname) ? 'is-active' : '')}>Lessons</NavLink>
          <NavLink to="/progress" className={navClass}>My Progress</NavLink>
          <NavLink to="/help" className={navClass}>How to Play</NavLink>
        </nav>

        <div className="header-tools">
          {player ? (
            <Link to="/progress" className="xp-pill" title="Your experience points">
              <Icon name="zap" /> <strong>{stats.totalXP}</strong>
              <span className="xp-word">&nbsp;XP</span>
              <span className="xp-rank">· {stats.level?.current.name}</span>
            </Link>
          ) : (
            <Link to="/" className="xp-pill" title="Create a player profile">
              <Icon name="user" /> <span>Guest</span>
            </Link>
          )}
          <button type="button" className="icon-btn" onClick={toggleSound} aria-pressed={soundOn}
            aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'} title={soundOn ? 'Turn sound off' : 'Turn sound on'}>
            <Icon name={soundOn ? 'volume' : 'volumeOff'} />
          </button>
          <button type="button" className="icon-btn" onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <button type="button" className="icon-btn nav-toggle" onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen} aria-controls="site-nav" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <Icon name={menuOpen ? 'x' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
