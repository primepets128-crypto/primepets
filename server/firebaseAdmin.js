const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
require('dotenv').config();

let adminAuth = null;

try {
  if (getApps().length === 0) {
    // Only initialize if we have the minimum required environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace literal \n with actual newlines in private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        }),
      });
      adminAuth = getAuth();
    } else {
      console.warn("Firebase Admin credentials missing, skipping initialization");
    }
  } else {
    adminAuth = getAuth();
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

module.exports = adminAuth;
