/* =====================================================================
 * main.jsx — React entry point
 * Wraps the app in the router and the shared "context" providers:
 *   ToastProvider  → pop-up messages
 *   PlayerProvider → the logged-in player and their progress (from the API)
 * ===================================================================== */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
