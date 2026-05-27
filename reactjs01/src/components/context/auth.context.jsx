import React, { createContext, useState, useEffect } from 'react';
import { getAccountAPI } from '../../util/api';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: () => {},
  setIsAuthenticated: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await getAccountAPI();
        if (response && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      setUser,
      setIsAuthenticated,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
