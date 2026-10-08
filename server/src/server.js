/* =====================================================================
 * server.js — Entry point
 * ---------------------------------------------------------------------
 * 1. Loads settings from server/.env
 * 2. Connects to MongoDB
 * 3. Starts the Express app (built in app.js)
 * ===================================================================== */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('./config/db');
const createApp = require('./app');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`CyberQuest API running on http://localhost:${PORT}`);
      if (!process.env.ADMIN_KEY) console.warn('Warning: ADMIN_KEY is not set — the admin dashboard is disabled.');
    });
  } catch (err) {
    console.error('Could not start the server:', err.message);
    process.exit(1);
  }
}

start();
