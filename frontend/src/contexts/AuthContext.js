import React, { createContext, useEffect, useState } from 'react';
import API, { setToken } from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (admin?.token) {
      setToken(admin.token);
      localStorage.setItem('admin_user', JSON.stringify(admin));
    } else {
      setToken(null);
      localStorage.removeItem('admin_user');
    }
  }, [admin]);

  async function login(email, password) {
    const res = await API.post('/auth/login', { email, password });
    const payload = { token: res.data.token, role: 'admin' };
    setAdmin(payload);
  }

  function logout() {
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
