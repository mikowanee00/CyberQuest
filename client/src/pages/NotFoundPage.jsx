/* pages/NotFoundPage.jsx — shown for unknown URLs */
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function NotFoundPage() {
  return (
    <section className="container not-found">
      <p className="result-emoji" aria-hidden="true">🕳️</p>
      <h1>Page not found</h1>
      <p className="lead">This link leads nowhere — good thing you didn't enter a password! 😉</p>
      <Link className="btn btn-primary" to="/"><Icon name="arrowLeft" /> Back to home</Link>
    </section>
  );
}

