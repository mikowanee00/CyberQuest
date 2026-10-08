/* =====================================================================
 * pages/QuizResults.jsx — Score ring, rank title, badge, certificate
 * and a review of every answer.
 * ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Stars } from '../components/common.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getLesson } from '../data/lessons.js';
import { SCORING, resultTitleFor, starsForPercent } from '../logic/scoring.js';
import { sound, confetti } from '../logic/effects.js';

const CIRCUMFERENCE = 2 * Math.PI * 52;

export default function QuizResults({ lesson, result, outcome, onRetry }) {
  const { player, stats } = usePlayer();
  const toast = useToast();
  const [ringOffset, setRingOffset] = useState(CIRCUMFERENCE);
  const titleRef = useRef(null);
  const celebrated = useRef(false);

  const title = resultTitleFor(result.percent);
  const passed = result.percent >= SCORING.PASS_PERCENT;
  const next = getLesson(lesson.id + 1);
  const saveError = outcome && outcome.error;

  useEffect(() => {
    // Animate the score ring, focus the title and celebrate (once).
    const frame = requestAnimationFrame(() => setRingOffset(CIRCUMFERENCE * (1 - result.score / result.total)));
    titleRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    if (!celebrated.current) {
      celebrated.current = true;
      if (passed) sound.play('win');
      if (outcome?.newBadge) toast(<><Icon name="award" /> Badge unlocked: <strong>{lesson.badge}</strong></>, 'badge');
      if (result.percent === 100 || outcome?.newBadge) confetti.burst();
    }
    return () => cancelAnimationFrame(frame);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <section className="results card" aria-labelledby="results-title">
        {saveError && <p className="banner banner-warn"><Icon name="alert" /> Your score could not be saved: {saveError}</p>}

        <div className="score-ring" role="img" aria-label={`Score ${result.score} out of ${result.total}`}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" className="ring-bg" />
            <circle cx="60" cy="60" r="52" className={`ring-fg ${passed ? 'pass' : 'fail'}`}
              style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: ringOffset }} />
          </svg>
          <div className="score-ring-text"><strong>{result.score}/{result.total}</strong><span>{result.percent}%</span></div>
        </div>
        <p className="result-emoji" aria-hidden="true">{title.emoji}</p>
        <h2 id="results-title" className="result-title" tabIndex={-1} ref={titleRef}>{title.title}</h2>
        <p className="result-msg">{title.message}</p>
        <Stars count={starsForPercent(result.percent)} />

        {outcome && !saveError && (
          <ul className="result-stats">
            <li><strong>+{outcome.xpGained}</strong><span>new XP{outcome.xpGained === 0 ? ' (only your best score counts)' : ''}</span></li>
            {lesson.final && <li><strong>{result.bonus}</strong><span>speed bonus</span></li>}
            <li><strong>{stats.totalXP}</strong><span>total XP</span></li>
            <li><strong>{stats.level?.current.name}</strong><span>your rank</span></li>
          </ul>
        )}

        {outcome?.newBadge && (
          <div className="badge-earned" style={{ '--c': lesson.color }}>
            <span className="badge-medal"><Icon name={lesson.icon} /></span>
            <div><small>New badge unlocked!</small><strong>{lesson.badge}</strong></div>
          </div>
        )}

        {!passed && (
          <p className="muted">Score {SCORING.PASS_PERCENT}% or more to complete this lesson{lesson.final ? ' and unlock your certificate' : ' and earn the badge'}.</p>
        )}

        <div className="btn-row center">
          <button type="button" className="btn btn-secondary" onClick={onRetry}><Icon name="refresh" /> {lesson.final ? 'New challenge' : 'Try again'}</button>
          {!lesson.final && next && <Link className="btn btn-primary" to={`/lesson/${next.id}`}>Next: {next.title} <Icon name="arrowRight" /></Link>}
          {lesson.final
            ? <Link className="btn btn-primary" to="/progress"><Icon name="chart" /> See my progress</Link>
            : <Link className="btn btn-ghost" to="/lessons"><Icon name="grid" /> All lessons</Link>}
        </div>
      </section>

      {lesson.final && passed && (
        <section className="certificate" aria-label="Certificate">
          <div className="cert-inner">
            <span className="cert-seal"><Icon name="logo" /></span>
            <p className="cert-kicker">Certificate of Completion</p>
            <p className="cert-small">This certifies that</p>
            <h2 className="cert-name">{player?.nickname || 'Cyber Agent'}</h2>
            <p className="cert-small">has completed the <strong>CyberQuest Cybersecurity Awareness Game</strong> and earned the rank of</p>
            <p className="cert-rank">{title.title.replace('!', '')}</p>
            <p className="cert-meta">
              Final challenge score: {result.score}/{result.total} ({result.percent}%) ·{' '}
              {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="btn-row center no-print">
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}><Icon name="printer" /> Print certificate</button>
          </div>
        </section>
      )}

      <details className="review card">
        <summary><Icon name="eye" /> Review your answers</summary>
        <ol className="review-list">
          {result.answers.map((a, i) => (
            <li key={i} className={a.correct ? 'ok' : 'bad'}>
              <p className="rv-q">{a.correct ? '✅' : '❌'} {a.question.prompt}</p>
              <p>Your answer: <strong>{a.choice >= 0 ? a.question.options[a.choice] : 'No answer (time ran out)'}</strong></p>
              {!a.correct && <p>Correct answer: <strong>{a.question.options[a.question.answer]}</strong></p>}
              <p className="rv-explain">{a.question.explain}</p>
            </li>
          ))}
        </ol>
      </details>
    </>
  );
}
