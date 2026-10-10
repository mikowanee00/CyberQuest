/* =====================================================================
 * pages/LessonPage.jsx — One lesson, in clear steps:
 *   1 Learn → 2 Key terms → 3 Scenarios → 4 Try it → 5 Quiz
 * A step bar stays at the top while scrolling and highlights the
 * step you are currently on. (The final challenge has its own page.)
 * ===================================================================== */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Stars } from '../components/common.jsx';
import { FunFact, KeyTerms, ScenarioLab } from '../components/LessonExtras.jsx';
import { ACTIVITIES } from '../components/activities/index.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getLesson, lessonPath, REGULAR_LESSONS } from '../data/lessons.js';
import { LESSON_EXTRAS } from '../data/lessonExtras.js';
import { lessonLabel } from '../logic/scoring.js';
import { prefersReducedMotion } from '../logic/effects.js';
import NotFoundPage from './NotFoundPage.jsx';

const STEPS = [
  { id: 'learn', label: 'Learn' },
  { id: 'terms', label: 'Key terms' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'tryit', label: 'Try it' },
  { id: 'quiz-step', label: 'Quiz' }
];

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
    if (lesson && !lesson.final) markVisited(lesson.id);
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

  // Highlight the step whose section is currently on screen.
  useEffect(() => {
    if (!lesson || lesson.final || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveStep(entry.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    STEPS.forEach(step => {
      const el = document.getElementById(step.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [lesson]);

  if (!lesson) return <NotFoundPage />;
  if (lesson.final) return <Navigate to="/challenge" replace />;

  const prev = getLesson(lesson.id - 1);
  const next = getLesson(lesson.id + 1); // after Lesson 10 this is the final challenge
  const Activity = ACTIVITIES[lesson.activity.type];
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
              <p className="eyebrow">Lesson {lesson.id} of {REGULAR_LESSONS.length} · <Icon name="clock" /> {lesson.minutes} min</p>
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
            {STEPS.map((s, i) => (
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
          <h2 id="learn-title" className="step-title"><span className="step-no">1</span> Learn</h2>
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

        {/* ---------- 2. Key terms ---------- */}
        <section id="terms" className="lesson-step" aria-labelledby="terms-title">
          <h2 id="terms-title" className="step-title"><span className="step-no">2</span> Key terms</h2>
          <KeyTerms terms={extras.terms} />
        </section>

        {/* ---------- 3. Scenarios ---------- */}
        <section id="scenarios" className="lesson-step" aria-labelledby="scenarios-title">
          <h2 id="scenarios-title" className="step-title"><span className="step-no">3</span> Scenarios: what would you do?</h2>
          <p className="step-intro">Ten real-life situations. Pick what you'd do and see what happens. Wrong answers are fine here: try again until you get it, and earn a ⭐ for every first-try answer.</p>
          <ScenarioLab key={lesson.id} scenarios={extras.scenarios} terms={extras.terms} nextSectionId="tryit" />
        </section>

        {/* ---------- 4. Try it ---------- */}
        <section id="tryit" className="lesson-step" aria-labelledby="tryit-title">
          <h2 id="tryit-title" className="step-title">
            <span className="step-no">4</span> Try it: {lesson.activity.title}
            {rec?.activityDone && <span className="chip chip-success"><Icon name="check" /> Done</span>}
          </h2>
          <div className="card activity-panel">
            {/* key = lesson id: switching lessons starts a fresh activity */}
            <Activity key={lesson.id} config={lesson.activity} onComplete={handleComplete} />
          </div>
        </section>

        {/* ---------- 5. Quiz ---------- */}
        <section id="quiz-step" className="lesson-step" aria-labelledby="quiz-title">
          <div className="quiz-cta" style={{ '--c': lesson.color }}>
            <div>
              <h2 id="quiz-title" className="step-title"><span className="step-no">5</span> Quiz time!</h2>
              <p>{lesson.quiz.length} questions · instant feedback · score 70% to complete the lesson and earn the <strong>{lesson.badge}</strong> badge</p>
              {rec && rec.attempts > 0 && (
                <p className="best-line">Your best: <strong>{rec.bestScore}/{rec.total}</strong> <Stars count={stars(lesson.id)} /></p>
              )}
            </div>
            <Link className="btn btn-primary btn-lg" to={`/quiz/${lesson.id}`}><Icon name="play" /> Start the quiz</Link>
          </div>
        </section>

        <nav className="lesson-pager" aria-label="Lesson navigation">
          {prev ? (
            <Link className="pager-link" to={lessonPath(prev)}><Icon name="arrowLeft" /><span><small>Previous</small>{prev.title}</span></Link>
          ) : <span />}
          {next ? (
            <Link className="pager-link pager-next" to={lessonPath(next)}><span><small>Next · {lessonLabel(next)}</small>{next.title}</span><Icon name="arrowRight" /></Link>
          ) : <span />}
        </nav>
      </div>
    </>
  );
}
