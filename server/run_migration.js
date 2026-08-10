const { createClient } = require('@libsql/client');
require('dotenv').config();

async function migrate() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const stmt = 'ALTER TABLE "Product" ADD COLUMN "images" TEXT;';
  
  console.log(`Executing: ${stmt}`);
  try {
    await client.execute(stmt);
    console.log('Migration complete!');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
        console.log('Column already exists, ignoring.');
    } else {
        console.error('Error executing statement:', stmt);
        console.error(e.message);
    }
  }
}

migrate();
