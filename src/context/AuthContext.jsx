// src/context/AuthContext.jsx

// --- IMPORT ---
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
// import { authAPI } from '../services/authAPI'; // 인증 관련 API 호출을 위한 서비스 (현재는 목업)
import initialUsers from '../data/users.json'; // 초기 사용자 데이터 (빈 배열일 수 있음)

// --- CONTEXT CREATION ---
// AuthContext를 생성합니다. 이 Context는 사용자 인증 상태와 관련 함수들을 전역적으로 제공합니다.
const AuthContext = createContext();

// --- CUSTOM HOOK: useAuth ---
/**
 * @function useAuth
 * @description AuthContext의 값을 편리하게 사용할 수 있도록 하는 커스텀 훅입니다.
 * AuthProvider 내에서 호출되지 않으면 에러를 발생시킵니다.
 * @returns {object} AuthContext의 현재 값 (user, isLoading, isAuthenticated, signup, login, logout, updateUser)
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- HELPER FUNCTIONS FOR LOCALSTORAGE ---
const LOCAL_STORAGE_ALL_USERS_KEY = 'allRegisteredUsers';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'currentUser';

const getAllUsersFromLocalStorage = () => {
  const usersJson = localStorage.getItem(LOCAL_STORAGE_ALL_USERS_KEY);
  if (usersJson) {
    return JSON.parse(usersJson);
  } else {
    // If no users in localStorage, use initialUsers from users.json
    // and save them to localStorage for future use.
    if (initialUsers.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_ALL_USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return [];
  }
};

const saveAllUsersToLocalStorage = (users) => {
  localStorage.setItem(LOCAL_STORAGE_ALL_USERS_KEY, JSON.stringify(users));
};

const getCurrentUserFromLocalStorage = () => {
  const userJson = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

const saveCurrentUserToLocalStorage = (user) => {
  localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
};

const removeCurrentUserFromLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
};

// --- AUTH PROVIDER COMPONENT ---
/**
 * @component AuthProvider
 * @description 애플리케이션의 인증 상태를 관리하고, 하위 컴포넌트들에게 제공하는 프로바이더 컴포넌트입니다.
 * 사용자 정보, 로딩 상태, 인증 여부, 그리고 로그인/회원가입/로그아웃/사용자 정보 업데이트 함수를 포함합니다.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - AuthProvider의 하위 컴포넌트들.
 */
export const AuthProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null); // 현재 로그인된 사용자 정보를 저장합니다. (null이면 로그아웃 상태)
  const [isLoading, setIsLoading] = useState(true); // 인증 상태 초기 로딩 여부를 나타냅니다.

  // --- EFFECTS ---
  /**
   * @useEffect
   * 컴포넌트 마운트 시 또는 새로고침 시 초기 인증 상태를 확인합니다.
   * localStorage에 저장된 사용자 정보를 기반으로 사용자 인증을 시도합니다.
   */
  useEffect(() => {
    const initializeAuth = () => {
      console.log('AuthContext: Initializing authentication...');
      const storedUser = getCurrentUserFromLocalStorage();
      if (storedUser) {
        setUser(storedUser);
        console.log('AuthContext: Found stored user', storedUser);
      } else {
        console.log('AuthContext: No stored user found');
      }
      setIsLoading(false); // 초기 로딩 완료
      console.log('AuthContext: Authentication initialization complete. isLoading set to false.');
    };

    initializeAuth();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // --- AUTHENTICATION FUNCTIONS (인증 관련 함수) ---

  /**
   * @function signup
   * @description 사용자 회원가입을 처리하는 함수입니다.
   * @param {object} userData - 회원가입에 필요한 사용자 데이터 (예: email, password, nickname).
   * @returns {Promise<object>} 성공 여부와 사용자 정보 또는 에러 메시지를 포함하는 객체.
   */
  const signup = useCallback(async (userData) => {
    const allUsers = getAllUsersFromLocalStorage();
    const userExists = allUsers.some(u => u.email === userData.email);

    if (userExists) {
      return { success: false, error: '이미 등록된 이메일입니다.' };
    }

    const newUser = {
      id: Date.now().toString(), // 고유 ID 생성
      email: userData.email,
      password: userData.password, // 실제 앱에서는 비밀번호를 해싱해야 합니다.
      nickname: userData.nickname || userData.email.split('@')[0],
      role: 'user',
      profileImage: '/src/assets/images/profiles/default-user.svg',
      joinDate: new Date().toISOString().split('T')[0],
      // 기타 필요한 필드 추가
    };

    const updatedUsers = [...allUsers, newUser];
    saveAllUsersToLocalStorage(updatedUsers);
    saveCurrentUserToLocalStorage(newUser);
    setUser(newUser);

    return { success: true, user: newUser };
  }, []);

  /**
   * @function login
   * @description 사용자 로그인을 처리하는 함수입니다.
   * @param {string} email - 사용자 이메일.
   * @param {string} password - 사용자 비밀번호.
   * @returns {Promise<object>} 성공 여부와 사용자 정보 또는 에러 메시지를 포함하는 객체.
   */
  const login = useCallback(async (email, password) => {
    const allUsers = getAllUsersFromLocalStorage();
    const foundUser = allUsers.find(u => u.email === email && u.password === password);

    saveCurrentUserToLocalStorage(foundUser);
    setUser(foundUser);
    console.log('AuthContext: User logged in successfully', foundUser);
    return { success: true, user: foundUser };
  }, []);

  /**
   * @function logout
   * @description 사용자 로그아웃을 처리하는 함수입니다.
   * 모든 인증 관련 localStorage 데이터를 제거하고 user 상태를 null로 설정합니다.
   */
  const logout = useCallback(() => {
    setUser(null);
    removeCurrentUserFromLocalStorage();
    console.log('AuthContext: User logged out');
  }, []);

  /**
   * @function updateUser
   * @description 사용자 정보를 업데이트하는 함수입니다.
   * (현재는 프론트엔드 상태 및 localStorage만 업데이트하는 목업)
   * @param {object} userData - 업데이트할 사용자 데이터.
   * @returns {Promise<object>} 성공 여부와 업데이트된 사용자 정보 또는 에러 메시지를 포함하는 객체.
   */
  const updateUser = useCallback(async (userData) => {
    const allUsers = getAllUsersFromLocalStorage();
    const updatedUsers = allUsers.map(u => 
      u.id === user?.id ? { ...u, ...userData } : u
    );
    saveAllUsersToLocalStorage(updatedUsers);

    const updatedCurrentUser = { ...user, ...userData };
    saveCurrentUserToLocalStorage(updatedCurrentUser);
    setUser(updatedCurrentUser);
    console.log('AuthContext: User updated', updatedCurrentUser);
    
    return { success: true, user: updatedCurrentUser };
  }, [user]);

  // --- CONTEXT VALUE ---
  // useMemo를 사용하여 value 객체가 user, isLoading, isAuthenticated, signup, login, logout, updateUser가 변경될 때만 재생성되도록 최적화합니다.
  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user, // user 객체가 존재하면 인증된 것으로 간주
    signup,
    login,
    logout,
    updateUser
  }), [user, isLoading, signup, login, logout, updateUser]);

  // 디버깅을 위한 콘솔 로그
  console.log('AuthContext value:', { user, isAuthenticated: !!user, isLoading });

  // AuthContext.Provider를 통해 value를 하위 컴포넌트들에게 제공합니다.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};