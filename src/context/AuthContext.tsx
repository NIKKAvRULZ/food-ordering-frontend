import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  // Initial state is 'pending' to reflect the build/wakeup phase
  const [statuses, setStatuses] = useState({ identity: 'pending', orders: 'pending', catalog: 'pending' });

  useEffect(() => {
    const monitorServices = async () => {
    try {
        // Ping the root or a known endpoint
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/1`, { timeout: 8000 });
        
        // Accept 200 (Found) or 404 (Not Found but Server is Awake)
        if (res.status === 200 || res.status === 404) {
        setStatuses(prev => ({ ...prev, identity: 'live' }));
        }
    } catch (error: any) {
        if (error.response) {
        // If the server responded at all (even with an error), it is "Live"
        setStatuses(prev => ({ ...prev, identity: 'live' }));
        } else if (error.code === 'ECONNABORTED') {
        setStatuses(prev => ({ ...prev, identity: 'pending' }));
        } else {
        setStatuses(prev => ({ ...prev, identity: 'down' }));
        }
    }
    };

    monitorServices();
    const interval = setInterval(monitorServices, 15000); // Check every 15s
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