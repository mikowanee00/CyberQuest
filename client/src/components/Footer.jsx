/* components/Footer.jsx — site footer with secondary links */
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>CyberQuest</strong> — learn to spot online scams before they spot you.
          <p className="footer-note">
            The companies, people, phone numbers and messages in the lessons are made-up examples.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <Link to="/lessons">Lessons</Link>
          <Link to="/lesson/10">Final Challenge</Link>
          <Link to="/progress">My Progress</Link>
          <Link to="/help">How to Play</Link>
        </nav>
      </div>
    </footer>
  );
}
