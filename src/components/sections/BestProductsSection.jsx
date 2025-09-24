// src/components/sections/BestProductsSection.jsx

// --- 파일 역할: 메인 페이지에 표시되는 '카테고리별 베스트 상품' 섹션 ---
// 이 컴포넌트는 미리 정의된 각 카테고리에서 가장 인기 있는 상품(베스트 상품) 하나씩을 선정하여 보여줍니다.
// 데이터는 로컬 `products.json` 파일에서 가져오며, 평점(rating)과 리뷰 수(reviewCount)를 기준으로
// 베스트 상품을 선정합니다. 사용자에게 인기 상품을 빠르게 탐색할 수 있는 기능을 제공합니다.

import React, { useState, useEffect } from 'react'; // React 및 상태 관리를 위한 useState, 부수 효과를 위한 useEffect 훅 임포트
import { useNavigate } from 'react-router-dom'; // React Router를 사용하여 페이지 이동을 위한 useNavigate 훅 임포트
import styles from './BestProductsSection.module.css'; // 컴포넌트의 스타일을 위한 CSS 모듈 임포트
import allProducts from '../../data/products.json'; // 모든 상품 데이터가 담긴 JSON 파일 임포트

// --- BestProductsSection Component ---
// 메인 페이지에 카테고리별 베스트 상품을 표시하는 함수형 컴포넌트
const BestProductsSection = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  // products: 화면에 표시할 선정된 베스트 상품 목록을 저장하는 상태
  const [products, setProducts] = useState([]);
  // loading: 데이터 로딩 상태를 나타내는 boolean 값 (로딩 중 UI 표시 등에 사용)
  const [loading, setLoading] = useState(true);
  // navigate: 특정 경로로 프로그래밍 방식 탐색을 가능하게 하는 함수
  const navigate = useNavigate();

  // --- EFFECTS (데이터 처리 및 생명주기) ---
  // 컴포넌트가 마운트될 때 한 번만 실행되어 상품 데이터를 처리하고 베스트 상품을 선정합니다.
  useEffect(() => {
    setLoading(true); // 데이터 로딩 시작
    try {
      // 베스트 상품을 보여줄 카테고리 목록을 정의합니다.
      const categoriesToFeature = ['사료', '간식', '장난감', '의류', '리빙'];
      
      // 각 카테고리별로 베스트 상품을 선정하는 로직
      const bestProducts = categoriesToFeature.map(category => {
        // 1. 현재 카테고리에 해당하는 상품들만 필터링합니다.
        const productsInCategory = allProducts.filter(p => p.category === category);
        
        // 해당 카테고리에 상품이 없으면 null을 반환하고 다음 카테고리로 넘어갑니다.
        if (productsInCategory.length === 0) {
          return null;
        }
        
        // 2. 필터링된 상품들을 평점(rating)을 기준으로 내림차순 정렬합니다.
        //    평점이 같을 경우, 리뷰 수(reviewCount)를 기준으로 다시 내림차순 정렬하여 최종 순위를 결정합니다.
        productsInCategory.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating; // 평점이 다르면 평점으로 정렬
          }
          return b.reviewCount - a.reviewCount; // 평점이 같으면 리뷰 수로 정렬
        });
        
        // 3. 정렬된 목록에서 가장 첫 번째 상품(가장 높은 평점/리뷰 수)을 해당 카테고리의 베스트 상품으로 반환합니다.
        return productsInCategory[0];
      }).filter(Boolean); // `filter(Boolean)`을 사용하여 null 값 (상품이 없는 카테고리)을 최종 배열에서 제거합니다.

      setProducts(bestProducts); // 선정된 베스트 상품들로 상태를 업데이트합니다.
    } catch (error) {
      // 상품 데이터 처리 중 오류 발생 시 콘솔에 에러를 기록합니다.
      console.error('카테고리별 베스트 상품 조회 실패:', error);
    } finally {
      setLoading(false); // 데이터 로딩 완료
    }
  }, []); // 빈 의존성 배열: 컴포넌트가 처음 마운트될 때만 이 효과를 실행합니다.

  // --- HELPER FUNCTIONS & EVENT HANDLERS (도우미 함수 및 이벤트 핸들러) ---

  // 숫자를 한국 원화(KRW) 형식의 문자열로 변환하는 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  // 상품 카드 클릭 시 해당 상품의 상세 페이지로 이동하는 함수
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // React Router의 navigate 함수를 사용하여 경로 이동
  };

  // '전체보기' 버튼 클릭 시 전체 상품 목록 페이지로 이동하는 함수
  const handleViewAllClick = () => {
    navigate('/product'); // 모든 상품을 볼 수 있는 페이지로 이동
  };

  // --- RENDER (렌더링) ---

  // 데이터 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>카테고리별 베스트 상품</h2>
          </div>
          <div className={styles.loading}>상품을 불러오는 중...</div>
        </div>
      </section>
    );
  }

  // 로딩 완료 후 베스트 상품 목록을 표시할 UI
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 섹션 헤더: 제목, 부제목, 전체보기 버튼 포함 */}
        <div className={styles.header}>
          <h2 className={styles.title}>카테고리별 베스트 상품</h2>
          <p className={styles.subtitle}>삐삐 유저들이 가장 많이 선택한 카테고리별 인기 상품이에요.</p>
          {/* 전체 상품 목록 페이지로 이동하는 버튼 */}
          <button onClick={handleViewAllClick} className={styles.viewMore}>
            반려용품 전체보기 &gt;
          </button>
        </div>
        {/* 베스트 상품들을 그리드 형태로 표시 */}
        <div className={styles.grid}>
          {products.map((product) => (
            // 각 상품 카드를 클릭 가능하게 만들고 상세 페이지로 연결
            <div 
              key={product.id} 
              className={styles.card}
              onClick={() => handleProductClick(product.id)} // 클릭 이벤트 핸들러 연결
            >
              {/* 상품 이미지 영역 */}
              <div className={styles.imageWrapper}>
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'} // 상품 이미지가 없으면 기본 이미지 사용
                  alt={product.name} 
                  className={styles.image} 
                />
                {/* 카테고리 배지 */}
                <span className={styles.categoryBadge}>{product.category}</span>
              </div>
              {/* 상품 정보 영역 */}
              <div className={styles.cardBody}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.productInfo}>
                  {/* 상품 가격 (원화 형식으로 포맷) */}
                  <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                  {/* 평점 정보 (평점이 0보다 클 경우에만 표시) */}
                  {product.rating > 0 && (
                    <div className={styles.rating}>
                      <span className={styles.stars}>⭐</span>
                      <span className={styles.ratingText}>{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestProductsSection; // BestProductsSection 컴포넌트를 내보냅니다.