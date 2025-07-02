import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : { role: null, token: null };
  });

  const login = (data) => {
    setAuth(data);
    localStorage.setItem('auth', JSON.stringify(data));
  };

  const logout = () => {
    setAuth({ role: null, token: null });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
