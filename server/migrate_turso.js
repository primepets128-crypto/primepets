const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    console.log('Creating ShippingSetting table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "ShippingSetting" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "provider" TEXT NOT NULL DEFAULT 'DTDC',
          "username" TEXT,
          "password" TEXT,
          "apiKey" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT 1,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "ShippingSetting_provider_key" ON "ShippingSetting"("provider");
    `);

    console.log('Successfully created table and index.');
  } catch (e) {
    console.error('Error:', e);
  }
}

run();
