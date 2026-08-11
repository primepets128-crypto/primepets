const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const alterStatements = [
    'ALTER TABLE FrontendSetting ADD COLUMN razorpayKeyId TEXT',
    'ALTER TABLE FrontendSetting ADD COLUMN whatsappOrderNumber TEXT',
    'ALTER TABLE FrontendSetting ADD COLUMN siteAudioUrl TEXT',
    'ALTER TABLE FrontendSetting ADD COLUMN contactEmail TEXT',
    'ALTER TABLE FrontendSetting ADD COLUMN contactPhone TEXT',
  ];

  const createOrder = `CREATE TABLE IF NOT EXISTS "Order" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    customerAddress TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    paymentMethod TEXT NOT NULL,
    paymentStatus TEXT NOT NULL DEFAULT 'PENDING',
    status TEXT NOT NULL DEFAULT 'PENDING',
    razorpayOrderId TEXT,
    razorpayPaymentId TEXT,
    notes TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;

  for (const sql of alterStatements) {
    try {
      await libsql.execute(sql);
      console.log('OK:', sql.substring(0, 70));
    } catch(e) {
      const msg = e.message || '';
      if (msg.includes('duplicate column') || msg.includes('already exists')) {
        console.log('SKIP (already exists):', sql.substring(0, 70));
      } else {
        console.error('ERROR:', msg);
      }
    }
  }

  try {
    await libsql.execute(createOrder);
    console.log('OK: CREATE TABLE Order');
  } catch(e) {
    console.error('ERROR creating Order table:', e.message);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
