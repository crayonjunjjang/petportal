// src/components/layout/Header.jsx

// --- 파일 역할: 웹사이트의 모든 페이지 상단에 공통적으로 표시되는 헤더(Header) ---
// 이 컴포넌트는 로고, 네비게이션 바, 검색창, 장바구니, 인증 관련 버튼 등
// 웹사이트의 핵심적인 탐색 기능들을 포함하고 있습니다.
// 또한, 스크롤 상태와 화면 크기에 따라 동적으로 스타일과 레이아웃이 변경됩니다.
// 사용자의 인증 상태에 따라 다른 UI 요소를 조건부로 렌더링합니다.

import React, { useState, useEffect } from 'react'; // React 및 상태 관리를 위한 useState, 부수 효과를 위한 useEffect 훅 임포트
import Logo from '../common/Logo'; // 웹사이트 로고 컴포넌트
import NavBar from '../common/NavBar'; // 메인 네비게이션 링크들을 포함하는 컴포넌트
import SearchBar from '../common/SearchBar'; // 검색 기능을 제공하는 컴포넌트
import HamburgerButton from '../common/HamburgerButton'; // 모바일 뷰에서 메뉴를 토글하는 햄버거 버튼
import MobileMenu from '../common/MobileMenu'; // 모바일 뷰에서 나타나는 전체 화면 메뉴
import CartIcon from '../common/CartIcon'; // 장바구니 아이콘 컴포넌트
import ProfileIcons from '../profile/ProfileIcons'; // 사용자 프로필 관련 아이콘 (로그인 시 표시)
import AuthButtons from '../common/AuthButtons'; // 로그인/회원가입 등 인증 관련 버튼
import styles from './Header.module.css'; // Header 컴포넌트의 스타일을 위한 CSS 모듈
import { useAuth } from '../../context/AuthContext'; // 사용자 인증 상태(로그인 여부)를 전역적으로 관리하는 Context 훅

// --- Header Component ---
// 웹사이트의 전역 헤더를 렌더링하는 함수형 컴포넌트
const Header = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  // isScrolled: 페이지가 스크롤되었는지 여부를 나타내는 상태 (헤더 스타일 변경에 사용)
  const [isScrolled, setIsScrolled] = useState(false);
  // isMobileMenuOpen: 모바일 메뉴의 열림/닫힘 상태를 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // isAuthenticated: useAuth 훅을 통해 현재 사용자의 로그인(인증) 여부를 가져옴
  const { isAuthenticated } = useAuth();

  // --- EFFECTS (생명주기 및 이벤트 리스너) ---

  // 스크롤 이벤트를 감지하여 isScrolled 상태를 업데이트합니다.
  // 컴포넌트 마운트 시 스크롤 이벤트 리스너를 등록하고, 언마운트 시 해제합니다.
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // 10px 이상 스크롤되면 isScrolled를 true로 설정하여 헤더에 스크롤 스타일 적용
      setIsScrolled(scrollTop > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너를 제거하여 메모리 누수 방지
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // 빈 의존성 배열: 컴포넌트가 처음 마운트될 때 한 번만 실행

  // 모바일 메뉴가 열려있을 때, 배경(body)의 스크롤을 막아 모바일 메뉴 사용성을 높입니다.
  // isMobileMenuOpen 상태가 변경될 때마다 실행됩니다.
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // 스크롤 방지
    } else {
      document.body.style.overflow = 'unset'; // 스크롤 허용
    }
    
    // 클린업 함수: 컴포넌트 언마운트 시 또는 isMobileMenuOpen이 false가 될 때 스크롤 방지 스타일을 초기화합니다.
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]); // isMobileMenuOpen 상태가 변경될 때마다 실행

  // --- EVENT HANDLERS (이벤트 처리 함수) ---

  // 모바일 메뉴의 열림/닫힘 상태를 토글합니다.
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 모바일 메뉴를 닫습니다.
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // --- RENDER (렌더링) ---
  return (
    <>
      {/* 헤더 본체. isScrolled 상태에 따라 'scrolled' 클래스가 추가/제거되어 스타일이 변경됩니다. */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* 웹사이트 로고 컴포넌트. 스크롤 상태를 prop으로 전달하여 로고 스타일을 동적으로 변경할 수 있습니다. */}
          <Logo isScrolled={isScrolled} />
          
          {/* 헤더 오른쪽 섹션: 데스크탑 뷰에서 주로 보이며, 네비게이션, 검색, 장바구니, 프로필/인증 버튼을 포함합니다. */}
          <div className={styles.rightSection}>
            {/* 메인 네비게이션 바. 스크롤 상태를 prop으로 전달합니다. */}
            <NavBar isScrolled={isScrolled} />
            {/* 검색 바. 스크롤 상태를 prop으로 전달합니다. */}
            <SearchBar isScrolled={isScrolled} />
            {/* 장바구니 아이콘 */}
            <CartIcon />
            
            {/* 사용자가 로그인(인증)된 경우에만 프로필 아이콘을 표시합니다. */}
            {isAuthenticated && <ProfileIcons />}
            
            {/* 인증 관련 버튼 (로그인/회원가입). 스크롤 상태를 prop으로 전달합니다. */}
            <AuthButtons isScrolled={isScrolled} />
          </div>
          
          {/* 모바일 뷰에서만 보이는 햄버거 버튼. 모바일 메뉴의 열림/닫힘 상태를 제어합니다. */}
          <HamburgerButton 
            isOpen={isMobileMenuOpen} // 모바일 메뉴 열림 상태
            onClick={toggleMobileMenu} // 클릭 시 모바일 메뉴 토글 함수 실행
            isScrolled={isScrolled} // 스크롤 상태
          />
        </div>
      </header>
      
      {/* 모바일 메뉴 컴포넌트. 화면 밖에서 대기하다가 isMobileMenuOpen 상태에 따라 나타납니다. */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} // 모바일 메뉴 열림 상태
        onClose={closeMobileMenu} // 메뉴 닫기 함수
        isScrolled={isScrolled} // 스크롤 상태
      />
    </>
  );
};

export default Header; // Header 컴포넌트를 내보냅니다.