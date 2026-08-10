const { createClient } = require('@libsql/client/web');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const url = process.env.TURSO_DATABASE_URL;
if (!url) throw new Error("TURSO_DATABASE_URL is missing!");

const libsql = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  try {
    console.log("Adding heroImage column to Slide table...");
    await libsql.execute("ALTER TABLE Slide ADD COLUMN heroImage TEXT;");
    console.log("Successfully added heroImage column!");
  } catch (error) {
    console.error("Failed to add column. Maybe it already exists?", error.message);
  }
}

main();
