import React, { createContext, useState, useContext, useEffect } from 'react';
import adminUsers from '../data/admin_users.json';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('adminUser');
    if (loggedInUser) {
      setAdminUser(JSON.parse(loggedInUser));
      setIsAdmin(true);
    }
  }, []);

  const login = (username, password) => {
    const user = adminUsers.find(u => u.username === username && u.password === password);
    if (user) {
      const userData = { id: user.id, username: user.username };
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setAdminUser(userData);
      setIsAdmin(true);
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setIsAdmin(false);
  };

  const value = {
    isAdmin,
    adminUser,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
