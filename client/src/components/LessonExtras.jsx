/* =====================================================================
 * components/LessonExtras.jsx — Interactive lesson parts
 *   FunFact      "Did you know?" box
 *   KeyTerms     tap-to-reveal cards for the lesson's cybersecurity terms
 *   ScenarioLab  10 "What would you do?" scenarios, one at a time:
 *                feedback for every answer, retry until right, a star for
 *                each first-try answer, terms unlocked, and a fun rank.
 * Content comes from data/lessonExtras.js. Nothing here is saved to the
 * server; it's practice before the quiz.
 * ===================================================================== */
import { useState } from 'react';
import Icon from './Icon.jsx';
import Visual from './Visual.jsx';
import { shuffle } from '../logic/QuizEngine.js';
import { sound, confetti, prefersReducedMotion } from '../logic/effects.js';

/* ------------------------------------------------------------------ */
export function FunFact({ text }) {
  if (!text) return null;
  return (
    <aside className="fun-fact" aria-label="Did you know?">
      <span className="fun-fact-icon" aria-hidden="true">💡</span>
      <div><strong>Did you know?</strong><p>{text}</p></div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
export function KeyTerms({ terms }) {
  const [open, setOpen] = useState([]); // terms currently showing their meaning
  if (!terms || terms.length === 0) return null;
  const all = open.length === terms.length;

  const toggle = term => {
    setOpen(list => (list.includes(term) ? list.filter(t => t !== term) : [...list, term]));
    sound.play('click');
  };

  return (
    <div className="key-terms">
      <div className="key-terms-head">
        <p>Tap a card to reveal what it means. You'll meet these words in the scenarios and the quiz.</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(all ? [] : terms.map(t => t.term))}>
          <Icon name="eye" /> {all ? 'Hide all' : 'Reveal all'}
        </button>
      </div>
      <div className="term-grid">
        {terms.map(t => {
          const isOpen = open.includes(t.term);
          return (
            <button key={t.term} type="button" className={`term-card ${isOpen ? 'is-open' : ''}`}
              aria-expanded={isOpen} onClick={() => toggle(t.term)}>
              <span className="term-emoji" aria-hidden="true">{t.emoji}</span>
              <strong>{t.term}</strong>
              {isOpen ? <span className="term-def">{t.def}</span> : <span className="term-tap">Tap to reveal</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/** Fun rank for the number of first-try answers out of 10. */
function labRank(stars, total) {
  const ratio = stars / total;
  if (ratio === 1) return { title: 'Unscammable 🧠', text: 'Perfect run! Scammers should just give up now.' };
  if (ratio >= 0.8) return { title: 'Street smart 😎', text: 'You saw through almost every trick on the first try.' };
  if (ratio >= 0.5) return { title: 'Getting sharp 🔍', text: 'Nice work! A couple of traps got you, but you know them now.' };
  return { title: 'Training arc 💪', text: 'Every mistake here is one you won\'t make in real life. Try another run!' };
}

/** One scenario. Wrong answers are crossed out; keep trying until right. */
function ScenarioCard({ scenario, order, number, total, termInfo, onSolved, onNext, isLast }) {
  const [tried, setTried] = useState([]); // option indexes picked so far
  const solved = tried.some(i => scenario.options[i].ok);
  const lastPick = tried[tried.length - 1];

  function pick(i) {
    if (solved || tried.includes(i)) return;
    setTried(list => [...list, i]);
    if (scenario.options[i].ok) {
      sound.play('correct');
      onSolved(tried.length === 0); // first try = no wrong picks before
    } else {
      sound.play('wrong');
    }
  }

  return (
    <article className="scenario-card" aria-labelledby={`scenario-${number}`}>
      <p className="scenario-count">Scenario {number} of {total}</p>
      <h3 id={`scenario-${number}`} className="scenario-title">{scenario.title}</h3>
      <p className="scenario-story">{scenario.story}</p>
      {scenario.visual && <div className="scenario-visual"><Visual visual={scenario.visual} /></div>}
      <p className="scenario-ask">{scenario.ask || 'What do you do?'}</p>

      <div className="scenario-options">
        {order.map(i => {
          const opt = scenario.options[i];
          const state = tried.includes(i) ? (opt.ok ? 'is-correct' : 'is-wrong') : solved ? 'is-dim' : '';
          return (
            <button key={opt.text} type="button" className={`scenario-option ${state}`}
              disabled={solved || tried.includes(i)} onClick={() => pick(i)}>
              {opt.text}
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {lastPick !== undefined && (
          <div className={`scenario-feedback ${solved ? 'good' : 'bad'}`}>
            <strong>{solved ? (tried.length === 1 ? '⭐ First try!' : '✅ Got it!') : '❌ Not quite.'}</strong>{' '}
            {scenario.options[lastPick].says}
            {!solved && <span className="scenario-retry"> Try another answer.</span>}
          </div>
        )}
        {solved && termInfo && (
          <div className="term-unlocked">
            <span aria-hidden="true">{termInfo.emoji}</span>
            <span><small>Term unlocked</small><strong>{termInfo.term}</strong> — {termInfo.def}</span>
          </div>
        )}
      </div>

      {solved && (
        <div className="scenario-next">
          <button type="button" className="btn btn-primary" onClick={onNext} autoFocus>
            {isLast ? 'See my results' : 'Next scenario'} <Icon name="arrowRight" />
          </button>
        </div>
      )}
    </article>
  );
}

export function ScenarioLab({ scenarios, terms, nextSectionId }) {
  const total = scenarios ? scenarios.length : 0;
  const newOrders = () => scenarios.map(sc => shuffle(sc.options.map((_, i) => i)));
  const [run, setRun] = useState(0);                 // increases on "Play again"
  const [orders, setOrders] = useState(() => (total ? newOrders() : []));
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);        // per scenario: 'star' | 'done'
  const [finished, setFinished] = useState(false);
  if (!total) return null;

  const stars = results.filter(r => r === 'star').length;
  const scenario = scenarios[index];
  const termInfo = scenario.term ? (terms || []).find(t => t.term === scenario.term) : null;

  function handleSolved(firstTry) {
    setResults(list => {
      const copy = [...list];
      copy[index] = firstTry ? 'star' : 'done';
      return copy;
    });
  }

  function next() {
    if (index === total - 1) {
      setFinished(true);
      if (stars >= total * 0.8) { sound.play('win'); confetti.burst(120); }
    } else {
      setIndex(i => i + 1);
    }
  }

  function playAgain() {
    setOrders(newOrders());
    setIndex(0);
    setResults([]);
    setFinished(false);
    setRun(r => r + 1);
  }

  const goOn = () => document.getElementById(nextSectionId)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });

  return (
    <div className="scenario-lab">
      <div className="lab-bar">
        <ol className="lab-dots" aria-label={`Scenario progress: ${results.filter(Boolean).length} of ${total} solved`}>
          {scenarios.map((sc, i) => (
            <li key={sc.title}
              className={`lab-dot ${results[i] === 'star' ? 'is-star' : results[i] ? 'is-done' : ''} ${i === index && !finished ? 'is-current' : ''}`}
              title={sc.title} />
          ))}
        </ol>
        <span className="lab-stars" aria-label={`${stars} stars`}>⭐ {stars}</span>
      </div>

      {finished ? (
        <div className="lab-summary">
          <p className="lab-summary-score">⭐ {stars} / {total}</p>
          <p className="lab-summary-label">solved on the first try</p>
          <h3>{labRank(stars, total).title}</h3>
          <p>{labRank(stars, total).text}</p>
          <div className="btn-row center">
            <button type="button" className="btn btn-secondary" onClick={playAgain}><Icon name="refresh" /> Play again</button>
            {nextSectionId && <button type="button" className="btn btn-primary" onClick={goOn}>Keep going <Icon name="arrowRight" /></button>}
          </div>
        </div>
      ) : (
        <ScenarioCard
          key={`${run}-${index}`}
          scenario={scenario}
          order={orders[index]}
          number={index + 1}
          total={total}
          termInfo={termInfo}
          onSolved={handleSolved}
          onNext={next}
          isLast={index === total - 1}
        />
      )}
    </div>
  );
}
