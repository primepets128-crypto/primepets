import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize the Firebase App (lightweight — no auth iframe yet)
const app = initializeApp(firebaseConfig);

// Lazy auth getter — getAuth() is NOT called at module load.
// It's called on first use in AuthContext, after React mounts.
// This delays auth/iframe.js from loading until AFTER the first paint,
// moving it off the critical rendering path entirely.
let _authInstance = null;
export async function getFirebaseAuth() {
  if (_authInstance) return _authInstance;
  const { getAuth } = await import('firebase/auth');
  _authInstance = getAuth(app);
  return _authInstance;
}

export { app };
