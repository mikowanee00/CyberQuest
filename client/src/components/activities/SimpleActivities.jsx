/* =====================================================================
 * components/activities/SimpleActivities.jsx
 *   ActivityHint    – yellow instruction box shown above every activity
 *   FlipCards       – tap cards to reveal definitions        (Lesson 1)
 *   ChoiceExplorer  – compare Wi-Fi networks                 (Lesson 6)
 *   Triage          – rapid-fire "Scam or legit?"            (Lesson 8)
 * Every activity receives { config, onComplete } and calls onComplete()
 * when the player has finished it.
 * ===================================================================== */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';
import Visual from '../Visual.jsx';
import { sound } from '../../logic/effects.js';

export function ActivityHint({ children }) {
  return <p className="activity-hint"><Icon name="bulb" /> <span>{children}</span></p>;
}

/* ------------------------------------------------------------------ */
export function FlipCards({ config, onComplete }) {
  const [flipped, setFlipped] = useState([]);   // cards currently showing their back
  const [seen, setSeen] = useState([]);         // cards flipped at least once
  const total = config.cards.length;

  function flip(i) {
    setFlipped(list => (list.includes(i) ? list.filter(x => x !== i) : [...list, i]));
    setSeen(list => (list.includes(i) ? list : [...list, i]));
    sound.play('click');
  }

  useEffect(() => { if (seen.length === total) onComplete(); }, [seen.length, total, onComplete]);

  return (
    <>
      <ActivityHint>{config.instructions}</ActivityHint>
      <div className="flip-grid">
        {config.cards.map((c, i) => (
          <button key={c.title} type="button" className={`flip-card ${flipped.includes(i) ? 'is-flipped' : ''}`}
            aria-pressed={flipped.includes(i)} aria-label={`${c.title} — flip card`} onClick={() => flip(i)}>
            <span className="flip-inner">
              <span className="flip-face flip-front">
                <span className="flip-emoji" aria-hidden="true">{c.emoji}</span>
                <strong>{c.title}</strong>
                <span className="flip-tap">Tap to flip ↻</span>
              </span>
              <span className="flip-face flip-back">
                <strong>{c.title}</strong>
                <span>{c.text}</span>
                <em>Example: {c.example}</em>
              </span>
            </span>
          </button>
        ))}
      </div>
      <p className={`activity-status ${seen.length === total ? 'is-done' : ''}`} aria-live="polite">
        {seen.length === total
          ? <><Icon name="check" /> All {total} cards explored — nice!</>
          : `${seen.length} / ${total} cards explored`}
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
const RATING_TEXT = { best: 'Best choice', ok: 'OK with care', risky: 'Risky' };

function SignalBars({ level }) {
  return (
    <svg className="signal" viewBox="0 0 19 16" aria-label={`Signal ${level} of 4`}>
      {[1, 2, 3, 4].map(i => (
        <rect key={i} x={(i - 1) * 5} y={16 - i * 4} width="3.5" height={i * 4} rx="1" className={i <= level ? 'on' : ''} />
      ))}
    </svg>
  );
}

export function ChoiceExplorer({ config, onComplete }) {
  const [active, setActive] = useState(null);
  const [viewed, setViewed] = useState([]);
  const opts = config.options;
  const allViewed = viewed.length === opts.length;

  function pick(i) {
    setActive(i);
    setViewed(list => (list.includes(i) ? list : [...list, i]));
    sound.play(opts[i].rating === 'risky' ? 'wrong' : 'correct');
  }

  useEffect(() => { if (allViewed) onComplete(); }, [allViewed, onComplete]);
  const o = active === null ? null : opts[active];

  return (
    <>
      <ActivityHint>{config.instructions}</ActivityHint>
      <div className="explorer">
        <div className="wifi-panel">
          <div className="wifi-panel-head"><Icon name="wifi" /> <strong>Wi-Fi</strong><span className="muted">Choose a network</span></div>
          <ul className="wifi-list">
            {opts.map((opt, i) => (
              <li key={opt.label}>
                <button type="button"
                  className={`wifi-item ${active === i ? 'is-active' : ''} ${viewed.includes(i) ? `is-viewed rate-${opt.rating}` : ''}`}
                  onClick={() => pick(i)}>
                  <SignalBars level={opt.signal} />
                  <span className="wifi-name"><strong>{opt.label}</strong><small>{opt.sub}</small></span>
                  <span className="wifi-lock" aria-label={opt.secured ? 'Secured' : 'Open'}>
                    {opt.secured ? <Icon name="lock" /> : <span className="open-tag">Open</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="explorer-feedback" aria-live="polite">
          {o ? (
            <>
              <span className={`chip chip-${o.rating}`}>{RATING_TEXT[o.rating]}</span>
              <h4>{o.label}</h4>
              <p>{o.feedback}</p>
            </>
          ) : (
            <p className="muted"><Icon name="arrowLeft" /> Select a network to see if it is a good idea.</p>
          )}
        </div>
      </div>
      <p className={`activity-status ${allViewed ? 'is-done' : ''}`}>
        {allViewed
          ? <><Icon name="check" /> You checked every network. Remember: mobile data or your own hotspot for anything sensitive!</>
          : `${viewed.length} / ${opts.length} networks checked`}
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
export function Triage({ config, onComplete }) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [choice, setChoice] = useState(null);   // 'scam' | 'legit' once answered
  const [finished, setFinished] = useState(false);
  const cards = config.cards;
  const card = cards[index];
  const last = index === cards.length - 1;

  function answer(value) {
    if (choice) return;
    setChoice(value);
    const right = value === card.answer;
    if (right) setCorrect(c => c + 1);
    sound.play(right ? 'correct' : 'wrong');
  }

  function next() {
    if (last) {
      setFinished(true);
      sound.play(correct >= cards.length - 1 ? 'win' : 'click');
      onComplete();
    } else {
      setIndex(i => i + 1);
      setChoice(null);
    }
  }

  function restart() {
    setIndex(0); setCorrect(0); setChoice(null); setFinished(false);
  }

  if (finished) {
    const great = correct >= cards.length - 1;
    return (
      <>
        <ActivityHint>{config.instructions}</ActivityHint>
        <div className="triage">
          <div className="triage-summary">
            <div className="triage-score">{correct}<span>/{cards.length}</span></div>
            <p>
              <strong>{great ? 'Sharp eyes! 🕵️' : 'Good practice! 💪'}</strong>{' '}
              {great ? 'You are ready for the quiz.' : 'Re-read the red flags above, then try again or move on to the quiz.'}
            </p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={restart}><Icon name="refresh" /> Play again</button>
          </div>
        </div>
      </>
    );
  }

  const right = choice === card.answer;
  return (
    <>
      <ActivityHint>{config.instructions}</ActivityHint>
      <div className="triage">
        <div className="triage-top"><span>Message {index + 1} of {cards.length}</span><span><Icon name="check" /> {correct} correct</span></div>
        <div className="triage-card" key={index}><Visual visual={card.visual} /></div>
        <div className="triage-actions">
          <button type="button" className={`btn btn-danger btn-lg ${choice && card.answer === 'scam' ? 'is-answer' : ''}`}
            disabled={!!choice} onClick={() => answer('scam')}>🚩 Scam</button>
          <button type="button" className={`btn btn-success btn-lg ${choice && card.answer === 'legit' ? 'is-answer' : ''}`}
            disabled={!!choice} onClick={() => answer('legit')}>✅ Legit</button>
        </div>
        {choice && (
          <div className={`triage-feedback feedback ${right ? 'good' : 'bad'}`} aria-live="polite">
            <p>
              <strong>{right ? 'Correct!' : 'Not quite.'}</strong> This one is{' '}
              <strong>{card.answer === 'scam' ? 'a scam' : 'legit'}</strong>. {card.why}
            </p>
            <button type="button" className="btn btn-primary btn-sm" onClick={next} autoFocus>
              {last ? 'See my score' : 'Next message'} <Icon name="arrowRight" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
