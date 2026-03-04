import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [statuses, setStatuses] = useState({ identity: 'checking', orders: 'offline', catalog: 'offline' });

  useEffect(() => {
    const monitorServices = async () => {
      try {
        // Pings your Render backend to check live status
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/1`);
        setStatuses(prev => ({ ...prev, identity: res.status === 200 ? 'online' : 'offline' }));
      } catch {
        setStatuses(prev => ({ ...prev, identity: 'offline' }));
      }
    };
    monitorServices();
    const interval = setInterval(monitorServices, 30000);
    return () => clearInterval(interval);
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, statuses }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);