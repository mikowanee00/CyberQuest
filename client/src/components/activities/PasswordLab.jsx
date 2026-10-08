/* =====================================================================
 * components/activities/PasswordLab.jsx — Live password meter (Lesson 3)
 * Nothing typed here is saved or sent to the server.
 * ===================================================================== */
import { useEffect, useMemo, useState } from 'react';
import Icon from '../Icon.jsx';
import { ActivityHint } from './SimpleActivities.jsx';
import { analyzePassword, generatePassphrase } from '../../logic/passwordAnalyzer.js';
import { sound } from '../../logic/effects.js';

const CHECK_LABELS = [
  ['length', 'At least 14 characters'],
  ['lower', 'Lowercase letters'],
  ['upper', 'Uppercase letters'],
  ['digit', 'Numbers'],
  ['symbol', 'Symbols, dashes or spaces'],
  ['pattern', 'No common password or pattern']
];

export default function PasswordLab({ config, onComplete }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [phrase, setPhrase] = useState('');
  const result = useMemo(() => analyzePassword(password), [password]);

  // Reaching "Strong" completes the activity.
  useEffect(() => {
    if (password && result.score >= 3) {
      sound.play('correct');
      onComplete();
    }
  }, [password, result.score, onComplete]);

  function generate() {
    setPhrase(generatePassphrase(4));
    sound.play('click');
  }

  function testPhrase() {
    setPassword(phrase);
    setShow(true);
  }

  return (
    <>
      <ActivityHint>{config.instructions}</ActivityHint>
      <div className="pw-lab">
        <label className="field-label" htmlFor="pw-input">
          Practice password <span className="muted">(never type a real one — nothing here is saved or sent)</span>
        </label>
        <div className="pw-field">
          <input id="pw-input" type={show ? 'text' : 'password'} autoComplete="off" autoCapitalize="off" spellCheck="false"
            maxLength={64} placeholder="Type a password to test…" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="button" className="btn btn-ghost btn-sm" aria-pressed={show} onClick={() => setShow(s => !s)}>
            <Icon name="eye" /> {show ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="pw-meter" data-level={password ? result.score : -1} aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className="pw-verdict" aria-live="polite">
          <strong>{password ? result.label : 'Start typing…'}</strong>{' '}
          {password && <span className="pw-time">· Time to crack: {result.crackTime}</span>}
        </div>

        <div className="pw-grid">
          <ul className="pw-checks" aria-label="Password checklist">
            {CHECK_LABELS.map(([key, label]) => (
              <li key={key} className={password && result.checks[key] ? 'ok' : ''}>{label}</li>
            ))}
          </ul>
          <ul className="pw-warnings" aria-live="polite">
            {result.warnings.map(w => <li key={w}><Icon name="alert" /> <span>{w}</span></li>)}
          </ul>
        </div>

        <div className="pw-gen">
          <div><strong>Need inspiration?</strong> Generate a random 4-word passphrase.</div>
          <div className="pw-gen-row">
            <code className="pw-phrase">{phrase || '—'}</code>
            <button type="button" className="btn btn-secondary btn-sm" onClick={generate}><Icon name="refresh" /> Generate</button>
            <button type="button" className="btn btn-ghost btn-sm" disabled={!phrase} onClick={testPhrase}>Test it</button>
          </div>
        </div>
      </div>
    </>
  );
}
