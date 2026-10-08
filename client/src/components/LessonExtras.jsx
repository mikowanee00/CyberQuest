/* =====================================================================
 * components/LessonExtras.jsx — Extra lesson parts
 *   FunFact      "Did you know?" box
 *   ExampleCards real-life stories (what happened / red flags / what to do)
 *   QuickCheck   ungraded practice questions — try again until correct
 * Content comes from data/lessonExtras.js.
 * ===================================================================== */
import { useState } from 'react';
import Icon from './Icon.jsx';
import { QuizEngine } from '../logic/QuizEngine.js';
import { sound } from '../logic/effects.js';

export function FunFact({ text }) {
  if (!text) return null;
  return (
    <aside className="fun-fact" aria-label="Did you know?">
      <span className="fun-fact-icon" aria-hidden="true">💡</span>
      <div><strong>Did you know?</strong><p>{text}</p></div>
    </aside>
  );
}

export function ExampleCards({ examples }) {
  if (!examples || examples.length === 0) return null;
  return (
    <div className="example-grid">
      {examples.map(ex => (
        <article key={ex.title} className="example-card">
          <h3>{ex.title}</h3>
          <p className="example-label">What happened</p>
          <p>{ex.story}</p>
          <p className="example-label">{ex.flagsTitle || 'Red flags'}</p>
          <ul className="example-flags">
            {ex.flags.map(f => <li key={f}>{f}</li>)}
          </ul>
          <div className="example-fix">
            <p className="example-label">What to do</p>
            <p>{ex.fix}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

/** One practice question. Wrong answers are greyed out; keep trying until right. */
function CheckQuestion({ question, number, onSolved }) {
  const q = QuizEngine.normalize(question); // turns true/false into two options
  const [wrong, setWrong] = useState([]);
  const [solved, setSolved] = useState(false);

  function pick(i) {
    if (solved || wrong.includes(i)) return;
    if (i === q.answer) {
      setSolved(true);
      sound.play('correct');
      onSolved();
    } else {
      setWrong(list => [...list, i]);
      sound.play('wrong');
    }
  }

  return (
    <div className={`check-card ${solved ? 'is-solved' : ''}`}>
      <p className="check-q"><span className="check-no">{number}</span> {q.prompt}</p>
      <div className={`check-options ${q.options.length === 2 ? 'two' : ''}`}>
        {q.options.map((opt, i) => {
          const state = solved && i === q.answer ? 'is-correct' : wrong.includes(i) ? 'is-wrong' : '';
          return (
            <button key={opt} type="button" className={`check-option ${state}`}
              disabled={solved || wrong.includes(i)} onClick={() => pick(i)}>
              {opt}
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {solved && <p className="check-feedback good"><strong>Correct!</strong> {q.explain}</p>}
        {!solved && wrong.length > 0 && <p className="check-feedback bad">Not quite — try another answer.</p>}
      </div>
    </div>
  );
}

export function QuickCheck({ questions }) {
  const [solved, setSolved] = useState(0);
  if (!questions || questions.length === 0) return null;
  const done = solved === questions.length;
  return (
    <div className="quick-check">
      <div className="quick-check-head">
        <p>Answer these to warm up. They don't count toward your score, so try as many times as you like.</p>
        <span className={`chip ${done ? 'chip-success' : 'chip-muted'}`}>
          {done ? <><Icon name="check" /> All done</> : `${solved} / ${questions.length} solved`}
        </span>
      </div>
      {questions.map((q, i) => (
        <CheckQuestion key={q.prompt} question={q} number={i + 1} onSolved={() => setSolved(s => s + 1)} />
      ))}
    </div>
  );
}
