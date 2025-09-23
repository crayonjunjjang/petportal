// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  // 스크롤 상태를 관리하기 위한 state
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      // 초기 상태 동기화
      handleScroll();
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // 서브 페이지에서는 항상 스크롤된 스타일 유지
      setIsScrolled(true);
    }
  }, [location.pathname]);

  // isScrolled 상태에 따라 'scrolled' 클래스를 동적으로 추가
  const headerClasses = `${styles.header} ${isScrolled ? styles.scrolled : ''}`;

  return (
    <header className={headerClasses}>
      <div className={`${styles.headerContent} container`}>
        <Link to="/" className={styles.logo}>PETMILY</Link>
        <nav className={styles.nav}>
          <ul>
            <li><NavLink to="/grooming" className={({ isActive }) => isActive ? styles.active : ''}>미용</NavLink></li>
            <li><NavLink to="/hospital" className={({ isActive }) => isActive ? styles.active : ''}>병원</NavLink></li>
            <li><NavLink to="/hotel" className={({ isActive }) => isActive ? styles.active : ''}>호텔</NavLink></li>
            <li><NavLink to="/cafe" className={({ isActive }) => isActive ? styles.active : ''}>카페</NavLink></li>
          </ul>
        </nav>
        <div className={styles.authActions}>
          <a href="#" className={styles.loginLink}>로그인</a>
          <a href="#" className={styles.signupButton}>회원가입</a>
        </div>
      </div>
    </header>
  );
};

export default Header;