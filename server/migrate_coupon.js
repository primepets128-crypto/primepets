const { createClient } = require('@libsql/client');
require('dotenv').config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function migrate() {
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS "Coupon" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "title" TEXT NOT NULL DEFAULT '',
      "sub" TEXT NOT NULL DEFAULT '',
      "code" TEXT NOT NULL DEFAULT '',
      "expiry" TEXT NOT NULL DEFAULT 'Ongoing',
      "emoji" TEXT NOT NULL DEFAULT '🐾',
      "grad" TEXT NOT NULL DEFAULT 'from-[#d07e20] to-[#a65d14]',
      "isActive" INTEGER NOT NULL DEFAULT 1
    )`);
    console.log('✅ Coupon table created successfully!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    db.close();
  }
}

migrate();
