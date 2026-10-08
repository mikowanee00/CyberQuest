/* =====================================================================
 * context/ToastContext.jsx — Short pop-up messages ("toasts")
 * Usage:  const toast = useToast();  toast('Saved!', 'success');
 * ===================================================================== */
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(() => {});
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /** type: 'info' | 'success' | 'error' | 'badge' */
  const toast = useCallback((message, type = 'info') => {
    const id = nextId++;
    setToasts(list => [...list, { id, message, type, hiding: false }]);
    setTimeout(() => setToasts(list => list.map(t => (t.id === id ? { ...t, hiding: true } : t))), 3200);
    setTimeout(() => setToasts(list => list.filter(t => t.id !== id)), 3700);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-region" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type} ${t.hiding ? 'toast-hide' : ''}`}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
