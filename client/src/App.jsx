/* =====================================================================
 * App.jsx — Page layout and routes
 * ===================================================================== */
import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { RequirePlayer } from './components/common.jsx';
import { confetti } from './logic/effects.js';
import HomePage from './pages/HomePage.jsx';
import LessonsPage from './pages/LessonsPage.jsx';
import LessonPage from './pages/LessonPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  const location = useLocation();
  const mainRef = useRef(null);

  // On every page change: scroll to the top and move keyboard focus to the content.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!location.pathname.startsWith('/quiz')) mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lesson/:id" element={<RequirePlayer><LessonPage /></RequirePlayer>} />
          <Route path="/quiz/:id" element={<RequirePlayer><QuizPage /></RequirePlayer>} />
          <Route path="/progress" element={<RequirePlayer><ProgressPage /></RequirePlayer>} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <canvas className="confetti" aria-hidden="true" ref={el => confetti.attach(el)} />
    </>
  );
}
