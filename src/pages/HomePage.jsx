// src/pages/HomePage.jsx

// --- 파일 역할: 웹사이트의 메인 랜딩 페이지 (홈페이지) ---
// 이 컴포넌트는 웹사이트의 얼굴 역할을 하며, 다양한 주제의 섹션(Section) 컴포넌트들을 조합하여
// 사용자에게 서비스의 주요 기능과 콘텐츠를 시각적으로 보여줍니다.
// 각 섹션은 독립적인 컴포넌트로 분리되어 있어 유지보수 및 재사용이 용이합니다.

import React from 'react';
// 각 섹션 컴포넌트들을 임포트합니다.
import HeroSection from '../components/sections/HeroSection'; // 메인 비주얼 및 캐치프레이즈
import BestProductsSection from '../components/sections/BestProductsSection'; // 베스트 상품 소개
import TrustSection from '../components/sections/TrustSection'; // 서비스 신뢰도 강조
import PopularContentSection from '../components/sections/PopularContentSection'; // 인기 커뮤니티 콘텐츠
import TestimonialSection from '../components/sections/TestimonialSection'; // 고객 후기
import LocationServiceSection from '../components/sections/LocationServiceSection'; // 내 주변 서비스 찾기 (지도)
import QuickCategorySection from '../components/sections/QuickCategorySection'; // 빠른 카테고리 이동
import NewsSection from '../components/sections/NewsSection'; // 새소식 또는 이벤트
import styles from './HomePage.module.css'; // 홈페이지 전용 스타일

// --- HomePage Component ---
const HomePage = () => {
  return (
    <div className={styles.homePage}>
      {/* 
        App.jsx에서 Header와 Footer가 공통으로 관리되므로, 
        HomePage 자체에서는 Header/Footer를 렌더링하지 않습니다.
      */}
      <main>
        {/* 각 섹션 컴포넌트를 순서대로 렌더링합니다. */}
        <HeroSection />
        <BestProductsSection />
        <TrustSection />
        <PopularContentSection />
        <TestimonialSection />
        <LocationServiceSection />
        <QuickCategorySection />
        <NewsSection />
      </main>
    </div>
  );
};

export default HomePage;
