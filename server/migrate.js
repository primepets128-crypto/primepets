const fs = require('fs');
const { createClient } = require('@libsql/client');
require('dotenv').config();

async function migrate() {
  const sql = fs.readFileSync('migration.sql', 'utf8');
  
  // Create Turso client
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  // Split by statements and execute
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Executing ${statements.length} statements...`);
  
  for (const stmt of statements) {
    console.log(`Executing: ${stmt.substring(0, 50)}...`);
    try {
      await client.execute(stmt);
    } catch (e) {
      console.error('Error executing statement:', stmt);
      console.error(e.message);
    }
  }
  
  console.log('Migration complete!');
}

migrate();
