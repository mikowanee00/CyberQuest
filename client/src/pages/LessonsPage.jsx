/* =====================================================================
 * pages/LessonsPage.jsx — The 10 lessons + the final challenge
 * ===================================================================== */
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Stars, StatusChip, ProgressBar } from '../components/common.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { REGULAR_LESSONS, FINAL, lessonPath } from '../data/lessons.js';
import { nextLesson, isFinalUnlocked, lessonsLeft } from '../logic/scoring.js';

export default function LessonsPage() {
  const { player, lessons, status, stars } = usePlayer();
  const total = REGULAR_LESSONS.length;
  const left = lessonsLeft(status).length;
  const done = total - left;
  const next = nextLesson(status);
  const unlocked = isFinalUnlocked(status);
  const finalRec = lessons[FINAL.id];

  return (
    <>
      <section className="page-head">
        <div className="container page-head-inner">
          <div>
            <p className="eyebrow"><Icon name="grid" /> Mission map</p>
            <h1>Lessons</h1>
            <p className="lead">Work through the 10 lessons in order, or jump to any topic. Pass each quiz with 70% or more to earn its badge. Finish all 10 to unlock the final challenge.</p>
          </div>
          <div className="overall card">
            <div className="overall-top"><strong>{done} / {total}</strong> lessons completed</div>
            <ProgressBar percent={(done / total) * 100} large />
            <Link className="btn btn-primary" to={lessonPath(next)}>
              <Icon name={next.final ? 'trophy' : 'play'} /> {next.final ? 'Take the final challenge' : `Next up: Lesson ${next.id}`}
            </Link>
          </div>
        </div>
      </section>

      <div className="container page-body">
        {!player && (
          <p className="banner banner-info"><Icon name="user" /> <span><Link to="/">Pick a nickname</Link> on the Home page to start the lessons and save your progress.</span></p>
        )}

        <div className="lesson-grid">
          {REGULAR_LESSONS.map(l => {
            const rec = lessons[l.id];
            return (
              <Link key={l.id} className="lesson-card" to={lessonPath(l)} style={{ '--c': l.color }}>
                <div className="lc-top">
                  <span className="lc-icon"><Icon name={l.icon} /></span>
                  <StatusChip status={status(l.id)} />
                </div>
                <p className="lc-num">Lesson {l.id}</p>
                <h3>{l.title}</h3>
                <p className="lc-summary">{l.summary}</p>
                <div className="lc-foot">
                  <span><Icon name="clock" /> {l.minutes} min</span>
                  {rec && rec.attempts > 0 && <span>Best {rec.bestScore}/{rec.total}</span>}
                  <Stars count={stars(l.id)} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* The final challenge: its own part, after the 10 lessons */}
        <Link to={lessonPath(FINAL)} className={`final-banner ${unlocked ? 'is-unlocked' : 'is-locked'}`} style={{ '--c': FINAL.color }}>
          <span className="final-banner-icon"><Icon name={unlocked ? 'trophy' : 'lock'} /></span>
          <span className="final-banner-text">
            <small>Boss level</small>
            <strong>{FINAL.title}</strong>
            <span>
              {unlocked
                ? 'Unlocked! Ten random questions from every lesson, against the clock.'
                : `Locked: complete ${left} more ${left === 1 ? 'lesson' : 'lessons'} to unlock it.`}
            </span>
          </span>
          {finalRec && finalRec.attempts > 0 && <Stars count={stars(FINAL.id)} />}
          <span className="final-banner-cta">{unlocked ? <>Start <Icon name="arrowRight" /></> : <>{done}/{total}</>}</span>
        </Link>
      </div>
    </>
  );
}
