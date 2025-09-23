// src/services/adminAuthAPI.js

const adminLogin = async (username, password) => {
  // Simulate a successful login for frontend-only mode
  console.warn('Frontend-only mode: Admin login is mocked.');
  return {
    token: 'mock-admin-token',
    user: { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' }
  };
};

const adminLogout = () => {
  localStorage.removeItem('adminToken');
  console.warn('Frontend-only mode: Admin logout is mocked.');
};

const getAdminToken = () => {
  // In frontend-only mode, we don't rely on a real token from localStorage for auth
  return 'mock-admin-token';
};

const getAdminAuthHeader = () => {
  // In frontend-only mode, no real auth header is needed
  console.warn('Frontend-only mode: getAdminAuthHeader is mocked. Returning empty object.');
  return {};
};

export { adminLogin, adminLogout, getAdminToken, getAdminAuthHeader };