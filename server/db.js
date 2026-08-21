const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

let prisma;
let dbError = null;

try {
  const { PrismaClient } = require('@prisma/client');
  const { createClient } = require('@libsql/client/web');
  const { PrismaLibSQL } = require('@prisma/adapter-libsql');
  
  const dbUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
  if (!dbUrl) throw new Error("Database URL (DATABASE_URL or TURSO_DATABASE_URL) is missing in environment variables!");
  
  let libsql;
  if (dbUrl.startsWith('file:')) {
    const { createClient } = require('@libsql/client');
    let filePath = dbUrl.replace('file:', '');
    if (!path.isAbsolute(filePath)) {
      // Resolve relative path to be inside the prisma/ directory
      filePath = path.resolve(__dirname, 'prisma', filePath);
    }
    libsql = createClient({ url: `file:${filePath}` });
  } else {
    const { createClient } = require('@libsql/client/web');
    libsql = createClient({
      url: dbUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

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
