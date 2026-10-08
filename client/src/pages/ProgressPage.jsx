/* =====================================================================
 * pages/ProgressPage.jsx — XP, rank, badges, scores, history and
 * the player's own data controls (download, reset, delete, log out).
 * ===================================================================== */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Stars, StatusChip, ProgressBar } from '../components/common.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api, loadSession, downloadBlob } from '../api/client.js';
import { LESSONS, getLesson } from '../data/lessons.js';
import { formatDate } from '../logic/effects.js';

export default function ProgressPage() {
  const { player, lessons, history, stats, status, stars, rename, resetProgress, deleteAccount, logout } = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(player.nickname);
  const [showCode, setShowCode] = useState(false);
  const code = loadSession()?.playerCode || '';
  const lvl = stats.level;

  async function onRename(e) {
    e.preventDefault();
    try {
      await rename(nickname.trim());
      toast(<>Nickname saved: <strong>{nickname.trim()}</strong></>, 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function onDownload() {
    try {
      const data = await api.exportMyData();
      downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), 'cyberquest-my-data.json');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function onReset() {
    if (!window.confirm('Erase all your CyberQuest progress, XP and badges? This cannot be undone.')) return;
    try {
      await resetProgress();
      toast('Progress reset. Fresh start!', 'info');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function onDelete() {
    if (!window.confirm('Permanently delete your player profile and ALL your data from the database?')) return;
    try {
      await deleteAccount();
      toast('Your account and data were deleted.', 'info');
      navigate('/');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  function onLogout() {
    if (!window.confirm('Log out on this device? You will need your nickname and player code to log back in.')) return;
    logout();
    navigate('/');
  }

  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow"><Icon name="chart" /> Dashboard</p>
          <h1>My Progress</h1>
          <p className="lead">Track your XP, rank, badges and quiz history.</p>
        </div>
      </section>

      <div className="container page-body">
        <div className="progress-top">
          <div className="card player-card">
            <span className="avatar avatar-lg" aria-hidden="true">{player.nickname.charAt(0).toUpperCase()}</span>
            <div className="player-info">
              <form className="rename-form" onSubmit={onRename} autoComplete="off">
                <label className="field-label" htmlFor="rename-input">Nickname</label>
                <div className="name-row">
                  <input id="rename-input" type="text" maxLength={24} value={nickname} onChange={e => setNickname(e.target.value)} />
                  <button className="btn btn-secondary btn-sm" type="submit">Save</button>
                </div>
              </form>
              <p className="code-line">
                Player code: <code className="mono">{showCode ? code : '••••-••••'}</code>{' '}
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowCode(s => !s)}><Icon name="eye" /> {showCode ? 'Hide' : 'Show'}</button>
              </p>
              <p className="rank-line">Rank: <strong>{lvl.current.name}</strong> · {stats.totalXP} XP</p>
              <ProgressBar percent={lvl.progress} large />
              <p className="muted small">
                {lvl.next ? <>{lvl.next.min - stats.totalXP} XP to reach <strong>{lvl.next.name}</strong></> : 'Maximum rank reached — legendary! 🏆'}
              </p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat"><span className="stat-icon"><Icon name="zap" /></span><strong>{stats.totalXP}</strong><span>Total XP</span></div>
            <div className="stat"><span className="stat-icon"><Icon name="book" /></span><strong>{stats.completedCount}/10</strong><span>Lessons completed</span></div>
            <div className="stat"><span className="stat-icon"><Icon name="award" /></span><strong>{stats.badges}</strong><span>Badges earned</span></div>
            <div className="stat"><span className="stat-icon"><Icon name="target" /></span><strong>{stats.quizzesTaken}</strong><span>Quizzes taken</span></div>
          </div>
        </div>

        <h2 className="section-heading">Badges</h2>
        <div className="badge-grid">
          {LESSONS.map(l => {
            const earned = status(l.id) === 'completed';
            return (
              <Link key={l.id} className={`badge ${earned ? 'earned' : 'locked'}`} to={`/lesson/${l.id}`} style={{ '--c': l.color }}
                aria-label={`${l.badge} badge, ${earned ? 'earned' : 'locked'}`}>
                <span className="badge-medal"><Icon name={earned ? l.icon : 'lock'} /></span>
                <strong>{l.badge}</strong>
                <small>{earned ? 'Earned' : `Pass Lesson ${l.id}`}</small>
              </Link>
            );
          })}
        </div>

        <h2 className="section-heading">Lesson scores</h2>
        <div className="table-wrap card">
          <table>
            <thead><tr><th scope="col">Lesson</th><th scope="col">Status</th><th scope="col">Best score</th><th scope="col">Stars</th><th scope="col">Attempts</th><th scope="col">XP</th></tr></thead>
            <tbody>
              {LESSONS.map(l => {
                const rec = lessons[l.id];
                return (
                  <tr key={l.id}>
                    <td><Link to={`/lesson/${l.id}`}>{l.id}. {l.title}</Link></td>
                    <td><StatusChip status={status(l.id)} /></td>
                    <td>{rec && rec.attempts ? `${rec.bestScore}/${rec.total} (${rec.bestPercent}%)` : '—'}</td>
                    <td><Stars count={stars(l.id)} /></td>
                    <td>{rec ? rec.attempts : 0}</td>
                    <td>{rec ? rec.xp : 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2 className="section-heading">Recent quiz attempts</h2>
        {history.length ? (
          <div className="table-wrap card">
            <table>
              <thead><tr><th scope="col">Date</th><th scope="col">Lesson</th><th scope="col">Score</th><th scope="col">Result</th></tr></thead>
              <tbody>
                {history.slice(0, 10).map(h => (
                  <tr key={h.id}>
                    <td>{formatDate(h.date)}</td>
                    <td>{getLesson(h.lessonId)?.title}</td>
                    <td>{h.score}/{h.total} ({h.percent}%){h.bonus ? ` +${h.bonus} bonus` : ''}</td>
                    <td>{h.passed ? <span className="chip chip-success">Passed</span> : <span className="chip chip-warn">Not yet</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty card"><p>No quizzes taken yet. <Link to="/lesson/1">Start with Lesson 1</Link> — it only takes a few minutes!</p></div>
        )}

        <h2 className="section-heading">Your data</h2>
        <div className="card data-card">
          <p>
            Your nickname and results are stored in the CyberQuest <strong>database</strong> so your progress follows you to any device
            (log in with your nickname + player code). You can download a copy, start over, or delete everything at any time.
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={onDownload}><Icon name="download" /> Download my data (JSON)</button>
            <button type="button" className="btn btn-ghost" onClick={onLogout}><Icon name="logout" /> Log out on this device</button>
            <button type="button" className="btn btn-danger-ghost" onClick={onReset}><Icon name="refresh" /> Reset my progress</button>
            <button type="button" className="btn btn-danger-ghost" onClick={onDelete}><Icon name="trash" /> Delete my account</button>
          </div>
        </div>
      </div>
    </>
  );
}
