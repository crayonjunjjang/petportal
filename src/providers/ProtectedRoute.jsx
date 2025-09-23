import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @component ProtectedRoute
 * @description 인증된 사용자만 접근할 수 있는 경로를 보호하는 컴포넌트입니다.
 * 사용자가 로그인되어 있지 않으면 지정된 로그인 페이지로 리디렉션합니다.
 * @param {object} props - 컴포넌트에 전달되는 속성(props).
 * @param {React.ReactNode} props.children - 보호된 경로에 렌더링될 자식 컴포넌트.
 */
const ProtectedRoute = ({ children }) => {
  // useAuth 훅을 사용하여 현재 사용자의 인증 상태를 가져옵니다.
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // 현재 URL 위치 정보를 가져옵니다.

  // 인증 상태를 로딩 중일 때는 아무것도 렌더링하지 않거나 로딩 스피너를 표시할 수 있습니다.
  // 현재는 로딩 중일 때 단순히 아무것도 렌더링하지 않습니다.
  if (isLoading) {
    return null; // 또는 <LoadingSpinner />
  }

  // 사용자가 인증되지 않았다면, 로그인 페이지로 리디렉션합니다.
  // `replace`를 사용하여 현재 히스토리 스택을 대체하고, `state`에 현재 위치를 저장하여
  // 로그인 성공 후 원래 접근하려던 페이지로 돌아갈 수 있도록 합니다.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 사용자가 인증되었다면, 보호된 자식 컴포넌트들을 렌더링합니다.
  return children;
};

export default ProtectedRoute;


