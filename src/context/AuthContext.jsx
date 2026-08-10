import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('prime-pets-auth-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('prime-pets-users-db');
    const parsed = saved ? JSON.parse(saved) : [];
    
    // Ensure default admin exists
    if (!parsed.some(u => u.email === 'admin' || u.phone === 'admin' || u.name === 'admin')) {
      parsed.push({
        id: 'admin-001',
        name: 'Admin',
        email: 'admin', // Using 'admin' as the identifier
        phone: '',
        password: 'Primepets@848587',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
    }
    return parsed;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('prime-pets-auth-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('prime-pets-auth-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('prime-pets-users-db', JSON.stringify(usersDb));
  }, [usersDb]);

  const checkUserExists = (identifier) => {
    return usersDb.some(u => u.email === identifier || u.phone === identifier);
  };

  const login = (identifier, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = usersDb.find(u => (u.email === identifier || u.phone === identifier) && u.password === password);
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email/phone or password'));
        }
      }, 500); // Simulate network delay
    });
  };

  const register = (name, identifier, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (usersDb.some(u => u.email === identifier || u.phone === identifier)) {
          reject(new Error('User with this email/phone already exists'));
          return;
        }
        
        // First user to register gets admin privileges
        const role = usersDb.length === 0 ? 'admin' : 'user';
        
        const newUser = {
          id: Date.now().toString(),
          name,
          email: identifier.includes('@') ? identifier : '', // store as email if it has @
          phone: !identifier.includes('@') ? identifier : '', // otherwise store as phone
          password,
          role,
          createdAt: new Date().toISOString()
        };
        
        setUsersDb(prev => [...prev, newUser]);
        
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        resolve(userWithoutPassword);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, usersDb, login, register, logout, checkUserExists, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
