/* =====================================================================
 * components/Visual.jsx — Realistic mock emails, texts, pop-ups, etc.
 * Used by the quizzes and the "Scam or Legit?" activity.
 * Content comes from data/lessons.js (trusted, written by us).
 * ===================================================================== */
import { useState } from 'react';
import Icon from './Icon.jsx';

/**
 * Wraps content that contains fake links (elements with data-href).
 * Hovering or focusing a link shows its real address in a status bar —
 * the "hover before you click" skill from Lesson 2.
 */
export function LinkPreview({ className, children }) {
  const [href, setHref] = useState('');
  const show = e => {
    const link = e.target.closest && e.target.closest('[data-href]');
    setHref(link ? link.dataset.href : '');
  };
  return (
    <div className={`${className} has-status`} onMouseOver={show} onFocus={show} onMouseLeave={() => setHref('')} onBlur={() => setHref('')}>
      {children}
      <div className={`status-bar ${href ? 'show' : ''}`} aria-hidden="true">{href}</div>
    </div>
  );
}

export default function Visual({ visual: v }) {
  if (!v) return null;

  switch (v.type) {
    case 'email':
      return (
        <LinkPreview className="v-email">
          <div className="mock-toolbar"><span className="dot" /><span className="dot" /><span className="dot" /><span className="mock-app">Inbox</span></div>
          <div className="v-email-head">
            <div className="v-subject">{v.subject}</div>
            <div className="v-from">
              <span className="avatar" aria-hidden="true">{v.fromName.charAt(0)}</span>
              <div>
                <strong>{v.fromName}</strong> <span className="v-addr">&lt;{v.fromAddr}&gt;</span>
                <div className="v-to">to me</div>
              </div>
            </div>
          </div>
          <div className="v-email-body" dangerouslySetInnerHTML={{ __html: v.body }} />
          {v.attachment && <div className="mock-attach">📎 {v.attachment}</div>}
        </LinkPreview>
      );

    case 'sms':
      return (
        <div className="v-phone">
          <div className="v-phone-top">
            <span className="avatar avatar-sm" aria-hidden="true"><Icon name="message" /></span>
            <div><strong>{v.sender}</strong><small>{v.number || 'Text message'}</small></div>
          </div>
          <div className="v-phone-body">
            <div className="bubble bubble-them">{v.text}</div>
            <small className="v-time">Today 9:41 AM</small>
          </div>
        </div>
      );

    case 'popup':
      return (
        <div className="v-popup">
          <div className="v-popup-bar"><span>{v.title}</span><span aria-hidden="true">✕</span></div>
          <div className="v-popup-body">
            <div className="v-popup-icon" aria-hidden="true">⚠</div>
            <p>{v.text}</p>
            {v.cta && <span className="v-popup-btn">{v.cta}</span>}
          </div>
        </div>
      );

    case 'notification':
      return (
        <div className="v-notif">
          <span className="v-notif-icon" aria-hidden="true">{v.app.charAt(0)}</span>
          <div>
            <div className="v-notif-top"><strong>{v.app}</strong><small>now</small></div>
            <p>{v.text}</p>
          </div>
        </div>
      );

    case 'listing':
      return (
        <div className="v-listing">
          <div className="v-listing-img" aria-hidden="true">🏠</div>
          <div className="v-listing-info">
            <strong>{v.title}</strong>
            <div className="v-price">{v.price}</div>
            <p>{v.text}</p>
            <small>{v.seller}</small>
          </div>
        </div>
      );

    default:
      return null;
  }
}
