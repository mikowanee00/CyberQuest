/* =====================================================================
 * components/activities/HotspotHunt.jsx — Find the red flags (Lessons 2, 5)
 * ---------------------------------------------------------------------
 * The mock email / social post comes from data/lessons.js as HTML.
 * Every element with data-hs="key" is a red flag. Several elements can
 * share one key (they count as one red flag).
 * ===================================================================== */
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../Icon.jsx';
import { ActivityHint } from './SimpleActivities.jsx';
import { ProgressBar } from '../common.jsx';
import { sound } from '../../logic/effects.js';

export default function HotspotHunt({ config, onComplete }) {
  const stageRef = useRef(null);
  const [found, setFound] = useState([]);       // keys in the order they were found
  const [revealed, setRevealed] = useState(false);
  const [flash, setFlash] = useState(null);
  const keys = Object.keys(config.spots);
  const total = keys.length;
  const html = useMemo(() => ({ __html: config.html }), [config.html]);

  function find(key) {
    if (!config.spots[key]) return;
    if (found.includes(key)) {
      setFlash(key); // already found: briefly highlight its explanation
      return;
    }
    sound.play('correct');
    setFound([...found, key]);
  }

  // Make every red-flag element keyboard-accessible (once, after mount).
  useEffect(() => {
    const stage = stageRef.current;
    stage.querySelectorAll('[data-hs]').forEach(node => {
      node.classList.add('hs');
      node.tabIndex = 0;
      node.setAttribute('role', 'button');
    });
  }, [html]);

  // Highlight found red flags inside the mock HTML.
  useEffect(() => {
    found.forEach(key => stageRef.current
      .querySelectorAll(`[data-hs="${key}"]`)
      .forEach(n => n.classList.add('hs-found')));
    if (found.length === total) onComplete();
  }, [found, total, onComplete]);

  /* Event delegation: one handler on the stage instead of one per element. */
  const onClick = e => {
    const node = e.target.closest('[data-hs]');
    if (node) find(node.dataset.hs);
  };
  const onKeyDown = e => {
    const node = e.target.closest('[data-hs]');
    if (node && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); find(node.dataset.hs); }
  };
  // Show a link's real destination in the mock email's status bar.
  const setStatus = (e, on) => {
    const link = e.target.closest('[data-href]');
    const bar = stageRef.current.querySelector('.status-bar');
    if (!link || !bar) return;
    bar.textContent = on ? link.dataset.href : '';
    bar.classList.toggle('show', on);
  };

  function revealAll() {
    setRevealed(true);
    setFound(list => [...list, ...keys.filter(k => !list.includes(k))]);
  }

  const done = found.length === total;
  return (
    <>
      <ActivityHint>{config.instructions}</ActivityHint>
      <div className="hunt">
        <div className="hunt-stage" ref={stageRef} onClick={onClick} onKeyDown={onKeyDown}
          onMouseOver={e => setStatus(e, true)} onMouseOut={e => setStatus(e, false)}
          onFocus={e => setStatus(e, true)} onBlur={e => setStatus(e, false)}
          dangerouslySetInnerHTML={html} />
        <aside className="hunt-side" aria-label="Red flags found">
          <div className="hunt-counter"><span className="hunt-count">{found.length}</span> / {total} <span>red flags found</span></div>
          <ProgressBar percent={(found.length / total) * 100} />
          <ol className="hunt-list" aria-live="polite">
            {found.map(key => (
              <li key={key} className={flash === key ? 'flash' : ''} onAnimationEnd={() => setFlash(null)}>
                <strong>{config.spots[key].label}</strong><span>{config.spots[key].why}</span>
              </li>
            ))}
          </ol>
          {found.length === 0 && <p className="hunt-empty muted">Click anything that looks suspicious…</p>}
          {done ? (
            <p className="activity-status is-done"><Icon name="check" /> {revealed ? 'All red flags revealed.' : 'Amazing — you found every red flag!'}</p>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={revealAll}><Icon name="eye" /> Show me the answers</button>
          )}
        </aside>
      </div>
    </>
  );
}
