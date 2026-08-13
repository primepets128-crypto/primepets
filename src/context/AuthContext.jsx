import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirebaseAuth } from '../firebase';
import axios from 'axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lazy auth initialization — only runs after React mounts (post first paint).
  // This keeps auth/iframe.js out of the critical rendering path.
  useEffect(() => {
    let unsubscribe = () => {};

    const initAuth = async () => {
      // Dynamic imports so firebase/auth is NOT in the initial JS bundle
      const [auth, { onAuthStateChanged }] = await Promise.all([
        getFirebaseAuth(),
        import('firebase/auth').then(m => ({ onAuthStateChanged: m.onAuthStateChanged })),
      ]);

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            const response = await axios.post('/api/auth/me', {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ ...firebaseUser, ...response.data.user });
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(firebaseUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    };

    initAuth();
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const [auth, { signInWithEmailAndPassword }] = await Promise.all([
      getFirebaseAuth(),
      import('firebase/auth').then(m => ({ signInWithEmailAndPassword: m.signInWithEmailAndPassword })),
    ]);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const register = async (name, email, password) => {
    const [auth, { createUserWithEmailAndPassword }] = await Promise.all([
      getFirebaseAuth(),
      import('firebase/auth').then(m => ({ createUserWithEmailAndPassword: m.createUserWithEmailAndPassword })),
    ]);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    await axios.post('/api/auth/register', { name, email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return userCredential.user;
  };

  const logout = async () => {
    const [auth, { signOut }] = await Promise.all([
      getFirebaseAuth(),
      import('firebase/auth').then(m => ({ signOut: m.signOut })),
    ]);
    await signOut(auth);
  };

  const checkUserExists = async (email) => {
    try {
      const response = await axios.post('/api/auth/check', { email });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      checkUserExists,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
