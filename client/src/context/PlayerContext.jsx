/* =====================================================================
 * context/PlayerContext.jsx — The logged-in player, shared app-wide
 * ---------------------------------------------------------------------
 * Holds the "summary" returned by the server (profile + lesson records
 * + history + totals) and exposes actions that call the API and then
 * update the summary. Any component can read it with usePlayer().
 * ===================================================================== */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, loadSession, saveSession, clearSession } from '../api/client.js';
import { statusFor, starsFor } from '../logic/scoring.js';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [session, setSession] = useState(loadSession);   // { userId, playerCode } or null
  const [summary, setSummary] = useState(null);           // data from GET /api/me
  const [loading, setLoading] = useState(() => !!loadSession());
  const [error, setError] = useState('');

  // Load the player's data whenever the session changes (e.g. on page load).
  useEffect(() => {
    let cancelled = false;
    if (!session) {
      setSummary(null);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    api.me()
      .then(data => { if (!cancelled) { setSummary(data); setError(''); } })
      .catch(err => {
        if (cancelled) return;
        if (err.status === 401) { clearSession(); setSession(null); } // stale session
        else setError(err.message);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [session]);

  /** Stores the session and the summary after register/login. */
  const startSession = useCallback((userId, playerCode, data) => {
    const s = { userId, playerCode };
    saveSession(s);
    setSummary(data);
    setSession(s);
  }, []);

  const register = useCallback(async (nickname, consent) => {
    const data = await api.register(nickname, consent);
    startSession(data.summary.user._id, data.playerCode, data.summary);
    return data;
  }, [startSession]);

  const login = useCallback(async (nickname, playerCode) => {
    const data = await api.login(nickname, playerCode);
    startSession(data.summary.user._id, playerCode, data.summary);
    return data;
  }, [startSession]);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setSummary(null);
  }, []);

  /** Lesson opened — saved in the background, updated locally right away. */
  const markVisited = useCallback(lessonId => {
    setSummary(prev => {
      if (!prev || prev.lessons[lessonId]?.visited) return prev;
      const lessons = { ...prev.lessons, [lessonId]: { ...(prev.lessons[lessonId] || { attempts: 0 }), visited: true } };
      return { ...prev, lessons };
    });
    api.visitLesson(lessonId).catch(() => { /* not critical */ });
  }, []);

  const completeActivity = useCallback(async lessonId => {
    const data = await api.completeActivity(lessonId);
    setSummary(data.summary);
  }, []);

  /** Sends a finished quiz; returns { newBadge, improved, xpGained, ... }. */
  const submitQuiz = useCallback(async (lessonId, result) => {
    const data = await api.submitQuiz(lessonId, result);
    setSummary(data.summary);
    return data.outcome;
  }, []);

  const rename = useCallback(async nickname => setSummary(await api.rename(nickname)), []);
  const resetProgress = useCallback(async () => setSummary(await api.resetProgress()), []);
  const deleteAccount = useCallback(async () => { await api.deleteAccount(); logout(); }, [logout]);

  const value = useMemo(() => {
    const lessons = summary?.lessons || {};
    return {
      session,
      player: summary?.user || null,
      lessons,
      history: summary?.history || [],
      stats: summary?.stats || { totalXP: 0, completedCount: 0, badges: 0, quizzesTaken: 0, level: null },
      loading,
      error,
      status: id => statusFor(lessons[id]),
      stars: id => starsFor(lessons[id]),
      register, login, logout, markVisited, completeActivity, submitQuiz, rename, resetProgress, deleteAccount
    };
  }, [session, summary, loading, error, register, login, logout, markVisited, completeActivity, submitQuiz, rename, resetProgress, deleteAccount]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
