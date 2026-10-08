/* pages/HelpPage.jsx — How to play, scoring, shortcuts, glossary, privacy */
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { LEVELS } from '../data/lessons.js';
import { SCORING } from '../logic/scoring.js';

const GLOSSARY = [
  ['Phishing', 'Pretending to be a trusted person or organization to steal information or money.'],
  ['Smishing / Vishing', 'Phishing by text message (SMS) / by voice call.'],
  ['Spear phishing', 'A targeted phishing message that uses details about you to look believable.'],
  ['Social engineering', 'Manipulating people into breaking security rules.'],
  ['Malware', 'Malicious software such as viruses, ransomware or spyware.'],
  ['Two-factor authentication (2FA)', 'Logging in with two different types of proof, e.g. a password plus a phone code.'],
  ['Password manager', 'An app that creates, stores and fills in unique passwords for you.'],
  ['Evil twin', 'A fake Wi-Fi hotspot that imitates a real one.'],
  ['VPN', 'A Virtual Private Network that encrypts your internet traffic.'],
  ['PII', 'Personally identifiable information — data that can identify you.']
];

export default function HelpPage() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow"><Icon name="help" /> Help</p>
          <h1>How to Play</h1>
          <p className="lead">Everything you need to know to become a Cyber Detective.</p>
        </div>
      </section>
      <div className="container page-body help-grid">
        <div>
          <h2 className="section-heading">Getting started</h2>
          <ol className="steps-list">
            <li><strong>Pick a nickname</strong> on the <Link to="/">Home</Link> page, tick the box to save your progress and press <em>Start learning</em>.</li>
            <li><strong>Write down your player code.</strong> With your nickname it lets you continue on any device.</li>
            <li><strong>Open a lesson</strong> from the <Link to="/lessons">Lessons</Link> page. Any order works, but the numbered order is recommended.</li>
            <li><strong>Learn:</strong> read the short sections and the key takeaways.</li>
            <li><strong>Real examples:</strong> read true-to-life stories of how scams happen.</li>
            <li><strong>Practice:</strong> answer the Quick check questions, then try the hands-on activity (a green “Done” label appears).</li>
            <li><strong>Quiz:</strong> press <em>Start the quiz</em>, pick answers and read the instant feedback.</li>
            <li><strong>Results:</strong> see your score, stars, XP and badge. Review your answers, retry, or go to the next lesson.</li>
            <li><strong>Final challenge:</strong> Lesson 10 is a timed quiz with random questions from every lesson. Score 70%+ to unlock the grand finale.</li>
          </ol>

          <h2 className="section-heading">Scoring</h2>
          <div className="table-wrap card">
            <table>
              <tbody>
                <tr><th scope="row">Correct answer</th><td>+{SCORING.XP_PER_CORRECT} XP</td></tr>
                <tr><th scope="row">Passing a lesson (70%+)</th><td>+{SCORING.XP_COMPLETION_BONUS} XP and a badge</td></tr>
                <tr><th scope="row">Final challenge speed bonus</th><td>up to +5 XP per question</td></tr>
                <tr><th scope="row">Stars</th><td>★ 70%+ · ★★ 80%+ · ★★★ 100%</td></tr>
                <tr><th scope="row">Replays</th><td>Only your best score counts, so feel free to retry!</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="section-heading">Ranks</h2>
          <ul className="rank-list">
            {LEVELS.map(l => <li key={l.name}><strong>{l.name}</strong><span>{l.min}+ XP</span></li>)}
          </ul>
        </div>

        <div>
          <h2 className="section-heading">Keyboard shortcuts</h2>
          <div className="card">
            <ul className="kbd-list">
              <li><kbd>Tab</kbd> move between buttons and links</li>
              <li><kbd>Enter</kbd> / <kbd>Space</kbd> press the focused button</li>
              <li><kbd>A</kbd>–<kbd>D</kbd> or <kbd>1</kbd>–<kbd>4</kbd> answer a quiz question</li>
              <li><kbd>Enter</kbd> go to the next question</li>
            </ul>
          </div>

          <h2 className="section-heading">Glossary</h2>
          <dl className="glossary card">
            {GLOSSARY.map(([term, def]) => <div key={term}><dt>{term}</dt><dd>{def}</dd></div>)}
          </dl>

          <h2 className="section-heading">Privacy</h2>
          <div className="card">
            <p>
              CyberQuest stores only your <strong>nickname</strong> and your <strong>lesson and quiz results</strong> — no email, real name or
              password. Your player code is stored only as a secure hash. You can download or delete your data at any time
              from <Link to="/progress">My Progress</Link>. The password lab never saves or sends what you type.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
