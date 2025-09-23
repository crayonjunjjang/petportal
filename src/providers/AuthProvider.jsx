import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import * as authAPI from '../services/authAPI';

// 1. Context 생성
const AuthContext = createContext();

// 2. useAuth 커스텀 훅
export const useAuth = () => useContext(AuthContext);

// 3. AuthProvider 컴포넌트
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  // 로그인 함수
  const login = useCallback(async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message || '로그인 실패' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || '서버 오류가 발생했습니다.' };
    }
  }, []);

  // 로그아웃 함수
  const logout = useCallback(() => {
    authAPI.logout(); // Clear token and user from localStorage
    setUser(null);
  }, []);

  // 회원가입 함수
  const signup = useCallback(async (newUserData) => {
    try {
      const response = await authAPI.register(newUserData);
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message || '회원가입 실패' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || '서버 오류가 발생했습니다.' };
    }
  }, []);


  const value = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
    signup,
  }), [isAuthenticated, user, login, logout, signup]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;