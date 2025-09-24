// src/components/common/Logo.jsx

// --- 파일 역할: 웹사이트의 로고를 표시하는 공통 컴포넌트 ---
// 이 컴포넌트는 로고 이미지와 텍스트를 함께 렌더링하며, 클릭 시 웹사이트의 홈 페이지('/')로 이동하는 링크 역할을 합니다.
// `isScrolled` prop을 받아 스크롤 상태에 따라 다른 스타일을 적용할 수 있어,
// 헤더가 축소되거나 확장될 때 로고의 크기나 위치 등을 동적으로 변경하는 데 사용됩니다.

import React from 'react'; // React 라이브러리 임포트
import { Link } from 'react-router-dom'; // React Router를 사용하여 내부 페이지 이동을 위한 Link 컴포넌트 임포트
import styles from './Logo.module.css'; // 로고 전용 스타일을 위한 CSS 모듈 임포트
import logoImage from '../../assets/image/logo3.png'; // 로고 이미지 파일 임포트 (실제 이미지 경로)

// --- Logo Component ---
// props:
//   - isScrolled: boolean 타입. 부모 컴포넌트(예: Header)로부터 전달받는 스크롤 상태를 나타냅니다.
//                 이 값에 따라 로고 컨테이너의 스타일이 동적으로 변경될 수 있습니다.
const Logo = ({ isScrolled }) => {
  return (
    // <Link> 컴포넌트를 사용하여 로고 전체(이미지 + 텍스트)를 홈 페이지로 이동하는 링크로 만듭니다.
    // `className` prop에 `styles.logoContainer` 기본 스타일과 `isScrolled` 상태에 따른 `styles.scrolled` 클래스를 동적으로 적용합니다.
    <Link to="/" className={`${styles.logoContainer} ${isScrolled ? styles.scrolled : ''}`}>
      {/* 로고 이미지 영역 */}
      <div className={styles.logoImage}>
        {/* 실제 로고 이미지. `alt` 속성은 접근성을 위해 이미지 설명을 제공합니다. */}
        <img src={logoImage} alt="삐삐 PetPortal Logo" className={styles.logoImg} />
      </div>
      {/* 로고 텍스트 영역 */}
      <span className={styles.logoText}>삐삐 PetPortal</span>
    </Link>
  );
};

export default Logo; // Logo 컴포넌트를 내보냅니다.