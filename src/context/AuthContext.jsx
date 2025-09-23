// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI'; // Import mock authAPI

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 토큰 기반 인증 확인 (mocked)
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userInfo = localStorage.getItem('userInfo');
      
      if (token) {
        try {
          // Mocked token verification
          const decodedToken = JSON.parse(atob(token));
          if (decodedToken && decodedToken.userId && decodedToken.email) {
            // For frontend-only, assume token is valid if it exists and is decodable
            // and try to get user info from localStorage
            if (userInfo) {
              const userData = JSON.parse(userInfo);
              setUser({
                id: userData.id,
                email: userData.email,
                nickname: userData.name || userData.email.split('@')[0],
                role: userData.role || 'user', // Default role
                profileImage: '/src/assets/images/profiles/default-user.svg',
                joinDate: userData.joinDate || new Date().toISOString().split('T')[0]
              });
            } else {
              // If token exists but userInfo doesn't, try to get it from mock API
              const response = await authAPI.getUserInfo();
              if (response.success) {
                setUser({
                  id: response.user.id,
                  email: response.user.email,
                  nickname: response.user.name || response.user.email.split('@')[0],
                  role: response.user.role || 'user',
                  profileImage: '/src/assets/images/profiles/default-user.svg',
                  joinDate: response.user.joinDate || new Date().toISOString().split('T')[0]
                });
                localStorage.setItem('userInfo', JSON.stringify(response.user));
              } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userInfo');
                localStorage.setItem('isLoggedIn', 'false');
              }
            }
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            localStorage.setItem('isLoggedIn', 'false');
          }
        } catch (error) {
          console.error('Mock token verification or user info retrieval failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          localStorage.setItem('isLoggedIn', 'false');
        }
      } else if (isLoggedIn && userInfo) {
        // Fallback for existing login info (legacy compatibility)
        try {
          const userData = JSON.parse(userInfo);
          setUser({
            id: userData.id,
            email: userData.email,
            nickname: userData.name || userData.email.split('@')[0],
            profileImage: '/src/assets/images/profiles/default-user.svg',
            joinDate: new Date().toISOString().split('T')[0]
          });
        } catch (parseError) {
          console.error('사용자 정보 파싱 실패:', parseError);
          localStorage.removeItem('userInfo');
          localStorage.setItem('isLoggedIn', 'false');
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // 회원가입 (mocked)
  const signup = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        
        setUser({
          id: response.user.id,
          email: response.user.email,
          nickname: response.user.name || response.user.email.split('@')[0],
          role: response.user.role || 'user',
          profileImage: '/src/assets/images/profiles/default-user.svg',
          joinDate: response.user.joinDate || new Date().toISOString().split('T')[0]
        });

        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || '회원가입 중 오류가 발생했습니다.' };
      }
    } catch (error) {
      const errorMessage = error.message || '회원가입 중 오류가 발생했습니다.';
      return { success: false, error: errorMessage };
    }
  };

  // 로그인 (mocked)
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        
        setUser({
          id: response.user.id,
          email: response.user.email,
          nickname: response.user.name || response.user.email.split('@')[0],
          role: response.user.role || 'user',
          profileImage: '/src/assets/images/profiles/default-user.svg',
          joinDate: response.user.joinDate || new Date().toISOString().split('T')[0]
        });

        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || '로그인 중 오류가 발생했습니다.' };
      }
    } catch (error) {
      const errorMessage = error.message || '로그인 중 오류가 발생했습니다.';
      return { success: false, error: errorMessage };
    }
  };

  // 로그아웃 (mocked)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.setItem('isLoggedIn', 'false');
    
    // 프로필 데이터 저장 (기존 로직 유지)
    const profileData = localStorage.getItem('profileData');
    if (profileData && user) {
      const allProfileData = JSON.parse(localStorage.getItem('allProfileData') || '{}');
      allProfileData[user.id] = JSON.parse(profileData);
      localStorage.setItem('allProfileData', JSON.stringify(allProfileData));
      localStorage.removeItem('profileData');
    }
  };

  // 사용자 정보 업데이트 (mocked)
  const updateUser = async (userData) => {
    try {
      // For frontend-only, directly update local user state and localStorage
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      return { success: false, error: '사용자 정보 업데이트에 실패했습니다.' };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateUser
  };

  console.log('AuthContext value:', { user, isAuthenticated: !!user, isLoading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
