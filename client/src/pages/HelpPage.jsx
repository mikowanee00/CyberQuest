/* pages/HelpPage.jsx — How to play, scoring, shortcuts, searchable glossary, privacy */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { LEVELS, getLesson } from '../data/lessons.js';
import { ALL_TERMS } from '../data/lessonExtras.js';
import { SCORING } from '../logic/scoring.js';

/** Every term from every lesson, with a search box. */
function Glossary() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const terms = q
    ? ALL_TERMS.filter(t => t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q))
    : ALL_TERMS;

  return (
    <div className="card glossary-card">
      <label className="field-label" htmlFor="glossary-search">Search {ALL_TERMS.length} cybersecurity terms</label>
      <input id="glossary-search" className="text-input" type="search" placeholder="e.g. ransomware, 2FA, phishing…"
        value={query} onChange={e => setQuery(e.target.value)} />
      <dl className="glossary">
        {terms.map(t => (
          <div key={`${t.lessonId}-${t.term}`}>
            <dt><span aria-hidden="true">{t.emoji}</span> {t.term}</dt>
            <dd>{t.def} <Link className="glossary-lesson" to={`/lesson/${t.lessonId}`}>Lesson {t.lessonId}: {getLesson(t.lessonId)?.title}</Link></dd>
          </div>
        ))}
        {terms.length === 0 && <p className="muted">No terms match “{query}”.</p>}
      </dl>
    </div>
  );
}

export default function HelpPage() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow"><Icon name="help" /> Help</p>
          <h1>How to Play</h1>
          <p className="lead">Everything you need to know to become a Cyber Detective.</p>
        </div>
      </section>
      <div className="container page-body help-grid">
        <div>
          <h2 className="section-heading">Getting started</h2>
          <ol className="steps-list">
            <li><strong>Pick a nickname</strong> on the <Link to="/">Home</Link> page, tick the box to save your progress and press <em>Start learning</em>.</li>
            <li><strong>Write down your player code.</strong> With your nickname it lets you continue on any device.</li>
            <li><strong>Open a lesson</strong> from the <Link to="/lessons">Lessons</Link> page. Any order works, but the numbered order is recommended.</li>
            <li><strong>Learn:</strong> read the short sections and the “Remember” box.</li>
            <li><strong>Key terms:</strong> tap each card to reveal what the word means.</li>
            <li><strong>Scenarios:</strong> work through 10 “what would you do?” situations. Try again until you get each one right, and earn a ⭐ for every first-try answer.</li>
            <li><strong>Try it:</strong> finish the hands-on activity (a green “Done” label appears).</li>
            <li><strong>Quiz:</strong> press <em>Start the quiz</em>. Score 70% or more to complete the lesson and earn its badge.</li>
            <li><strong>Final challenge:</strong> unlocks after all 10 lessons. It's a timed quiz with random questions from every lesson. Score 70%+ to unlock your victory lap 🏁</li>
          </ol>

          <h2 className="section-heading">Scoring</h2>
          <div className="table-wrap card">
            <table>
              <tbody>
                <tr><th scope="row">Correct quiz answer</th><td>+{SCORING.XP_PER_CORRECT} XP</td></tr>
                <tr><th scope="row">Passing a lesson (70%+)</th><td>+{SCORING.XP_COMPLETION_BONUS} XP and a badge</td></tr>
                <tr><th scope="row">Final challenge speed bonus</th><td>up to +5 XP per question</td></tr>
                <tr><th scope="row">Stars</th><td>★ 70%+ · ★★ 80%+ · ★★★ 100%</td></tr>
                <tr><th scope="row">Scenarios</th><td>practice only: ⭐ for each first-try answer</td></tr>
                <tr><th scope="row">Replays</th><td>Only your best score counts, so feel free to retry!</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="section-heading">Ranks</h2>
          <ul className="rank-list">
            {LEVELS.map(l => <li key={l.name}><strong>{l.name}</strong><span>{l.min}+ XP</span></li>)}
          </ul>
        </div>

        <div>
          <h2 className="section-heading">Keyboard shortcuts</h2>
          <div className="card">
            <ul className="kbd-list">
              <li><kbd>Tab</kbd> move between buttons and links</li>
              <li><kbd>Enter</kbd> / <kbd>Space</kbd> press the focused button</li>
              <li><kbd>A</kbd>–<kbd>D</kbd> or <kbd>1</kbd>–<kbd>4</kbd> answer a quiz question</li>
              <li><kbd>Enter</kbd> go to the next question</li>
            </ul>
          </div>

          <h2 className="section-heading" id="glossary">Glossary</h2>
          <Glossary />

          <h2 className="section-heading">Privacy</h2>
          <div className="card">
            <p>
              CyberQuest stores only your <strong>nickname</strong> and your <strong>lesson and quiz results</strong> — no email, real name or
              password. Your player code is stored only as a secure hash. You can download or delete your data at any time
              from <Link to="/progress">My Progress</Link>. The password lab never saves or sends what you type.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
