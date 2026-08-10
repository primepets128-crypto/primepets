const { createClient } = require('@libsql/client');
require('dotenv').config();

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("Dropping and recreating Banner table in Turso...");
  
  await libsql.execute(`DROP TABLE IF EXISTS "Banner";`);

  await libsql.execute(`
    CREATE TABLE "Banner" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "mediaUrl" TEXT NOT NULL,
      "link" TEXT
    );
  `);

  console.log("Table created.");

  const banners = await libsql.execute('SELECT count(*) as count FROM Banner');
  if (banners.rows[0].count === 0) {
    console.log("Seeding Banners...");
    // Just a placeholder image
    await libsql.execute(`INSERT INTO "Banner" (mediaUrl, link) VALUES 
      ('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200', '/category')
    `);
  }

  console.log("Done.");
}

main().catch(console.error);
