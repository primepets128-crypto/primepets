const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const createSiteVisit = `CREATE TABLE IF NOT EXISTS "SiteVisit" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitorId TEXT NOT NULL,
    page TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;

  const createActivityLog = `CREATE TABLE IF NOT EXISTS "ActivityLog" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip TEXT,
    userAgent TEXT
  )`;

  try {
    await libsql.execute(createSiteVisit);
    console.log('OK: CREATE TABLE SiteVisit');
  } catch(e) {
    console.error('ERROR creating SiteVisit table:', e.message);
  }

  try {
    await libsql.execute(createActivityLog);
    console.log('OK: CREATE TABLE ActivityLog');
  } catch(e) {
    console.error('ERROR creating ActivityLog table:', e.message);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
