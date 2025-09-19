// src/pages/PetSupplyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PetSupplyDetailPage.module.css';
import allProducts from '../data/products.json'; // 모든 상품 데이터를 로컬 JSON 파일에서 가져옵니다.
import { useCart } from '../contexts/CartContext'; // 장바구니 컨텍스트를 사용하기 위해 import
import QuantitySelector from '../components/ui/QuantitySelector'; // 재사용 가능한 수량 선택 컴포넌트 import

// PetSupplyDetailPage: 단일 반려용품의 상세 정보를 보여주는 페이지 컴포넌트입니다.
const PetSupplyDetailPage = () => {
  // --- STATE MANAGEMENT ---
  // product: 현재 페이지에 표시할 상품의 상세 데이터
  const [product, setProduct] = useState(null);
  // loading: 데이터 로딩 상태
  const [loading, setLoading] = useState(true);
  // error: 데이터 로딩 중 발생한 에러 메시지
  const [error, setError] = useState(null);
  // quantity: 사용자가 선택한 상품 수량
  const [quantity, setQuantity] = useState(1);
  
  // --- HOOKS ---
  const { id } = useParams(); // URL 파라미터에서 상품 ID를 가져옵니다. (e.g., /pet-supplies/1)
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const { actions } = useCart(); // useCart 훅을 통해 장바구니에 상품을 추가하는 함수를 가져옵니다.

  // --- EFFECTS ---
  // 컴포넌트 마운트 시 또는 상품 ID가 변경될 때, 해당 ID의 상품 데이터를 찾습니다.
  useEffect(() => {
    setLoading(true);
    // URL 파라미터로 받은 id는 문자열이므로, 숫자형 ID와 비교하기 위해 Number()로 변환합니다.
    const foundProduct = allProducts.find(p => p.id === Number(id));

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setError('상품을 찾을 수 없습니다.');
    }
    setLoading(false);
  }, [id]);

  // --- HANDLER FUNCTIONS ---
  // '장바구니 담기' 버튼 클릭 시 실행되는 함수
  const handleAddToCart = () => {
    if (product) {
      // 장바구니 컨텍스트의 addToCart 함수를 호출하여 상품과 수량을 전달합니다.
      actions.addToCart(product, quantity);
    }
  };

  // 가격을 원화 형식으로 포맷하는 헬퍼 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  // '뒤로가기' 또는 '목록으로' 버튼 클릭 시 이전 페이지로 이동하는 함수
  const handleBackClick = () => {
    navigate(-1);
  };

  // 상품 카테고리(breadcrumb) 클릭 시 해당 카테고리 페이지로 이동하는 함수
  const handleCategoryClick = () => {
    navigate(`/pet-supplies/category/${product.category}`);
  };

  // --- RENDER ---
  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>상품 정보를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 발생 또는 상품 데이터가 없을 때 표시할 UI
  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <button onClick={handleBackClick} className={styles.backButton}>돌아가기</button>
        </div>
      </div>
    );
  }

  // 상품 상세 정보 렌더링
  return (
    <div className={styles.container}>
      {/* Breadcrumb 네비게이션 */}
      <div className={styles.breadcrumb}>
        <button onClick={() => navigate('/pet-supplies')} className={styles.breadcrumbLink}>반려용품</button>
        <span className={styles.separator}>&gt;</span>
        <button onClick={handleCategoryClick} className={styles.breadcrumbLink}>{product.category}</button>
        <span className={styles.separator}>&gt;</span>
        <span className={styles.currentPage}>{product.name}</span>
      </div>

      <div className={styles.productDetail}>
        <div className={styles.imageSection}>
          {/* 상품 이미지 및 뱃지 */}
          <div className={styles.mainImageWrapper}>
            <img src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600'} alt={product.name} className={styles.mainImage} />
            {product.isBest && <span className={styles.bestBadge}>BEST</span>}
            {product.isFeatured && <span className={styles.featuredBadge}>추천</span>}
          </div>
        </div>

        <div className={styles.infoSection}>
          {/* 상품 정보 */}
          <div className={styles.category}>{product.category}</div>
          <h1 className={styles.productName}>{product.name}</h1>
          {product.brand && <div className={styles.brand}>브랜드: {product.brand}</div>}
          
          {/* 평점 */}
          <div className={styles.rating}>
            {product.rating > 0 && (
              <>
                <span className={styles.stars}>{'⭐'.repeat(Math.floor(product.rating))}</span>
                <span className={styles.ratingText}>{product.rating}</span>
                {product.reviewCount > 0 && <span className={styles.reviewCount}>({product.reviewCount}개 리뷰)</span>}
              </>
            )}
          </div>

          {/* 가격 (수량에 따라 동적으로 변경) */}
          <div className={styles.price}>
            <span className={styles.currentPrice}>{formatPrice(product.price * quantity)}</span>
          </div>

          <div className={styles.description}>
            <h3>상품 설명</h3>
            <p>{product.description}</p>
          </div>

          <div className={styles.stockInfo}>
            <span className={styles.stockLabel}>재고:</span>
            <span className={`${styles.stockStatus} ${product.stockQuantity > 0 ? styles.inStock : styles.outOfStock}`}>
              {product.stockQuantity > 0 ? `${product.stockQuantity}개 남음` : '품절'}
            </span>
          </div>

          {/* 수량 선택 컴포넌트 */}
          <QuantitySelector 
            quantity={quantity}
            onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
            onIncrement={() => setQuantity(q => q + 1)}
            onQuantityChange={setQuantity}
          />

          {/* 액션 버튼 (장바구니, 바로 구매) */}
          <div className={styles.actions}>
            <button className={styles.cartButton} disabled={product.stockQuantity === 0} onClick={handleAddToCart}>장바구니 담기</button>
            <button className={styles.buyButton} disabled={product.stockQuantity === 0}>바로 구매</button>
          </div>

          {/* 추가 정보 */}
          <div className={styles.productInfo}>
            <h3>상품 정보</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>카테고리</span>
                <span className={styles.infoValue}>{product.category}</span>
              </div>
              {product.brand && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>브랜드</span>
                  <span className={styles.infoValue}>{product.brand}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>등록일</span>
                <span className={styles.infoValue}>{new Date(product.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.backToList}>
        <button onClick={handleBackClick} className={styles.backButton}>목록으로 돌아가기</button>
      </div>
    </div>
  );
};

export default PetSupplyDetailPage;