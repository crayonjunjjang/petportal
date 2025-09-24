// src/components/layout/Logo.jsx

// --- 파일 역할: 레이아웃의 일부로 사용되는 텍스트 기반 로고 컴포넌트 ---
// 이 컴포넌트는 'PetPortal 삐삐'라는 텍스트 로고를 표시하며, 클릭 시 웹사이트의 홈 페이지('/')로 이동하는 링크 역할을 합니다.
// `isScrolled` prop을 받아 스크롤 상태에 따라 다른 스타일(클래스)을 적용할 수 있어,
// 헤더 내에서 로고의 시각적 변화를 동적으로 제어할 수 있습니다.
// 참고: `common/Logo.jsx`와는 별개의, 더 간단한 버전의 로고 컴포넌트입니다.

import React from 'react'; // React 라이브러리 임포트
import { Link } from 'react-router-dom'; // React Router를 사용하여 내부 페이지 이동을 위한 Link 컴포넌트 임포트
import styles from './Logo.module.css'; // 로고 전용 스타일을 위한 CSS 모듈 임포트

// --- Logo Component ---
// props:
//   - isScrolled: boolean 타입. 부모 컴포넌트(예: Header)로부터 전달받는 스크롤 상태를 나타냅니다.
//                 이 값에 따라 로고의 스타일이 동적으로 변경될 수 있습니다.
const Logo = ({ isScrolled }) => {
  // `isScrolled` 값에 따라 `styles.scrolled` 클래스를 동적으로 추가/제거하여
  // 스크롤 상태에 따른 로고의 시각적 변화를 제어합니다.
  const logoClasses = `${styles.logo} ${isScrolled ? styles.scrolled : ''}`;

  return (
    // <Link> 컴포넌트를 사용하여 'PetPortal 삐삐' 텍스트를 홈 페이지로 이동하는 링크로 만듭니다.
    // `className` prop에 동적으로 생성된 `logoClasses`를 적용합니다.
    <Link to="/" className={logoClasses}>PetPortal 삐삐</Link>
  );
};

export default Logo; // Logo 컴포넌트를 내보냅니다.