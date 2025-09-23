// src/contexts/UIContext.jsx

// --- 파일 역할: 전역 UI 상태 관리 (로딩 인디케이터 등) ---
// 이 파일은 애플리케이션 전반에 걸쳐 사용되는 UI 관련 상태(예: 로딩 스피너 표시 여부)를 전역적으로 관리하고,
// 해당 상태를 설정하는 함수를 하위 컴포넌트들에게 제공합니다.

// --- IMPORT ---
import React, { createContext, useState, useContext, useMemo } from 'react';

// --- CONTEXT CREATION ---
// UIContext를 생성합니다. 이 Context는 UI 관련 상태와 설정 함수를 전역적으로 제공합니다.
const UIContext = createContext();

// --- UI PROVIDER COMPONENT ---
/**
 * @component UIProvider
 * @description 애플리케이션의 UI 상태를 관리하고, 하위 컴포넌트들에게 제공하는 프로바이더 컴포넌트입니다.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - UIProvider의 하위 컴포넌트들.
 */
export const UIProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  // `isLoading`: 전역 로딩 상태를 나타내는 불리언 값입니다. (true면 로딩 중, false면 로딩 완료)
  const [isLoading, setIsLoading] = useState(false);

  // --- CONTEXT VALUE ---
  // Context를 통해 하위 컴포넌트에 전달할 값들을 `useMemo`로 최적화하여 불필요한 렌더링을 방지합니다.
  const value = useMemo(() => ({
    isLoading,
    setIsLoading,
  }), [isLoading]); // isLoading 상태가 변경될 때만 value 객체 재생성

  // UIContext.Provider를 통해 value를 하위 컴포넌트들에게 제공합니다.
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// --- CUSTOM HOOK: useUI ---
/**
 * @function useUI
 * @description UIContext를 쉽게 사용하기 위한 커스텀 훅입니다.
 * UIProvider 내에서 호출되지 않으면 에러를 발생시킵니다.
 * @returns {object} UIContext의 현재 값 (isLoading, setIsLoading)
 */
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
