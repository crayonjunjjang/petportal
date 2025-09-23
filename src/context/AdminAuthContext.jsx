// src/context/AdminAuthContext.jsx

// --- IMPORT ---
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { adminLogin, adminLogout, getAdminToken } from '../services/adminAuthAPI'; // 관리자 인증 관련 API 함수
import { jwtDecode } from 'jwt-decode'; // JWT 토큰 디코딩 라이브러리

// --- CONTEXT CREATION ---
// AdminAuthContext를 생성합니다. 이 Context는 관리자 인증 상태와 관련 함수들을 전역적으로 제공합니다.
const AdminAuthContext = createContext();

// --- CUSTOM HOOK: useAdminAuth ---
/**
 * @function useAdminAuth
 * @description AdminAuthContext의 값을 편리하게 사용할 수 있도록 하는 커스텀 훅입니다.
 * AdminAuthProvider 내에서 호출되지 않으면 에러를 발생시킵니다.
 * @returns {object} AdminAuthContext의 현재 값 (adminUser, isAdminAuthenticated, isAdminLoading, loginAdmin, logoutAdmin)
 */
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// --- ADMIN AUTH PROVIDER COMPONENT ---
/**
 * @component AdminAuthProvider
 * @description 애플리케이션의 관리자 인증 상태를 관리하고, 하위 컴포넌트들에게 제공하는 프로바이더 컴포넌트입니다.
 * 관리자 사용자 정보, 인증 여부, 로딩 상태, 그리고 관리자 로그인/로그아웃 함수를 포함합니다.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - AdminAuthProvider의 하위 컴포넌트들.
 */
export const AdminAuthProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  const [adminUser, setAdminUser] = useState(null); // 현재 로그인된 관리자 사용자 정보를 저장합니다.
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // 관리자 인증 여부
  const [isAdminLoading, setIsAdminLoading] = useState(true); // 관리자 인증 상태 초기 로딩 여부

  // --- EFFECTS ---
  /**
   * @useEffect
   * 컴포넌트 마운트 시 또는 새로고침 시 초기 관리자 인증 상태를 확인합니다.
   * localStorage에 저장된 관리자 토큰을 기반으로 인증을 시도하고, 토큰의 유효성(만료 여부)을 검사합니다.
   */
  useEffect(() => {
    const token = getAdminToken(); // localStorage에서 관리자 토큰을 가져옵니다.
    console.log('AdminAuthContext: Checking token on mount:', token ? 'Token exists' : 'No token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // JWT 토큰을 디코딩합니다.
        console.log('AdminAuthContext: Decoded token:', decodedToken);
        console.log('AdminAuthContext: Token expires at:', new Date(decodedToken.exp * 1000));
        console.log('AdminAuthContext: Current time:', new Date());

        // 토큰 만료 여부 확인: 토큰의 'exp' (만료 시간)가 현재 시간보다 이전이면 만료된 토큰입니다.
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log('AdminAuthContext: Token expired, removing token');
          adminLogout(); // 만료된 토큰 제거
          setAdminUser(null);
          setIsAdminAuthenticated(false);
        } else {
          // 토큰이 유효하면 관리자 사용자 정보 설정 및 인증 상태를 true로 설정합니다.
          console.log('AdminAuthContext: Token valid, setting authenticated to true');
          setAdminUser({ id: decodedToken.id, username: decodedToken.username, role: decodedToken.role });
          setIsAdminAuthenticated(true);
        }
      } catch (error) {
        // 토큰 디코딩 실패 시 (예: 토큰 형식이 잘못된 경우)
        console.error('Failed to decode admin token:', error);
        adminLogout(); // 잘못된 토큰 제거
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      }
    } else {
      // 토큰이 없는 경우
      console.log('AdminAuthContext: No token found');
      setAdminUser(null);
      setIsAdminAuthenticated(false);
    }
    setIsAdminLoading(false); // 초기 로딩 완료
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // --- AUTHENTICATION FUNCTIONS (인증 관련 함수) ---

  /**
   * @function loginAdmin
   * @description 관리자 로그인을 처리하는 함수입니다.
   * @param {string} username - 관리자 사용자 이름.
   * @param {string} password - 관리자 비밀번호.
   * @returns {Promise<object>} 성공 여부와 에러 메시지를 포함하는 객체.
   */
  const loginAdmin = useCallback(async (username, password) => {
    setIsAdminLoading(true); // 로그인 요청 시작 시 로딩 상태 설정
    try {
      const data = await adminLogin(username, password); // adminAuthAPI를 통해 로그인 요청
      const token = data.token; // 응답에서 토큰 추출
      const decodedToken = jwtDecode(token); // 토큰 디코딩
      // 관리자 사용자 정보 설정 및 인증 상태를 true로 설정
      setAdminUser({ id: decodedToken.id, username: decodedToken.username, role: decodedToken.role });
      setIsAdminAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Admin login failed in context:', error); // 로그인 실패 시 에러 로깅
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      return { success: false, error: error.message }; // 에러 메시지 반환
    } finally {
      setIsAdminLoading(false); // 로그인 요청 완료 시 로딩 상태 해제
    }
  }, []); // useCallback 의존성 배열 비어있음

  /**
   * @function logoutAdmin
   * @description 관리자 로그아웃을 처리하는 함수입니다.
   * 모든 관리자 인증 관련 데이터를 제거하고 adminUser 상태를 null로 설정합니다.
   */
  const logoutAdmin = useCallback(() => {
    adminLogout(); // adminAuthAPI를 통해 localStorage에서 토큰 제거
    setAdminUser(null); // adminUser 상태 초기화
    setIsAdminAuthenticated(false); // 인증 상태를 false로 설정
  }, []); // useCallback 의존성 배열 비어있음

  // --- CONTEXT VALUE ---
  // useMemo를 사용하여 value 객체가 adminUser, isAdminAuthenticated, isAdminLoading, loginAdmin, logoutAdmin이 변경될 때만 재생성되도록 최적화합니다.
  const value = useMemo(() => ({
    adminUser,
    isAdminAuthenticated,
    isAdminLoading,
    loginAdmin,
    logoutAdmin,
  }), [adminUser, isAdminAuthenticated, isAdminLoading, loginAdmin, logoutAdmin]);

  // AdminAuthContext.Provider를 통해 value를 하위 컴포넌트들에게 제공합니다.
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};