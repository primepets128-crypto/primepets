const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function migrate() {
  try {
    console.log('Adding columns to FrontendSetting table...');
    // In SQLite/libSQL, we add columns one by one
    try {
      await db.execute('ALTER TABLE "FrontendSetting" ADD COLUMN "facebookPixelId" TEXT;');
      console.log('Added facebookPixelId to FrontendSetting.');
    } catch (e) {
      console.log('facebookPixelId might already exist:', e.message);
    }
    
    try {
      await db.execute('ALTER TABLE "FrontendSetting" ADD COLUMN "facebookAccessToken" TEXT;');
      console.log('Added facebookAccessToken to FrontendSetting.');
    } catch (e) {
      console.log('facebookAccessToken might already exist:', e.message);
    }

    try {
      await db.execute('ALTER TABLE "FrontendSetting" ADD COLUMN "facebookConversionsUrl" TEXT;');
      console.log('Added facebookConversionsUrl to FrontendSetting.');
    } catch (e) {
      console.log('facebookConversionsUrl might already exist:', e.message);
    }

    console.log('Creating FacebookEvent table...');
    await db.execute(`CREATE TABLE IF NOT EXISTS "FacebookEvent" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "eventName" TEXT NOT NULL,
      "eventData" TEXT,
      "userEmail" TEXT,
      "visitorId" TEXT,
      "ip" TEXT,
      "userAgent" TEXT,
      "url" TEXT,
      "eventId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // In case table already exists but eventId is missing (incremental update)
    try {
      await db.execute('ALTER TABLE "FacebookEvent" ADD COLUMN "eventId" TEXT;');
      console.log('Added eventId to FacebookEvent table.');
    } catch (e) {
      // Ignore if column already exists
    }
    console.log('✅ FacebookEvent table created/updated successfully!');
  } catch (e) {
    console.error('Error during migration:', e.message);
  } finally {
    db.close();
  }
}

migrate();
