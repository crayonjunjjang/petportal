// src/providers/AdminAuthProvider.jsx
import React from 'react';
import { AdminAuthProvider as ContextAdminAuthProvider } from '../context/AdminAuthContext';

const AdminAuthProvider = ({ children }) => {
  return (
    <ContextAdminAuthProvider>
      {children}
    </ContextAdminAuthProvider>
  );
};

export default AdminAuthProvider;
