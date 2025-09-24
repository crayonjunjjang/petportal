// src/components/common/NavBar.jsx

// --- 파일 역할: 데스크탑 환경의 헤더에 표시되는 메인 네비게이션 바 ---
// 이 컴포넌트는 웹사이트의 주요 서비스(미용, 카페, 병원 등)로 바로 이동할 수 있는 링크 목록을 제공합니다.
// `isScrolled` prop을 받아 스크롤 상태에 따라 다른 스타일을 적용할 수 있어,
// 헤더의 동적인 디자인 변화에 유연하게 대응합니다.

import React from 'react'; // React 라이브러리 임포트
import { Link } from 'react-router-dom'; // React Router를 사용하여 내부 페이지 이동을 위한 Link 컴포넌트 임포트
import styles from './NavBar.module.css'; // 네비게이션 바 전용 스타일을 위한 CSS 모듈 임포트

// --- NavBar Component ---
// props:
//   - isScrolled: 부모 컴포넌트(주로 Header)로부터 전달받는 스크롤 상태를 나타내는 boolean 값.
//                 이 값에 따라 네비게이션 바의 스타일이 동적으로 변경될 수 있습니다.
const NavBar = ({ isScrolled }) => {
  return (
    // <nav> 태그는 네비게이션 링크들의 컨테이너 역할을 합니다.
    // `isScrolled` 값에 따라 `styles.scrolled` 클래스를 동적으로 추가/제거하여
    // 스크롤 상태에 따른 시각적 변화를 줍니다.
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      {/* 각 Link 컴포넌트는 웹사이트의 특정 페이지로 이동하는 네비게이션 아이템입니다. */}
      <Link to="/grooming">미용</Link> {/* 미용 서비스 페이지로 이동 */}
      <Link to="/cafe">카페</Link> {/* 카페 서비스 페이지로 이동 */}
      <Link to="/hospital">병원</Link> {/* 병원 서비스 페이지로 이동 */}
      <Link to="/hotel">호텔</Link> {/* 호텔 서비스 페이지로 이동 */}
      <Link to="/pet-friendly-lodging">동반숙소</Link> {/* 반려동물 동반 숙소 페이지로 이동 */}
      <Link to="/product">반려용품</Link> {/* 반려동물 용품 쇼핑 페이지로 이동 */}
      <Link to="/community">커뮤니티</Link> {/* 커뮤니티 게시판 페이지로 이동 */}
      <Link to="/support">고객센터</Link> {/* 고객센터 페이지로 이동 */}
    </nav>
  );
};

export default NavBar; // NavBar 컴포넌트를 내보냅니다.