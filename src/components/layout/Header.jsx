// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import Logo from '../common/Logo';
import NavBar from '../common/NavBar';
import SearchBar from '../common/SearchBar';
import HamburgerButton from '../common/HamburgerButton';
import MobileMenu from '../common/MobileMenu';
import CartIcon from '../common/CartIcon';
import ProfileIcons from '../profile/ProfileIcons'; // ProfileIcons 재임포트
import AuthButtons from '../common/AuthButtons'; // AuthButtons 임포트
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext'; // useAuth 임포트

const Header = () => {
  console.log('Header: Component rendering.');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 모바일 메뉴가 열려있을 때 body 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Logo isScrolled={isScrolled} />
          
          <div className={styles.rightSection}>
            {/* 데스크톱 컴포넌트들 - 개별 위치 설정 */}
            <NavBar isScrolled={isScrolled} />
            <SearchBar isScrolled={isScrolled} />
            <CartIcon />
            {isAuthenticated && (
              <>
                <ProfileIcons />
                {console.log('Header: Authenticated, rendering ProfileIcons.')}
              </>
            )} {/* 인증된 경우에만 ProfileIcons 렌더링 */}
            <AuthButtons isScrolled={isScrolled} />
          </div>
          
          {/* 모바일 햄버거 버튼 */}
          <HamburgerButton 
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
            isScrolled={isScrolled}
          />
        </div>
      </header>
      
      {/* 모바일 메뉴 */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        isScrolled={isScrolled}
      />
    </>
  );
};

export default Header;
