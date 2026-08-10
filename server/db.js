const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client/web');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

let prisma;
let dbError = null;

try {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) throw new Error("TURSO_DATABASE_URL is missing in environment variables!");
  
  const libsql = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSQL(libsql);
  prisma = new PrismaClient({ adapter });
} catch (error) {
  console.error("Prisma initialization error:", error);
  dbError = error;
  // Create a proxy that throws the initialization error when any method is called
  prisma = new Proxy({}, {
    get: function(target, prop) {
      if (prop === 'error') return dbError;
      throw new Error(`Database failed to initialize: ${dbError.message}\nStack: ${dbError.stack}`);
    }
  });
}

module.exports = prisma;
