/* =====================================================================
 * pages/FinalChallengePage.jsx — The boss level  (/challenge)
 * ---------------------------------------------------------------------
 * Locked until all 10 lessons are completed (quiz passed). Shows a
 * checklist of the lessons, the rules, and the Start button.
 * ===================================================================== */
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Stars, ProgressBar } from '../components/common.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { FINAL, REGULAR_LESSONS } from '../data/lessons.js';
import { isFinalUnlocked, lessonsLeft } from '../logic/scoring.js';

export default function FinalChallengePage() {
  const { lessons, status, stars } = usePlayer();
  const unlocked = isFinalUnlocked(status);
  const left = lessonsLeft(status);
  const done = REGULAR_LESSONS.length - left.length;
  const rec = lessons[FINAL.id];

  return (
    <>
      <section className="lesson-hero final-hero" style={{ '--c': FINAL.color }}>
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span>
            <Link to="/lessons">Lessons</Link><span aria-hidden="true">/</span>
            <span aria-current="page">Final challenge</span>
          </nav>
          <div className="lesson-hero-inner">
            <div className="lesson-hero-icon"><Icon name={unlocked ? 'trophy' : 'lock'} /></div>
            <div>
              <p className="eyebrow">Boss level · {unlocked ? 'Unlocked!' : `${done} of ${REGULAR_LESSONS.length} lessons done`}</p>
              <h1>{FINAL.title}</h1>
              <p className="lead">{FINAL.summary}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container lesson-body">
        {!unlocked && (
          <section className="lock-panel card" aria-labelledby="lock-title">
            <h2 id="lock-title" className="step-title"><Icon name="lock" /> Locked: finish all 10 lessons first</h2>
            <p>Pass each lesson's quiz (70% or more) to unlock the final challenge. {left.length === 1 ? 'Just 1 lesson to go!' : `${left.length} lessons to go.`}</p>
            <ProgressBar percent={(done / REGULAR_LESSONS.length) * 100} large />
            <ul className="lock-list">
              {REGULAR_LESSONS.map(l => {
                const isDone = status(l.id) === 'completed';
                return (
                  <li key={l.id} className={isDone ? 'is-done' : ''}>
                    <Link to={`/lesson/${l.id}`} style={{ '--c': l.color }}>
                      <span className="lock-check" aria-hidden="true">{isDone ? <Icon name="check" /> : l.id}</span>
                      <span>{l.title}</span>
                      <span className="sr-only">{isDone ? '(completed)' : '(not completed yet)'}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link className="btn btn-primary" to={`/lesson/${left[0].id}`}><Icon name="play" /> Continue: Lesson {left[0].id}</Link>
          </section>
        )}

        <section className="lesson-step" aria-labelledby="rules-title">
          <h2 id="rules-title" className="step-title"><Icon name="trophy" /> How it works</h2>
          <div className="lesson-sections">
            {FINAL.sections.map(s => (
              <article key={s.heading} className="card lesson-section">
                <h3>{s.heading}</h3>
                <div dangerouslySetInnerHTML={{ __html: s.body }} />
              </article>
            ))}
          </div>
        </section>

        <section className="lesson-step">
          <div className="quiz-cta is-final" style={{ '--c': FINAL.color }}>
            <div>
              <h2 className="step-title">{unlocked ? 'Ready, boss? 👾' : 'Almost there…'}</h2>
              <p>
                {FINAL.finalSettings.count} random questions · {FINAL.finalSettings.seconds} seconds each · bonus points for speed ·
                earns the <strong>{FINAL.badge}</strong> badge
              </p>
              {rec && rec.attempts > 0 && (
                <p className="best-line">Your best: <strong>{rec.bestScore}/{rec.total}</strong> <Stars count={stars(FINAL.id)} /></p>
              )}
            </div>
            {unlocked ? (
              <Link className="btn btn-primary btn-lg" to={`/quiz/${FINAL.id}`}><Icon name="trophy" /> Start the challenge</Link>
            ) : (
              <span className="btn btn-lg btn-locked" aria-disabled="true"><Icon name="lock" /> Locked</span>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
