const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const createVisitor = `CREATE TABLE IF NOT EXISTS "Visitor" (
    id TEXT PRIMARY KEY,
    visitorId TEXT NOT NULL UNIQUE,
    fcmToken TEXT,
    device TEXT,
    browser TEXT,
    os TEXT,
    ip TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;

  try {
    await libsql.execute(createVisitor);
    console.log('OK: CREATE TABLE Visitor');
  } catch(e) {
    console.error('ERROR creating Visitor table:', e.message);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
