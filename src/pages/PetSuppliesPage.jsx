// src/pages/PetSuppliesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './PetSuppliesPage.module.css';
import allProducts from '../data/products.json'; // 모든 상품 데이터를 로컬 JSON 파일에서 가져옵니다.

// PetSuppliesPage: 반려용품 목록을 표시하고, 카테고리 필터링, 검색, 페이지네이션 기능을 제공하는 페이지 컴포넌트입니다.
const PetSuppliesPage = () => {
  // --- STATE MANAGEMENT ---
  // products: 현재 페이지에 보여줄 상품 목록
  const [products, setProducts] = useState([]);
  // categories: 전체 상품 데이터에서 추출한 카테고리 목록
  const [categories, setCategories] = useState([]);
  // loading: 데이터 로딩 상태
  const [loading, setLoading] = useState(true);
  // currentPage: 현재 페이지 번호
  const [currentPage, setCurrentPage] = useState(1);
  // totalPages: 전체 페이지 수
  const [totalPages, setTotalPages] = useState(1);
  // selectedCategory: 사용자가 선택한 카테고리
  const [selectedCategory, setSelectedCategory] = useState('');
  // searchTerm: 사용자가 입력한 검색어
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- HOOKS ---
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const { category } = useParams(); // URL 파라미터에서 카테고리 값을 가져옵니다. (e.g., /pet-supplies/category/사료)

  // --- EFFECTS ---
  // 상품 데이터 필터링 및 페이지네이션을 처리하는 메인 로직입니다.
  // currentPage, selectedCategory, searchTerm, category(URL 파라미터)가 변경될 때마다 실행됩니다.
  useEffect(() => {
    // 1. 카테고리 목록 설정 (최초 렌더링 시 한 번만 실행)
    if (categories.length === 0) {
      const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
      setCategories(uniqueCategories);
    }

    setLoading(true);
    
    // 2. 필터링 적용
    let filteredProducts = allProducts;
    const currentCategory = category || selectedCategory; // URL 파라미터 카테고리를 우선 적용
    
    if (currentCategory) {
      filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. 페이지네이션 계산
    const totalItems = filteredProducts.length;
    const itemsPerPage = 12;
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
    
    // 4. 현재 페이지에 해당하는 상품 목록 슬라이싱
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    setProducts(paginatedProducts);
    
    setLoading(false);
  }, [currentPage, selectedCategory, searchTerm, category, categories.length]);

  // URL 파라미터로 카테고리가 들어온 경우, selectedCategory 상태를 업데이트합니다.
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  // --- HANDLER FUNCTIONS ---
  // 카테고리 버튼 클릭 시 호출되는 함수
  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1); // 카테고리 변경 시 1페이지로 초기화
    // URL을 변경하여 사용자가 현재 필터 상태를 북마크하거나 공유할 수 있도록 합니다.
    navigate(categoryName ? `/pet-supplies/category/${categoryName}` : '/pet-supplies');
  };

  // 검색 폼 제출 시 호출되는 함수
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 1페이지로 초기화
  };

  // 페이지 번호 변경 시 호출되는 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // 페이지 변경 시 화면 상단으로 스크롤
  };

  // 가격을 원화 형식으로 포맷하는 헬퍼 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  // --- RENDER ---
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>반려용품</h1>
        <p className={styles.subtitle}>우리 아이를 위한 특별한 용품들을 만나보세요</p>
      </div>

      {/* 필터 및 검색 섹션 */}
      <div className={styles.filterSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="상품명을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>검색</button>
        </form>

        <div className={styles.categoryFilter}>
          <button
            className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryButton} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 또는 로딩/결과 없음 표시 */}
      {loading ? (
        <div className={styles.loading}>상품을 불러오는 중...</div>
      ) : (
        <>
          <div className={styles.productsGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product.id}
                  to={`/pet-supplies/${product.id}`}
                  className={styles.productCard}
                >
                  {/* 상품 카드 UI */}
                  <div className={styles.imageWrapper}>
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    {product.isBest && <span className={styles.bestBadge}>BEST</span>}
                    {product.isFeatured && <span className={styles.featuredBadge}>추천</span>}
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.category}>{product.category}</div>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    <div className={styles.productMeta}>
                      <span className={styles.price}>{formatPrice(product.price)}</span>
                      {product.rating > 0 && (
                        <div className={styles.rating}>
                          <span className={styles.stars}>⭐</span>
                          <span className={styles.ratingText}>{product.rating}</span>
                        </div>
                      )}
                    </div>
                    {product.brand && <div className={styles.brand}>{product.brand}</div>}
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.noProducts}>
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 UI */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.pageButton}>이전</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                >
                  {page}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.pageButton}>다음</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PetSuppliesPage;