const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    console.log('Altering ShippingSetting table...');
    const commands = [
      `ALTER TABLE "ShippingSetting" ADD COLUMN "senderName" TEXT;`,
      `ALTER TABLE "ShippingSetting" ADD COLUMN "senderPhone" TEXT;`,
      `ALTER TABLE "ShippingSetting" ADD COLUMN "senderAddress" TEXT;`,
      `ALTER TABLE "ShippingSetting" ADD COLUMN "senderPincode" TEXT;`,
      `ALTER TABLE "ShippingSetting" ADD COLUMN "senderCity" TEXT;`,
      `ALTER TABLE "ShippingSetting" ADD COLUMN "senderState" TEXT;`,
    ];

    for (const cmd of commands) {
      try {
        await client.execute(cmd);
        console.log('Executed:', cmd);
      } catch (err) {
        if (err.message.includes('duplicate column name')) {
          console.log('Column already exists, skipping:', cmd);
        } else {
          throw err;
        }
      }
    }
    console.log('Successfully altered table.');
  } catch (e) {
    console.error('Error:', e);
  }
}

run();
