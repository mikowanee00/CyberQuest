/* =====================================================================
 * pages/LessonPage.jsx — One lesson, in clear steps:
 *   1 Learn → 2 Real examples → 3 Practice → 4 Quiz
 * A step bar stays at the top while scrolling and highlights the
 * step you are currently reading.
 * ===================================================================== */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Stars } from '../components/common.jsx';
import { FunFact, ExampleCards, QuickCheck } from '../components/LessonExtras.jsx';
import { ACTIVITIES } from '../components/activities/index.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getLesson } from '../data/lessons.js';
import { LESSON_EXTRAS } from '../data/lessonExtras.js';
import { prefersReducedMotion } from '../logic/effects.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function LessonPage() {
  const { id } = useParams();
  const lesson = getLesson(id);
  const extras = (lesson && LESSON_EXTRAS[lesson.id]) || {};
  const { lessons, markVisited, completeActivity, stars } = usePlayer();
  const toast = useToast();
  const rec = lesson ? lessons[lesson.id] : null;
  const [activeStep, setActiveStep] = useState('learn');

  // Remember the latest "done" state without re-creating the callback.
  const doneRef = useRef(false);
  doneRef.current = !!(rec && rec.activityDone);
  const savingRef = useRef(false);

  useEffect(() => {
    if (lesson) markVisited(lesson.id);
    savingRef.current = false;
    setActiveStep('learn');
  }, [lesson, markVisited]);

  /** Called by the activity when the player finishes it. */
  const handleComplete = useCallback(() => {
    if (!lesson || doneRef.current || savingRef.current) return;
    savingRef.current = true;
    completeActivity(lesson.id)
      .then(() => toast(<><Icon name="check" /> Activity complete! The quiz is next.</>, 'success'))
      .catch(err => { savingRef.current = false; toast(err.message, 'error'); });
  }, [lesson, completeActivity, toast]);

  // Build the list of steps this lesson has.
  const hasExamples = extras.examples && extras.examples.length > 0;
  const hasPractice = (extras.practice && extras.practice.length > 0) || !!(lesson && lesson.activity);
  const steps = [{ id: 'learn', label: 'Learn' }];
  if (hasExamples) steps.push({ id: 'examples', label: 'Real examples' });
  if (hasPractice) steps.push({ id: 'practice', label: lesson && lesson.final ? 'Warm-up' : 'Practice' });
  steps.push({ id: 'quiz-step', label: lesson && lesson.final ? 'Challenge' : 'Quiz' });
  const stepIds = steps.map(s => s.id).join(',');

  // Highlight the step whose section is currently on screen.
  useEffect(() => {
    if (!lesson || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveStep(entry.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    stepIds.split(',').forEach(sid => {
      const el = document.getElementById(sid);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [lesson, stepIds]);

  if (!lesson) return <NotFoundPage />;

  const prev = getLesson(lesson.id - 1);
  const next = getLesson(lesson.id + 1);
  const Activity = lesson.activity ? ACTIVITIES[lesson.activity.type] : null;
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
        </div>
      </section>

      {/* Step bar: stays visible while scrolling */}
      <nav className="step-bar" aria-label="Lesson steps" style={{ '--c': lesson.color }}>
        <div className="container">
          <ol className="stepper">
            {steps.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => jump(s.id)} className={activeStep === s.id ? 'is-current' : ''}
                  aria-current={activeStep === s.id ? 'step' : undefined}>
                  <span className="step-no">{i + 1}</span> {s.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="container lesson-body">
        {/* ---------- 1. Learn ---------- */}
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
          <FunFact text={extras.funFact} />
          <aside className="takeaways" aria-label="Key takeaways">
            <h3><Icon name="bulb" /> Remember</h3>
            <ul>{lesson.takeaways.map(t => <li key={t}><Icon name="check" /> <span>{t}</span></li>)}</ul>
          </aside>
        </section>

        {/* ---------- 2. Real examples ---------- */}
        {hasExamples && (
          <section id="examples" className="lesson-step" aria-labelledby="examples-title">
            <h2 id="examples-title" className="step-title"><span className="step-no">{stepNo('examples')}</span> Real examples</h2>
            <p className="step-intro">These stories show how it happens to real people, and how it could have been stopped.</p>
            <ExampleCards examples={extras.examples} />
          </section>
        )}

        {/* ---------- 3. Practice ---------- */}
        {hasPractice && (
          <section id="practice" className="lesson-step" aria-labelledby="practice-title">
            <h2 id="practice-title" className="step-title">
              <span className="step-no">{stepNo('practice')}</span> {lesson.final ? 'Warm-up' : 'Practice'}
            </h2>

            {extras.practice && extras.practice.length > 0 && (
              <>
                <h3 className="sub-title">Quick check</h3>
                <QuickCheck key={lesson.id} questions={extras.practice} />
              </>
            )}

            {Activity && (
              <>
                <h3 className="sub-title">
                  Try it: {lesson.activity.title}
                  {rec?.activityDone && <span className="chip chip-success"><Icon name="check" /> Done</span>}
                </h3>
                <div className="card activity-panel">
                  {/* key = lesson id: switching lessons starts a fresh activity */}
                  <Activity key={lesson.id} config={lesson.activity} onComplete={handleComplete} />
                </div>
              </>
            )}
          </section>
        )}

        {/* ---------- 4. Quiz ---------- */}
        <section id="quiz-step" className="lesson-step" aria-labelledby="quiz-title">
          <div className={`quiz-cta ${lesson.final ? 'is-final' : ''}`} style={{ '--c': lesson.color }}>
            <div>
              <h2 id="quiz-title" className="step-title">
                <span className="step-no">{stepNo('quiz-step')}</span> {lesson.final ? 'Ready for the final challenge?' : 'Quiz time!'}
              </h2>
              <p>
                {lesson.final
                  ? `${lesson.finalSettings.count} random questions · ${lesson.finalSettings.seconds} seconds each · bonus points for speed`
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
