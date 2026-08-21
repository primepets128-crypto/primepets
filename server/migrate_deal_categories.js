const { createClient } = require('@libsql/client');
require('dotenv').config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function migrate() {
  try {
    console.log('Creating DealCategory table...');
    await db.execute(`CREATE TABLE IF NOT EXISTS "DealCategory" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "label" TEXT NOT NULL DEFAULT '',
      "off" TEXT NOT NULL DEFAULT '',
      "img" TEXT NOT NULL DEFAULT '',
      "grad" TEXT NOT NULL DEFAULT '',
      "bg" TEXT NOT NULL DEFAULT '',
      "border" TEXT NOT NULL DEFAULT '',
      "flash" INTEGER NOT NULL DEFAULT 0
    )`);
    console.log('✅ DealCategory table created successfully!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    db.close();
  }
}

migrate();
