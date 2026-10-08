/* =====================================================================
 * scripts/memoryServer.js — Try the app WITHOUT installing MongoDB
 * ---------------------------------------------------------------------
 *   npm run dev:memory   (from the server folder)
 *
 * Starts a temporary in-memory MongoDB, then the normal server.
 * The first run downloads a MongoDB binary (~100 MB).
 * ALL DATA IS LOST when you stop the server — use a real MongoDB
 * (local or Atlas) for your actual user testing.
 * ===================================================================== */
const { MongoMemoryServer } = require('mongodb-memory-server-core');

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri('cyberquest');
  if (!process.env.ADMIN_KEY) process.env.ADMIN_KEY = 'demo-admin-key';
  console.log('Using a TEMPORARY in-memory database (data is lost when you stop).');
  console.log(`Admin key for this session: ${process.env.ADMIN_KEY}`);
  require('../src/server');
})();
