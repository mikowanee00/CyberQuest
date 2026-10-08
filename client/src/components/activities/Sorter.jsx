/* =====================================================================
 * components/activities/Sorter.jsx — Sort items into groups (Lessons 7, 9)
 * ---------------------------------------------------------------------
 * Works two ways:
 *   • click an item, then click a group  (touch & keyboard friendly)
 *   • drag and drop on a computer
 * Wrong placements shake and give a hint; right ones explain why.
 * ===================================================================== */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';
import { ActivityHint } from './SimpleActivities.jsx';
import { shuffle } from '../../logic/QuizEngine.js';
import { sound } from '../../logic/effects.js';

export default function Sorter({ config, onComplete }) {
  // Random item order, decided once when the activity appears.
  const [order] = useState(() => shuffle(config.items.map((_, i) => i)));
  const [placed, setPlaced] = useState({});        // item index → bucket id
  const [selected, setSelected] = useState(null);  // item index or null
  const [feedback, setFeedback] = useState(null);  // { tone, content }
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(null);
  const [overBucket, setOverBucket] = useState(null);

  const remaining = order.filter(i => placed[i] === undefined);
  const done = remaining.length === 0;
  useEffect(() => { if (done) onComplete(); }, [done, onComplete]);

  /** Checks whether item `idx` belongs in `bucketId`. */
  function place(idx, bucketId) {
    const item = config.items[idx];
    const bucket = config.buckets.find(b => b.id === bucketId);
    if (item.bucket === bucketId) {
      setPlaced(p => ({ ...p, [idx]: bucketId }));
      setFeedback({ tone: 'good', content: <><strong>Correct!</strong> {item.why}</> });
      sound.play('correct');
    } else {
      setMistakes(m => m + 1);
      setShake(idx);
      const groupName = bucket.label.replace(/^\S+\s/, ''); // drop the leading emoji
      setFeedback({ tone: 'bad', content: <><strong>Not quite.</strong> “{item.label}” doesn't belong in “{groupName}”. Try another group.</> });
      sound.play('wrong');
    }
    setSelected(null);
  }

  function clickBucket(bucketId) {
    if (selected === null) setFeedback({ tone: 'info', content: 'Select an item first, then choose a group.' });
    else place(selected, bucketId);
  }

  return (
    <>
      <ActivityHint>{config.instructions}</ActivityHint>
      <div className={`sorter ${selected !== null ? 'has-selection' : ''}`}>
        <div className="sort-pool" aria-label="Items to sort">
          {done ? (
            <p className="activity-status is-done">
              <Icon name="check" /> All sorted{mistakes === 0 ? ' with zero mistakes — perfect!' : ` (${mistakes} ${mistakes === 1 ? 'retry' : 'retries'}).`}
            </p>
          ) : remaining.map(idx => (
            <button key={idx} type="button" draggable
              className={`sort-item ${selected === idx ? 'is-selected' : ''} ${shake === idx ? 'shake' : ''}`}
              aria-pressed={selected === idx}
              onAnimationEnd={() => setShake(null)}
              onClick={() => setSelected(s => (s === idx ? null : idx))}
              onDragStart={e => { e.dataTransfer.setData('text/plain', String(idx)); setSelected(idx); }}>
              {config.items[idx].label}
            </button>
          ))}
        </div>

        <div className="sort-buckets" style={{ '--cols': config.buckets.length }}>
          {config.buckets.map(b => (
            <div key={b.id} className={`bucket ${overBucket === b.id ? 'is-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setOverBucket(b.id); }}
              onDragLeave={() => setOverBucket(null)}
              onDrop={e => { e.preventDefault(); setOverBucket(null); place(Number(e.dataTransfer.getData('text/plain')), b.id); }}>
              <button type="button" className="bucket-head" onClick={() => clickBucket(b.id)}>
                {b.label}<span className="bucket-cta">Place here</span>
              </button>
              <ul className="bucket-items">
                {order.filter(i => placed[i] === b.id).map(i => (
                  <li key={i}><Icon name="check" /> {config.items[i].label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {feedback && <p className={`sort-feedback is-${feedback.tone}`} aria-live="polite">{feedback.content}</p>}
      </div>
    </>
  );
}
