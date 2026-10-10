/* =====================================================================
 * pages/QuizPage.jsx — Runs a quiz, then sends the result to the server
 * ---------------------------------------------------------------------
 * The QuizEngine (logic/QuizEngine.js) holds the quiz state; this page
 * only displays it and reacts to clicks, keys and the timer.
 * ===================================================================== */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Visual from '../components/Visual.jsx';
import { ProgressBar } from '../components/common.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { getLesson } from '../data/lessons.js';
import { createEngine } from '../logic/QuizEngine.js';
import { isFinalUnlocked } from '../logic/scoring.js';
import { sound } from '../logic/effects.js';
import QuizResults from './QuizResults.jsx';
import NotFoundPage from './NotFoundPage.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const PRAISE = ['Correct!', 'Nailed it!', 'Sharp eyes!', 'Exactly right!', 'Well spotted!'];
const OOPS = ['Not quite.', 'Oops — that was a trap!', 'Close, but no.', 'Careful!'];
const pick = list => list[Math.floor(Math.random() * list.length)];

/** Converts the engine's result into the JSON the server expects. */
function toPayload(result, startedAt) {
  return {
    score: result.score,
    total: result.total,
    bonus: result.bonus,
    durationSeconds: Math.round((Date.now() - startedAt) / 1000),
    answers: result.answers.map(a => ({
      question: a.question.prompt,
      fromLesson: a.question.fromLesson,
      chosen: a.choice >= 0 ? a.question.options[a.choice] : '(no answer – time ran out)',
      correctAnswer: a.question.options[a.question.answer],
      correct: a.correct,
      timedOut: a.timedOut
    }))
  };
}

