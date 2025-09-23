// src/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, adminLogout, getAdminToken } from '../services/adminAuthAPI';
import { jwtDecode } from 'jwt-decode'; // Make sure to install jwt-decode: npm install jwt-decode

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    console.log('AdminAuthContext: Checking token on mount:', token ? 'Token exists' : 'No token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('AdminAuthContext: Decoded token:', decodedToken);
        console.log('AdminAuthContext: Token expires at:', new Date(decodedToken.exp * 1000));
        console.log('AdminAuthContext: Current time:', new Date());

        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log('AdminAuthContext: Token expired, removing token');
          adminLogout();
          setAdminUser(null);
          setIsAdminAuthenticated(false);
        } else {
          console.log('AdminAuthContext: Token valid, setting authenticated to true');
          setAdminUser({ id: decodedToken.id, username: decodedToken.username, role: decodedToken.role });
          setIsAdminAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to decode admin token:', error);
        adminLogout();
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      }
    } else {
      console.log('AdminAuthContext: No token found');
      setAdminUser(null);
      setIsAdminAuthenticated(false);
    }
    setIsAdminLoading(false);
  }, []);

  const loginAdmin = async (username, password) => {
    setIsAdminLoading(true);
    try {
      const data = await adminLogin(username, password);
      const token = data.token;
      const decodedToken = jwtDecode(token);
      setAdminUser({ id: decodedToken.id, username: decodedToken.username, role: decodedToken.role });
      setIsAdminAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Admin login failed in context:', error);
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      return { success: false, error: error.message };
    } finally {
      setIsAdminLoading(false);
    }
  };

  const logoutAdmin = () => {
    adminLogout();
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  const value = {
    adminUser,
    isAdminAuthenticated,
    isAdminLoading,
    loginAdmin,
    logoutAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
