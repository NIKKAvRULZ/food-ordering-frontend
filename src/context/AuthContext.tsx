import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const getInitialUser = () => {
    try {
      const item = localStorage.getItem('user');
      return item && item !== 'undefined' ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState<any>(getInitialUser());
  // Updated to include all 4 required components [cite: 7]
  const [statuses, setStatuses] = useState({ 
    identity: 'pending', 
    catalog: 'pending', 
    payment: 'pending', 
    orders: 'pending' 
  });

  useEffect(() => {
    const monitorServices = async () => {
      // 1. Identity Node (Primary)
      try {
        const res = await axios.get(`${import.meta.env.VITE_IDENTITY_URL}/api/users/ping`, { timeout: 8000 });
        if (res.status === 200 || res.status === 404) {
          setStatuses(prev => ({ ...prev, identity: 'live' }));
        }
      } catch (error: any) {
        setStatuses(prev => ({ ...prev, identity: error.response ? 'live' : 'down' }));
      }

      // 2. Catalog Node (Integration Point)
      try {
        const url = import.meta.env.VITE_CATALOG_URL;
        if (url) {
          const res = await axios.get(`${url}/health`, { timeout: 8000 });
          setStatuses(prev => ({ ...prev, catalog: res.status === 200 || res.status === 404 ? 'live' : 'down' }));
        }
      } catch (error: any) {
        setStatuses(prev => ({ ...prev, catalog: error.response ? 'live' : 'down' }));
      }

      // 3. Payment Node [cite: 7, 8]
      try {
        const url = import.meta.env.VITE_PAYMENT_URL;
        if (url) {
          const res = await axios.get(`${url}/health`, { timeout: 8000 });
          setStatuses(prev => ({ ...prev, payment: res.status === 200 || res.status === 404 ? 'live' : 'down' }));
        }
      } catch (error: any) {
        setStatuses(prev => ({ ...prev, payment: error.response ? 'live' : 'down' }));
      }

      // 4. Order Node [cite: 7, 8]
      try {
        const url = import.meta.env.VITE_ORDER_URL;
        if (url) {
          const res = await axios.get(`${url}/orders`, { timeout: 8000 });
          setStatuses(prev => ({ ...prev, orders: res.status === 200 || res.status === 404 ? 'live' : 'down' }));
        }
      } catch (error: any) {
        setStatuses(prev => ({ ...prev, orders: error.response ? 'live' : 'down' }));
      }
    };

    monitorServices();
    const interval = setInterval(monitorServices, 25000); // 25s intervals for Render resource management
    return () => clearInterval(interval);
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, statuses }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);