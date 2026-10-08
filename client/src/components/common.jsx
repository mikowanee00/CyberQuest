/* =====================================================================
 * components/common.jsx — Small shared UI pieces
 * ===================================================================== */
import { Navigate, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

/** Row of 0–3 stars. */
export function Stars({ count, size }) {
  return (
    <span className="stars" role="img" aria-label={`${count} of 3 stars`} style={size ? { '--star-size': `${size}px` } : undefined}>
      {[0, 1, 2].map(i => (
        <span key={i} className={`star ${i < count ? 'on' : ''}`}><Icon name="star" /></span>
      ))}
    </span>
  );
}

const STATUS = {
  completed: ['chip-success', 'Completed'],
  attempted: ['chip-warn', 'Try again'],
  started: ['chip-info', 'In progress'],
  new: ['chip-muted', 'Not started']
};

/** Colored label for a lesson's status. */
export function StatusChip({ status }) {
  const [cls, text] = STATUS[status] || STATUS.new;
  return <span className={`chip ${cls}`}>{text}</span>;
}

/** Thin bar showing a percentage (0–100). */
export function ProgressBar({ percent, large }) {
  return (
    <div className={`progress-bar ${large ? 'lg' : ''}`}>
      <span style={{ width: `${Math.max(0, Math.min(100, percent || 0))}%` }} />
    </div>
  );
}

export function Loading({ text = 'Loading…' }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden="true" /> {text}
    </div>
  );
}

/**
 * Pages that save progress need a player profile.
 * Without one, the visitor is sent to the Home page to create one.
 */
export function RequirePlayer({ children }) {
  const { player, loading } = usePlayer();
  const location = useLocation();
  if (loading) return <Loading text="Loading your progress…" />;
  if (!player) return <Navigate to="/" replace state={{ from: location.pathname, needPlayer: true }} />;
  return children;
}
