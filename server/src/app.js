/* =====================================================================
 * app.js — Builds the Express application
 * ---------------------------------------------------------------------
 * Kept separate from server.js so the automated tests can create the
 * app without opening a network port.
 *
 *   /api/users   → registration & login         (userRoutes)
 *   /api/me      → the logged-in player's data  (meRoutes)
 *   /api/admin   → dashboard & CSV exports      (adminRoutes)
 *
 * In production (after `npm run build`), it also serves the React app.
 * ===================================================================== */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const meRoutes = require('./routes/meRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();
  app.disable('x-powered-by');

  // Allow a separately hosted client (only when CLIENT_ORIGIN is set).
  if (process.env.CLIENT_ORIGIN) {
    app.use(cors({ origin: process.env.CLIENT_ORIGIN.split(',').map(s => s.trim()) }));
  }

  // Parse JSON request bodies (with a size limit to block huge payloads).
  app.use(express.json({ limit: '200kb' }));

  // Simple health check — handy to test that the server is running.
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  // API routes
  app.use('/api/users', userRoutes);
  app.use('/api/me', meRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', notFound);

  // Serve the built React app (client/dist) if it exists.
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // Any other URL returns index.html so React Router can handle it.
    app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  app.use(errorHandler);
  return app;
}

module.exports = createApp;
