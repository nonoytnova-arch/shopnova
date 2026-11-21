import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('shopnova_user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, password) {
    const data = await api.login({ email, password });
    localStorage.setItem('shopnova_token', data.token);
    localStorage.setItem('shopnova_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password });
    localStorage.setItem('shopnova_token', data.token);
    localStorage.setItem('shopnova_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem('shopnova_token');
    localStorage.removeItem('shopnova_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
