// src/contexts/SearchContext.jsx

// --- 파일 역할: 전역 검색어 상태 관리 ---
// 이 파일은 애플리케이션 전반에 걸쳐 사용되는 검색어(searchTerm) 상태를 전역적으로 관리하고,
// 검색어 설정 함수를 하위 컴포넌트들에게 제공합니다.

// --- IMPORT ---
import React, { createContext, useState, useContext, useMemo } from 'react';

// --- CONTEXT CREATION ---
// SearchContext를 생성합니다. 이 Context는 검색어 상태와 설정 함수를 전역적으로 제공합니다.
const SearchContext = createContext();

// --- SEARCH PROVIDER COMPONENT ---
/**
 * @component SearchProvider
 * @description 애플리케이션의 검색어 상태를 관리하고, 하위 컴포넌트들에게 제공하는 프로바이더 컴포넌트입니다.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - SearchProvider의 하위 컴포넌트들.
 */
export const SearchProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  // `searchTerm`: 현재 검색어를 저장하는 상태입니다. 초기값은 빈 문자열입니다.
  const [searchTerm, setSearchTerm] = useState('');

  // --- CONTEXT VALUE ---
  // Context를 통해 하위 컴포넌트에 전달할 값들을 `useMemo`로 최적화하여 불필요한 렌더링을 방지합니다.
  const value = useMemo(() => ({
    searchTerm,
    setSearchTerm,
  }), [searchTerm]); // searchTerm이 변경될 때만 value 객체 재생성

  // SearchContext.Provider를 통해 value를 하위 컴포넌트들에게 제공합니다.
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// --- CUSTOM HOOK: useSearch ---
/**
 * @function useSearch
 * @description SearchContext를 쉽게 사용하기 위한 커스텀 훅입니다.
 * SearchProvider 내에서 호출되지 않으면 에러를 발생시킵니다.
 * @returns {object} SearchContext의 현재 값 (searchTerm, setSearchTerm)
 */
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};