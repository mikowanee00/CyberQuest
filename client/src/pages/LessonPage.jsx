/* =====================================================================
 * pages/LessonPage.jsx — One lesson: 1 Learn → 2 Practice → 3 Quiz
 * ===================================================================== */
import { useCallback, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Stars } from '../components/common.jsx';
import { ACTIVITIES } from '../components/activities/index.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getLesson } from '../data/lessons.js';
import { prefersReducedMotion } from '../logic/effects.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function LessonPage() {
  const { id } = useParams();
  const lesson = getLesson(id);
  const { lessons, markVisited, completeActivity, stars } = usePlayer();
  const toast = useToast();
  const rec = lesson ? lessons[lesson.id] : null;

  // Remember the latest "done" state without re-creating the callback.
  const doneRef = useRef(false);
  doneRef.current = !!(rec && rec.activityDone);
  const savingRef = useRef(false);

  useEffect(() => {
    if (lesson) markVisited(lesson.id);
    savingRef.current = false;
  }, [lesson, markVisited]);

  /** Called by the activity when the player finishes it. */
  const handleComplete = useCallback(() => {
    if (!lesson || doneRef.current || savingRef.current) return;
    savingRef.current = true;
    completeActivity(lesson.id)
      .then(() => toast(<><Icon name="check" /> Practice complete! Scroll down for the quiz.</>, 'success'))
      .catch(err => { savingRef.current = false; toast(err.message, 'error'); });
  }, [lesson, completeActivity, toast]);

  if (!lesson) return <NotFoundPage />;

  const prev = getLesson(lesson.id - 1);
  const next = getLesson(lesson.id + 1);
  const Activity = lesson.activity ? ACTIVITIES[lesson.activity.type] : null;

  // The final challenge has no practice step.
  const steps = [{ id: 'learn', label: 'Learn' }];
  if (lesson.activity) steps.push({ id: 'practice', label: 'Practice' });
  steps.push({ id: 'quiz-step', label: lesson.final ? 'Challenge' : 'Quiz' });
  const stepNo = sid => steps.findIndex(s => s.id === sid) + 1;
  const jump = sid => document.getElementById(sid)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });

  return (
    <>
      <section className="lesson-hero" style={{ '--c': lesson.color }}>
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span>
            <Link to="/lessons">Lessons</Link><span aria-hidden="true">/</span>
            <span aria-current="page">Lesson {lesson.id}</span>
          </nav>
          <div className="lesson-hero-inner">
            <div className="lesson-hero-icon"><Icon name={lesson.icon} /></div>
            <div>
              <p className="eyebrow">Lesson {lesson.id} of 10 · <Icon name="clock" /> {lesson.minutes} min</p>
              <h1>{lesson.title}</h1>
              <p className="lead">{lesson.summary}</p>
            </div>
          </div>
          <ol className="stepper" aria-label="Lesson steps">
            {steps.map((s, i) => (
              <li key={s.id}><button type="button" onClick={() => jump(s.id)}><span className="step-no">{i + 1}</span> {s.label}</button></li>
            ))}
          </ol>
        </div>
      </section>

      <div className="container lesson-body">
        <section id="learn" className="lesson-step" aria-labelledby="learn-title">
          <h2 id="learn-title" className="step-title"><span className="step-no">{stepNo('learn')}</span> Learn</h2>
          <div className="lesson-sections">
            {lesson.sections.map(s => (
              <article key={s.heading} className="card lesson-section">
                <h3>{s.heading}</h3>
                <div dangerouslySetInnerHTML={{ __html: s.body }} />
              </article>
            ))}
          </div>
          <aside className="takeaways" aria-label="Key takeaways">
            <h3><Icon name="bulb" /> Key takeaways</h3>
            <ul>{lesson.takeaways.map(t => <li key={t}><Icon name="check" /> <span>{t}</span></li>)}</ul>
          </aside>
        </section>

        {Activity && (
          <section id="practice" className="lesson-step" aria-labelledby="practice-title">
            <h2 id="practice-title" className="step-title">
              <span className="step-no">{stepNo('practice')}</span> Practice: {lesson.activity.title}
              {rec?.activityDone && <span className="chip chip-success"><Icon name="check" /> Done</span>}
            </h2>
            <div className="card activity-panel">
              {/* key = lesson id: switching lessons starts a fresh activity */}
              <Activity key={lesson.id} config={lesson.activity} onComplete={handleComplete} />
            </div>
          </section>
        )}

        <section id="quiz-step" className="lesson-step" aria-labelledby="quiz-title">
          <div className={`quiz-cta ${lesson.final ? 'is-final' : ''}`} style={{ '--c': lesson.color }}>
            <div>
              <h2 id="quiz-title" className="step-title">
                <span className="step-no">{stepNo('quiz-step')}</span> {lesson.final ? 'Ready for the final challenge?' : 'Quiz time!'}
              </h2>
              <p>
                {lesson.final
                  ? `${lesson.finalSettings.count} random questions · ${lesson.finalSettings.seconds} seconds each · bonus XP for speed`
                  : <>{lesson.quiz.length} questions · instant feedback · score 70% to earn the <strong>{lesson.badge}</strong> badge</>}
              </p>
              {rec && rec.attempts > 0 && (
                <p className="best-line">Your best: <strong>{rec.bestScore}/{rec.total}</strong> <Stars count={stars(lesson.id)} /></p>
              )}
            </div>
            <Link className="btn btn-primary btn-lg" to={`/quiz/${lesson.id}`}>
              <Icon name={lesson.final ? 'trophy' : 'play'} /> {lesson.final ? 'Start the challenge' : 'Start the quiz'}
            </Link>
          </div>
        </section>

        <nav className="lesson-pager" aria-label="Lesson navigation">
          {prev ? (
            <Link className="pager-link" to={`/lesson/${prev.id}`}><Icon name="arrowLeft" /><span><small>Previous</small>{prev.title}</span></Link>
          ) : <span />}
          {next ? (
            <Link className="pager-link pager-next" to={`/lesson/${next.id}`}><span><small>Next</small>{next.title}</span><Icon name="arrowRight" /></Link>
          ) : <span />}
        </nav>
      </div>
    </>
  );
}
