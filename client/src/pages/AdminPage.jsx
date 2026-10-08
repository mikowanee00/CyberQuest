/* =====================================================================
 * pages/AdminPage.jsx — Researcher / teacher dashboard  (/admin)
 * ---------------------------------------------------------------------
 * Enter the ADMIN_KEY from server/.env to see every player, how far
 * they got, quiz scores, the hardest questions, and to download CSV
 * files for Excel charts. The key is kept only for this browser tab
 * (sessionStorage) and sent in the x-admin-key header.
 * ===================================================================== */
import { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Loading } from '../components/common.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../api/client.js';
import { LESSONS, getLesson } from '../data/lessons.js';
import { formatDate } from '../logic/effects.js';

const KEY_STORAGE = 'cyberquest.adminKey';
const TABS = [
  { id: 'overview', label: 'Overview', icon: 'chart' },
  { id: 'players', label: 'Players', icon: 'users' },
  { id: 'questions', label: 'Questions', icon: 'help' },
  { id: 'export', label: 'Export CSV', icon: 'download' }
];
const EXPORTS = [
  { id: 'users', title: 'Players', text: 'One row per player: lessons completed, quizzes taken, XP, rank and best % for each lesson (L1–L10).' },
  { id: 'attempts', title: 'Quiz attempts', text: 'One row per finished quiz: date, player, lesson, score, percent, passed, time taken.' },
  { id: 'lessons', title: 'Lesson statistics', text: 'One row per lesson: visits, activities completed, attempts, average score and pass rate.' },
  { id: 'questions', title: 'Question statistics', text: 'One row per question: times answered and % correct — shows which topics were hardest.' }
];

const pct = v => (v === null || v === undefined ? '—' : `${v}%`);

/** Horizontal bar for a percentage value. */
function Bar({ value }) {
  if (value === null || value === undefined) return <span className="muted">—</span>;
  const tone = value >= 70 ? 'good' : value >= 50 ? 'mid' : 'low';
  return (
    <span className="bar-cell">
      <span className="bar"><span className={`bar-fill ${tone}`} style={{ width: `${value}%` }} /></span>
      <span className="bar-value">{value}%</span>
    </span>
  );
}

