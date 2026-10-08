/* =====================================================================
 * pages/LessonsPage.jsx — Grid of all 10 lessons ("mission map")
 * ===================================================================== */
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Stars, StatusChip, ProgressBar } from '../components/common.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { LESSONS } from '../data/lessons.js';
import { nextLesson } from '../logic/scoring.js';

export default function LessonsPage() {
  const { player, lessons, stats, status, stars } = usePlayer();
  const done = stats.completedCount;
  const next = nextLesson(status);

  return (
    <>
      <section className="page-head">
        <div className="container page-head-inner">
          <div>
            <p className="eyebrow"><Icon name="grid" /> Mission map</p>
            <h1>Lessons</h1>
            <p className="lead">Work through the lessons in order, or jump to any topic. Each one ends with a quiz — score 70% or more to earn its badge.</p>
          </div>
          <div className="overall card">
            <div className="overall-top"><strong>{done} / 10</strong> completed</div>
            <ProgressBar percent={done * 10} large />
            <Link className="btn btn-primary" to={`/lesson/${next.id}`}>
              <Icon name="play" /> {done === 10 ? 'Replay the final challenge' : `Next up: Lesson ${next.id}`}
            </Link>
          </div>
        </div>
      </section>

      <div className="container page-body">
        {!player && (
          <p className="banner banner-info"><Icon name="user" /> <span><Link to="/">Create a player profile</Link> on the Home page to start the lessons and save your progress.</span></p>
        )}
        <div className="lesson-grid">
          {LESSONS.map(l => {
            const rec = lessons[l.id];
            return (
              <Link key={l.id} className={`lesson-card ${l.final ? 'is-final' : ''}`} to={`/lesson/${l.id}`} style={{ '--c': l.color }}>
                <div className="lc-top">
                  <span className="lc-icon"><Icon name={l.icon} /></span>
                  <StatusChip status={status(l.id)} />
                </div>
                <p className="lc-num">{l.final ? 'Final challenge' : `Lesson ${l.id}`}</p>
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
      </div>
    </>
  );
}
