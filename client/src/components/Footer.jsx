/* components/Footer.jsx — site footer with secondary links */
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>CyberQuest</strong> — a cybersecurity awareness game.
          <p className="footer-note">
            Educational project. All companies, people, phone numbers and messages shown in the lessons are fictional examples.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <Link to="/lessons">Lessons</Link>
          <Link to="/lesson/10">Final Challenge</Link>
          <Link to="/progress">My Progress</Link>
          <Link to="/help">How to Play</Link>
          <Link to="/admin">Admin dashboard</Link>
        </nav>
      </div>
    </footer>
  );
}
