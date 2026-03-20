import React, { createContext, useContext, useState, useEffect } from 'react';

const AppAuthContext = createContext();

export const AppAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [cybridCustomerId, setCybridCustomerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedJwt = localStorage.getItem('auth_token');
    const savedCybridId = localStorage.getItem('cybrid_customer_id');

    if (savedUser && savedJwt) {
      setUser(JSON.parse(savedUser));
      setJwt(savedJwt);
      setCybridCustomerId(savedCybridId);
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token, cybridId) => {
    setUser(userData);
    setJwt(token);
    setCybridCustomerId(cybridId);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('cybrid_customer_id', cybridId);
  };

  const logout = () => {
    setUser(null);
    setJwt(null);
    setCybridCustomerId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('cybrid_customer_id');
  };

  return (
    <AppAuthContext.Provider value={{ user, jwt, cybridCustomerId, isLoading, login, logout }}>
      {children}
    </AppAuthContext.Provider>
  );
};

export const useAppAuth = () => {
  const context = useContext(AppAuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within AppAuthProvider');
  }
  return context;
};