function KeyForm({ onSubmit, error }) {
  const [key, setKey] = useState('');
  return (
    <div className="card admin-login">
      <span className="feature-icon" style={{ '--c': '#4f46e5' }}><Icon name="lock" /></span>
      <h2>Admin sign-in</h2>
      <p className="muted">Enter the <code>ADMIN_KEY</code> value from <code>server/.env</code>.</p>
      <form onSubmit={e => { e.preventDefault(); if (key.trim()) onSubmit(key.trim()); }}>
        <div className="name-row">
          <input type="password" placeholder="Admin key" value={key} onChange={e => setKey(e.target.value)} aria-label="Admin key" autoComplete="off" />
          <button className="btn btn-primary" type="submit">Open dashboard</button>
        </div>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}

/** Detail panel for one player (opened from the Players tab). */
function PlayerDetail({ adminKey, userId, onClose, onDeleted }) {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null);
    api.admin.user(adminKey, userId).then(setData).catch(err => setError(err.message));
  }, [adminKey, userId]);

  async function remove() {
    if (!window.confirm(`Delete ${data.user.nickname} and all of their data? This cannot be undone.`)) return;
    try {
      await api.admin.deleteUser(adminKey, userId);
      toast('Player deleted.', 'info');
      onDeleted();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  if (error) return <div className="card"><p className="form-error">{error}</p></div>;
  if (!data) return <Loading />;

  return (
    <div className="card player-detail">
      <div className="detail-head">
        <div>
          <h3>{data.user.nickname}</h3>
          <p className="muted small">Joined {formatDate(data.user.createdAt)} · last active {formatDate(data.user.lastActiveAt)} · {data.stats.totalXP} XP · {data.stats.level.current.name}</p>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-danger-ghost btn-sm" onClick={remove}><Icon name="trash" /> Delete player</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" /> Close</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Lesson</th><th>Visited</th><th>Activity</th><th>Attempts</th><th>Best</th><th>Passed</th></tr></thead>
          <tbody>
            {LESSONS.map(l => {
              const r = data.lessons[l.id];
              return (
                <tr key={l.id}>
                  <td>{l.id}. {l.title}</td>
                  <td>{r?.visited ? '✔' : '—'}</td>
                  <td>{r?.activityDone ? '✔' : '—'}</td>
                  <td>{r?.attempts || 0}</td>
                  <td>{r?.attempts ? `${r.bestScore}/${r.total} (${r.bestPercent}%)` : '—'}</td>
                  <td>{r?.passed ? <span className="chip chip-success">Yes</span> : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h4>All quiz attempts ({data.attempts.length})</h4>
      {data.attempts.length === 0 && <p className="muted">No quizzes yet.</p>}
      <div className="attempt-list">
        {data.attempts.map(a => (
          <details key={a._id} className="attempt">
            <summary>
              <span>{formatDate(a.createdAt)}</span>
              <span>Lesson {a.lessonId}: {getLesson(a.lessonId)?.title}</span>
              <span><strong>{a.score}/{a.total}</strong> ({a.percent}%)</span>
              {a.passed ? <span className="chip chip-success">Passed</span> : <span className="chip chip-warn">Not passed</span>}
            </summary>
            <ol>
              {a.answers.map((ans, i) => (
                <li key={i} className={ans.correct ? 'ok' : 'bad'}>
                  {ans.correct ? '✅' : '❌'} {ans.question}
                  <div className="muted small">Answered: {ans.chosen}{ans.correct ? '' : ` · Correct: ${ans.correctAnswer}`}</div>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const toast = useToast();
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '');
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(null);       // { summary, users, questions }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  /** Loads all dashboard data in parallel. */
  const load = useCallback(async key => {
    setLoading(true);
    setError('');
    try {
      const [summary, users, questions] = await Promise.all([
        api.admin.summary(key), api.admin.users(key), api.admin.questions(key)
      ]);
      setData({ summary, users: users.users, questions: questions.questions });
      sessionStorage.setItem(KEY_STORAGE, key);
      setAdminKey(key);
    } catch (err) {
      if (err.status === 401) {
        sessionStorage.removeItem(KEY_STORAGE);
        setAdminKey('');
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (adminKey) load(adminKey); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function signOut() {
    sessionStorage.removeItem(KEY_STORAGE);
    setAdminKey('');
    setData(null);
  }

  async function download(dataset) {
    try {
      await api.admin.downloadCSV(adminKey, dataset);
      toast(`Downloaded ${dataset}.csv`, 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  const head = (
    <section className="page-head">
      <div className="container">
        <p className="eyebrow"><Icon name="database" /> Research data</p>
        <h1>Admin Dashboard</h1>
        <p className="lead">See every player who used CyberQuest, how far they got and how they scored. Download the data as CSV to make charts in Excel.</p>
      </div>
    </section>
  );

  if (!adminKey || !data) {
    return (
      <>
        {head}
        <div className="container page-body">
          {loading ? <Loading text="Loading dashboard…" /> : <KeyForm onSubmit={load} error={error} />}
        </div>
      </>
    );
  }

  const { summary, users, questions } = data;
  const t = summary.totals;
  const filtered = users.filter(u => u.nickname.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {head}
      <div className="container page-body">
        <div className="admin-toolbar">
          <div className="admin-tabs" role="tablist">
            {TABS.map(tb => (
              <button key={tb.id} type="button" role="tab" aria-selected={tab === tb.id}
                className={`admin-tab ${tab === tb.id ? 'is-active' : ''}`} onClick={() => setTab(tb.id)}>
                <Icon name={tb.icon} /> {tb.label}
              </button>
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => load(adminKey)} disabled={loading}><Icon name="refresh" /> {loading ? 'Refreshing…' : 'Refresh'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}><Icon name="logout" /> Sign out</button>
          </div>
        </div>
        {error && <p className="banner banner-warn"><Icon name="alert" /> {error}</p>}

        {tab === 'overview' && (
          <>
            <div className="stats-grid stats-6">
              <div className="stat"><span className="stat-icon"><Icon name="users" /></span><strong>{t.players}</strong><span>Players</span></div>
              <div className="stat"><span className="stat-icon"><Icon name="target" /></span><strong>{t.quizAttempts}</strong><span>Quiz attempts</span></div>
              <div className="stat"><span className="stat-icon"><Icon name="chart" /></span><strong>{pct(t.averageScorePercent)}</strong><span>Average quiz score</span></div>
              <div className="stat"><span className="stat-icon"><Icon name="award" /></span><strong>{t.lessonCompletions}</strong><span>Lessons completed (total)</span></div>
              <div className="stat"><span className="stat-icon"><Icon name="book" /></span><strong>{t.playersFinishedAllLessons}</strong><span>Finished all 10 lessons</span></div>
              <div className="stat"><span className="stat-icon"><Icon name="trophy" /></span><strong>{t.playersPassedFinal}</strong><span>Passed final challenge</span></div>
            </div>

            <h2 className="section-heading">Lessons</h2>
            <div className="table-wrap card">
              <table>
                <thead><tr><th>Lesson</th><th>Visited</th><th>Activity done</th><th>Attempts</th><th>Average score</th><th>Pass rate</th><th>Completed</th></tr></thead>
                <tbody>
                  {summary.lessons.map(l => (
                    <tr key={l.lessonId}>
                      <td>{l.lessonId}. {l.title}</td>
                      <td>{l.playersVisited}</td>
                      <td>{l.activitiesCompleted}</td>
                      <td>{l.quizAttempts}</td>
                      <td><Bar value={l.averageScorePercent} /></td>
                      <td><Bar value={l.passRatePercent} /></td>
                      <td>{l.playersCompleted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'players' && (
          <>
            <div className="admin-search">
              <input type="search" placeholder="Search nickname…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search players" />
              <span className="muted small">{filtered.length} of {users.length} players · click a row for details</span>
            </div>
            {selected && (
              <PlayerDetail adminKey={adminKey} userId={selected} onClose={() => setSelected(null)}
                onDeleted={() => { setSelected(null); load(adminKey); }} />
            )}
            <div className="table-wrap card">
              <table className="clickable">
                <thead><tr><th>Nickname</th><th>Joined</th><th>Last active</th><th>Lessons done</th><th>Quizzes</th><th>Avg best</th><th>XP</th><th>Rank</th></tr></thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} onClick={() => setSelected(u.id)} className={selected === u.id ? 'is-selected' : ''}
                      tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') setSelected(u.id); }}>
                      <td><strong>{u.nickname}</strong></td>
                      <td>{formatDate(u.joinedAt)}</td>
                      <td>{formatDate(u.lastActiveAt)}</td>
                      <td>{u.lessonsCompleted}/10</td>
                      <td>{u.quizzesTaken}</td>
                      <td>{pct(u.avgBestPercent)}</td>
                      <td>{u.totalXP}</td>
                      <td>{u.rank}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={8} className="muted">No players yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'questions' && (
          <>
            <p className="muted">Questions sorted from hardest (lowest % correct) to easiest.</p>
            <div className="table-wrap card">
              <table>
                <thead><tr><th>Lesson</th><th>Question</th><th>Answered</th><th>% correct</th></tr></thead>
                <tbody>
                  {questions.map(q => (
                    <tr key={`${q.lessonId}-${q.question}`}>
                      <td>{q.lessonId}</td>
                      <td className="wrap">{q.question}</td>
                      <td>{q.timesAnswered}</td>
                      <td><Bar value={q.percentCorrect} /></td>
                    </tr>
                  ))}
                  {questions.length === 0 && <tr><td colSpan={4} className="muted">No answers yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'export' && (
          <>
            <div className="export-grid">
              {EXPORTS.map(x => (
                <div key={x.id} className="card export-card">
                  <h3><Icon name="download" /> {x.title}</h3>
                  <p className="muted">{x.text}</p>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => download(x.id)}>Download {x.id}.csv</button>
                </div>
              ))}
            </div>
            <div className="card how-to-chart">
              <h3><Icon name="chart" /> Making a chart in Excel</h3>
              <ol>
                <li>Download a CSV file above and open it in Excel.</li>
                <li>Select the columns you want to compare (e.g. <em>Title</em> and <em>Average score %</em> from lessons.csv).</li>
                <li>Go to <strong>Insert → Charts → Clustered Column</strong> (or Bar / Pie).</li>
                <li>Add a chart title and axis titles with the <strong>+</strong> button next to the chart.</li>
                <li>Save the file as <strong>.xlsx</strong> so your chart is kept.</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </>
  );
}
