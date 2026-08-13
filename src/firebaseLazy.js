// Lazy Firebase initializer
// Firebase is initialized on-demand, not at module import time.
// This prevents the auth/iframe.js from loading during the initial page render.

let _app = null;
let _auth = null;
let _initPromise = null;

export function getFirebaseApp() {
  if (_app) return _app;
  const { initializeApp } = require('firebase/app');
  _app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });
  return _app;
}

export async function getFirebaseAuth() {
  if (_auth) return _auth;
  const [{ initializeApp }, { getAuth }] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
  ]);
  if (!_app) {
    _app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
  }
  _auth = getAuth(_app);
  return _auth;
}