export default function QuizPage() {
  const { id } = useParams();
  const lesson = getLesson(id);
  const { submitQuiz, status } = usePlayer();

  const [round, setRound] = useState(0);                                  // "Try again" creates a new round
  const engine = useMemo(() => (lesson ? createEngine(lesson) : null), [lesson, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [, setTick] = useState(0);                                         // forces a re-render after engine changes
  const rerender = () => setTick(t => t + 1);

  const [headline, setHeadline] = useState('');
  const [phase, setPhase] = useState('quiz');                             // 'quiz' | 'saving' | 'results'
  const [result, setResult] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const secondsRef = useRef(0);
  const startedAt = useRef(Date.now());
  const promptRef = useRef(null);
  const nextRef = useRef(null);

  // Reset when a new round (or another lesson) starts.
  useEffect(() => {
    setPhase('quiz');
    setResult(null);
    setOutcome(null);
    setHeadline('');
    startedAt.current = Date.now();
  }, [engine]);

  const q = engine && !engine.finished ? engine.current : null;
  const answered = engine ? engine.answered : false;

  /** Player picked option `index` (or -1 when the timer ran out). */
  const choose = useCallback(index => {
    if (!engine || engine.answered || engine.finished) return;
    const rec = engine.answer(index, secondsRef.current);
    sound.play(rec.correct ? 'correct' : 'wrong');
    setHeadline(rec.timedOut ? "⏰ Time's up!" : rec.correct ? `✅ ${pick(PRAISE)}` : `❌ ${pick(OOPS)}`);
    rerender();
  }, [engine]);

  /** Next question, or finish and save the result. */
  const next = useCallback(async () => {
    if (!engine || !engine.answered) return;
    if (engine.next()) {
      setHeadline('');
      rerender();
      return;
    }
    const res = engine.result();
    setResult(res);
    setPhase('saving');
    try {
      setOutcome(await submitQuiz(lesson.id, toPayload(res, startedAt.current)));
    } catch (err) {
      setOutcome({ error: err.message });
    }
    setPhase('results');
  }, [engine, lesson, submitQuiz]);

  // Move focus to the question (new question) or the Next button (answered).
  useEffect(() => {
    if (phase !== 'quiz') return;
    if (answered) nextRef.current?.focus({ preventScroll: true });
    else promptRef.current?.focus({ preventScroll: true });
  }, [answered, engine?.index, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer (final challenge only).
  useEffect(() => {
    if (!engine || !engine.timed || phase !== 'quiz' || engine.answered || engine.finished) return undefined;
    const total = engine.seconds * 1000;
    const endsAt = Date.now() + total;
    const tick = () => {
      const left = Math.max(0, endsAt - Date.now());
      secondsRef.current = left / 1000;
      setSecondsLeft(left / 1000);
      if (left <= 0) choose(-1);
    };
    tick();
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [engine, engine?.index, answered, phase, choose]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts: A–D or 1–4 to answer, Enter for next.
  useEffect(() => {
    if (phase !== 'quiz') return undefined;
    const onKey = e => {
      if (!engine || engine.finished || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.matches('input, textarea')) return;
      const key = e.key.toLowerCase();
      if (!engine.answered) {
        let idx = -1;
        if (/^[1-9]$/.test(key)) idx = Number(key) - 1;
        else if (/^[a-e]$/.test(key)) idx = key.charCodeAt(0) - 97;
        if (idx >= 0 && idx < engine.current.options.length) { e.preventDefault(); choose(idx); }
      } else if (key === 'enter' && e.target !== nextRef.current) {
        e.preventDefault();
        next();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [engine, phase, choose, next]);

  if (!lesson) return <NotFoundPage />;
  // The final challenge only opens after all 10 lessons are completed.
  if (lesson.final && !isFinalUnlocked(status) && phase === 'quiz') return <Navigate to="/challenge" replace />;

  const header = (
    <div className="quiz-top">
      <Link className="text-link" to={lesson.final ? '/challenge' : `/lesson/${lesson.id}`}><Icon name="x" /> Exit {lesson.final ? 'challenge' : 'quiz'}</Link>
      <span className="quiz-label"><Icon name={lesson.icon} /> {lesson.title}</span>
    </div>
  );

  if (phase !== 'quiz') {
    return (
      <div className="quiz-page" style={{ '--c': lesson.color }}>
        <div className="container quiz-container">
          {header}
          {phase === 'saving'
            ? <div className="loading"><span className="spinner" /> Saving your result…</div>
            : <QuizResults lesson={lesson} result={result} outcome={outcome} onRetry={() => setRound(r => r + 1)} />}
        </div>
      </div>
    );
  }

  const record = engine.answers[engine.index];
  return (
    <div className="quiz-page" style={{ '--c': lesson.color }}>
      <div className="container quiz-container">
        {header}

        <div className="quiz-progress">
          <div className="quiz-progress-row">
            <span>Question <strong>{engine.number}</strong> of {engine.total}</span>
            <span className="quiz-score"><Icon name="check" /> {engine.score} correct</span>
          </div>
          <ProgressBar percent={((engine.number - 1) / engine.total) * 100} />
        </div>

        {engine.timed && (
          <div className={`timer ${secondsLeft <= 5 ? 'is-low' : ''}`} aria-hidden="true">
            <div className="timer-bar"><span style={{ width: `${(secondsLeft / engine.seconds) * 100}%` }} /></div>
            <span className="timer-text"><Icon name="clock" /> <b>{Math.ceil(secondsLeft)}</b>s</span>
          </div>
        )}

        <div className="question-card card" key={`${round}-${engine.index}`}>
          {lesson.final && <p className="q-from">{q.fromLesson === lesson.id ? 'Bonus scenario' : `From Lesson ${q.fromLesson}`}</p>}
          <h2 className="q-prompt" id="q-prompt" tabIndex={-1} ref={promptRef}>{q.prompt}</h2>
          {q.visual && <div className="q-visual"><Visual visual={q.visual} /></div>}

          <div className={`options ${q.options.length === 2 ? 'options-binary' : ''}`} role="group" aria-labelledby="q-prompt">
            {q.options.map((opt, i) => {
              let cls = '';
              if (answered) cls = i === q.answer ? 'is-correct' : i === record.choice ? 'is-wrong' : 'is-dim';
              return (
                <button key={opt} type="button" className={`option ${cls}`} disabled={answered} onClick={() => choose(i)}>
                  <span className="opt-key" aria-hidden="true">{LETTERS[i]}</span>
                  <span className="opt-text">{opt}</span>
                </button>
              );
            })}
          </div>

          <div aria-live="assertive">
            {answered && (
              <>
                <div className={`feedback ${record.correct ? 'good' : 'bad'}`}>
                  <p>
                    <strong>{headline}</strong>
                    {record.bonus > 0 && <span className="bonus">+{record.bonus} speed bonus <Icon name="zap" /></span>}
                  </p>
                  <p>{q.explain}</p>
                </div>
                <div className="quiz-actions">
                  <button type="button" className="btn btn-primary btn-lg" ref={nextRef} onClick={next}>
                    {engine.isLast ? 'See my results' : 'Next question'} <Icon name="arrowRight" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="kbd-hint">
          Tip: press <kbd>A</kbd>–<kbd>{LETTERS[q.options.length - 1]}</kbd> (or <kbd>1</kbd>–<kbd>{q.options.length}</kbd>) to answer and <kbd>Enter</kbd> to continue.
        </p>
      </div>
    </div>
  );
}
