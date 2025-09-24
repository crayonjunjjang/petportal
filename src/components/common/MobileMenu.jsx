// src/components/common/MobileMenu.jsx

// --- 파일 역할: 모바일 환경에서 사용되는 사이드 메뉴 컴포넌트 ---
// 이 컴포넌트는 화면이 작을 때 나타나는 햄버거 버튼을 클릭하면 화면 옆에서 슬라이드되어 나오는 메뉴입니다.
// 메뉴에는 주요 서비스 링크, 검색창, 로그인/회원가입 버튼이 포함되어 있습니다.

import React from 'react';
import { Link } from 'react-router-dom'; // 내부 페이지 이동을 위한 Link 컴포넌트
import styles from './MobileMenu.module.css'; // 모바일 메뉴 전용 스타일

// --- MobileMenu Component ---
// isOpen: 메뉴의 열림/닫힘 상태
// onClose: 메뉴를 닫는 함수
const MobileMenu = ({ isOpen, onClose }) => {
  // 메뉴 안의 링크를 클릭했을 때 메뉴를 닫기 위한 함수
  const handleLinkClick = () => {
    onClose();
  };

  // 검색 폼 제출 시 실행되는 함수
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 폼 기본 동작(새로고침) 방지
    const searchQuery = e.target.search.value.trim(); // 입력된 검색어
    if (searchQuery) {
      console.log('모바일 검색어:', searchQuery); // 검색 기능 구현 필요
      onClose(); // 검색 후 메뉴 닫기
    }
  };

  return (
    <>
      {/* 
        메뉴가 열렸을 때 화면의 나머지 부분을 덮는 반투명 오버레이.
        클릭하면 메뉴가 닫힙니다.
      */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
      />
      
      {/* 사이드바 메뉴 본체 */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <h3>메뉴</h3>
        </div>
        
        {/* 네비게이션 링크 */}
        <nav className={styles.menuNav}>
          <Link to="/grooming" onClick={handleLinkClick}>미용</Link>
          <Link to="/cafe" onClick={handleLinkClick}>카페</Link>
          <Link to="/hospital" onClick={handleLinkClick}>병원</Link>
          <Link to="/hotel" onClick={handleLinkClick}>호텔</Link>
          <Link to="/pet-friendly-lodging" onClick={handleLinkClick}>반려동반 숙소</Link>
          <Link to="/product" onClick={handleLinkClick}>반려용품</Link>
          <Link to="/community" onClick={handleLinkClick}>커뮤니티</Link>
          <Link to="/cart" onClick={handleLinkClick}>🛒 장바구니</Link>
        </nav>
        
        {/* 검색창 */}
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
        
        {/* 로그인/회원가입 버튼 */}
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
