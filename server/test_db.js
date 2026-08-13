const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function checkLocal() {
  console.log("=== Checking Local dev.db (SQLite) ===");
  try {
    const localPrisma = new PrismaClient({
      datasources: {
        db: {
          url: 'file:./dev.db'
        }
      }
    });
    const productsCount = await localPrisma.product.count();
    const slidesCount = await localPrisma.slide.count();
    const bannersCount = await localPrisma.banner.count();
    console.log(`Local Products: ${productsCount}`);
    console.log(`Local Slides: ${slidesCount}`);
    console.log(`Local Banners: ${bannersCount}`);
    if (productsCount > 0) {
      const sample = await localPrisma.product.findFirst();
      console.log(`Sample Local Product: ${sample.name} (${sample.brand})`);
    }
    await localPrisma.$disconnect();
  } catch (e) {
    console.error("Local SQLite check failed:", e.message);
  }
}

async function checkTurso() {
  console.log("\n=== Checking Turso DB ===");
  try {
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;
    console.log(`Turso URL: ${url}`);
    
    const libsql = createClient({ url, authToken: token });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });
    
    const productsCount = await tursoPrisma.product.count();
    const slidesCount = await tursoPrisma.slide.count();
    const bannersCount = await tursoPrisma.banner.count();
    console.log(`Turso Products: ${productsCount}`);
    console.log(`Turso Slides: ${slidesCount}`);
    console.log(`Turso Banners: ${bannersCount}`);
    if (productsCount > 0) {
      const sample = await tursoPrisma.product.findFirst();
      console.log(`Sample Turso Product: ${sample.name} (${sample.brand})`);
    }
    await tursoPrisma.$disconnect();
  } catch (e) {
    console.error("Turso check failed:", e.message);
  }
}

async function run() {
  await checkLocal();
  await checkTurso();
}

run();
