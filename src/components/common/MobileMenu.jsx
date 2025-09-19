// src/components/common/MobileMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MobileMenu.module.css';

const MobileMenu = ({ isOpen, onClose, isScrolled }) => {
  const handleLinkClick = () => {
    onClose();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value.trim();
    if (searchQuery) {
      console.log('모바일 검색어:', searchQuery);
      onClose();
    }
  };

  return (
    <>
      {/* 오버레이 */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
      />
      
      {/* 사이드바 메뉴 */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <h3>메뉴</h3>
        </div>
        
        <nav className={styles.menuNav}>
          <Link to="/grooming" onClick={handleLinkClick}>미용</Link>
          <Link to="/cafe" onClick={handleLinkClick}>카페</Link>
          <Link to="/pet-supplies" onClick={handleLinkClick}>반려용품</Link>
          <Link to="/hospital" onClick={handleLinkClick}>병원</Link>
          <Link to="/hotel" onClick={handleLinkClick}>호텔</Link>
          <Link to="/pet-friendly-lodging" onClick={handleLinkClick}>반려동반 숙소</Link>
          <Link to="/community" onClick={handleLinkClick}>커뮤니티</Link>
          <Link to="/cart" onClick={handleLinkClick}>🛒 장바구니</Link>
        </nav>
        
        <div className={styles.menuSearch}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              name="search"
              placeholder="검색..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </form>
        </div>
        
        <div className={styles.menuAuth}>
          <Link to="/login" onClick={handleLinkClick} className={styles.loginLink}>
            로그인
          </Link>
          <Link to="/signup" onClick={handleLinkClick} className={styles.signupButton}>
            회원가입
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;