/* =====================================================================
 * components/activities/ChatScenario.jsx — Branching chat (Lesson 4)
 * ---------------------------------------------------------------------
 * A tiny state machine: each node in data/lessons.js has incoming
 * messages and either reply choices or an ending (win / lose).
 * ===================================================================== */
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';
import { ActivityHint } from './SimpleActivities.jsx';
import { sound, prefersReducedMotion } from '../../logic/effects.js';

const wait = ms => new Promise(resolve => setTimeout(resolve, prefersReducedMotion() ? 0 : ms));
const NOTE_ICON = { good: '✅', bad: '⚠️', neutral: '💭' };

export default function ChatScenario({ config, onComplete }) {
  const [log, setLog] = useState([]);          // [{ who: 'them'|'me'|'note', text, tone }]
  const [typing, setTyping] = useState(false);
  const [node, setNode] = useState(null);      // node waiting for a reply, or an ending
  const runRef = useRef(0);                    // changes on restart/unmount to cancel old timers
  const logRef = useRef(null);
  // Keep the latest onComplete in a ref so a new function from the parent
  // does not restart the conversation.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  /** Plays a node's messages one by one, then shows its choices or ending. */
  const goTo = useCallback(async (nodeId, run) => {
    const next = config.nodes[nodeId];
    setNode(null);
    for (const text of next.messages || []) {
      setTyping(true);
      await wait(700 + Math.min(text.length * 12, 900));
      if (run !== runRef.current) return; // restarted or left the page
      setTyping(false);
      setLog(list => [...list, { who: 'them', text }]);
    }
    setNode(next);
    if (next.end) {
      sound.play(next.end === 'win' ? 'win' : 'wrong');
      onCompleteRef.current();
    }
  }, [config.nodes]);

  const restart = useCallback(() => {
    runRef.current += 1;
    setLog([]);
    setTyping(false);
    goTo(config.start, runRef.current);
  }, [config.start, goTo]);

  // Start on mount; cancel pending messages on unmount.
  useEffect(() => {
    restart();
    return () => { runRef.current += 1; };
  }, [restart]);

  // Keep the newest message in view.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log, typing]);

  function reply(choice) {
    setLog(list => [
      ...list,
      { who: 'me', text: choice.text },
      ...(choice.note ? [{ who: 'note', tone: choice.tone, text: `${NOTE_ICON[choice.tone]} ${choice.note}` }] : [])
    ]);
    sound.play(choice.tone === 'bad' ? 'wrong' : 'click');
    goTo(choice.next, runRef.current);
  }

  return (
    <>
      <ActivityHint>{config.instructions}</ActivityHint>
      <div className="chat">
        <div className="chat-header">
          <span className="avatar avatar-pink" aria-hidden="true">{config.contact.name.charAt(0)}</span>
          <div><strong>{config.contact.name}</strong><small>{config.contact.subtitle}</small></div>
        </div>

        <div className="chat-log" role="log" aria-live="polite" ref={logRef}>
          {log.map((m, i) => (
            <div key={i} className={`bubble bubble-${m.who} ${m.who === 'note' ? `note-${m.tone}` : ''}`}>{m.text}</div>
          ))}
          {typing && <div className="bubble bubble-them typing" aria-label="typing"><span /><span /><span /></div>}
        </div>

        {node && !node.end && (
          <div className="chat-choices">
            <p className="chat-prompt">How do you reply?</p>
            {node.choices.map(ch => (
              <button key={ch.text} type="button" className="chat-choice" onClick={() => reply(ch)}>{ch.text}</button>
            ))}
          </div>
        )}

        {node && node.end && (
          <div className="chat-choices">
            <div className={`chat-ending ${node.end === 'win' ? 'is-win' : 'is-lose'}`}>
              <strong>{node.end === 'win' ? '🎉' : '😬'} {node.title}</strong>
              <p>{node.text}</p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={restart}>
                <Icon name="refresh" /> {node.end === 'win' ? 'Try another path' : 'Try again'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
