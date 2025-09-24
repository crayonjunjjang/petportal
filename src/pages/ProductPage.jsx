// React와 필요한 훅(useState, useEffect)을 가져옵니다.
import React, { useState, useEffect } from 'react';
// react-router-dom에서 Link 컴포넌트를 가져옵니다. 페이지 이동을 위해 사용됩니다.
import { Link } from 'react-router-dom';
// CSS 모듈 파일을 가져옵니다. 컴포넌트 스타일링을 위해 사용됩니다.
import styles from './ProductPage.module.css';
// 로컬 JSON 파일에서 모든 상품 데이터를 가져옵니다.
import allProducts from '../data/products.json'; 

/**
 * ProductPage 컴포넌트
 * - 반려용품 목록을 표시합니다.
 * - 카테고리 필터링, 검색, 정렬, 페이지네이션, 뷰 모드(격자/목록) 변경 기능을 제공합니다.
 */
const ProductPage = () => {
  // --- STATE MANAGEMENT (상태 관리) ---
    
  // products: 현재 페이지에 표시될 상품 목록을 저장하는 상태
    const [products, setProducts] = useState([]);
  // categories: 전체 상품에서 추출한 중복 없는 카테고리 목록을 저장하는 상태
    const [categories, setCategories] = useState([]);
  // loading: 데이터 처리 중(필터링, 정렬 등) 로딩 상태를 표시하기 위한 상태
    const [loading, setLoading] = useState(true);
  // currentPage: 현재 페이지 번호를 저장하는 상태
    const [currentPage, setCurrentPage] = useState(1);
  // totalPages: 전체 페이지 수를 저장하는 상태
    const [totalPages, setTotalPages] = useState(1);
  // selectedCategory: 사용자가 선택한 카테고리를 저장하는 상태
    const [selectedCategory, setSelectedCategory] = useState('');
  // searchTerm: 검색창에 입력된 검색어를 저장하는 상태
    const [searchTerm, setSearchTerm] = useState('');
  // sortBy: 정렬 기준('popularity', 'price-asc', 'price-desc', 'reviews')을 저장하는 상태
    const [sortBy, setSortBy] = useState('popularity'); 
  // viewMode: 상품 목록 표시 방식('grid' 또는 'list')을 저장하는 상태
    const [viewMode, setViewMode] = useState('grid'); 
    
  // --- EFFECTS (사이드 이펙트 처리) ---
    
  // useEffect: 특정 상태(dependency array 안의 값들)가 변경될 때마다 실행됩니다.
  // 상품 목록 필터링, 정렬, 페이지네이션 로직을 처리합니다.
    useEffect(() => {
    // 최초 렌더링 시, 전체 상품 데이터에서 중복 없는 카테고리 목록을 추출합니다.
    if (categories.length === 0) {
        const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
        setCategories(uniqueCategories);
    }

    // 데이터 처리 시작을 알리기 위해 로딩 상태를 true로 설정합니다.
    setLoading(true);
    
    // 필터링을 시작하기 위해 전체 상품 목록으로 초기화합니다.
    let filteredProducts = allProducts;
    
    // 1. 카테고리 필터링: 선택된 카테고리가 있다면 해당 카테고리의 상품만 필터링합니다.
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }
    // 2. 검색어 필터링: 검색어가 있다면 상품명에 검색어가 포함된 상품만 필터링합니다. (대소문자 구분 없음)
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 3. 정렬: sortBy 상태에 따라 상품 목록을 정렬합니다.
    //    sort() 메서드는 원본 배열을 변경하므로, allProducts의 복사본을 사용하는 것이 더 안전할 수 있습니다.
    //    (여기서는 매번 allProducts로부터 새로 필터링하므로 괜찮습니다.)
    if (sortBy === 'price-asc') { // 가격 낮은 순
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') { // 가격 높은 순
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'reviews') { // 리뷰 많은 순
        filteredProducts.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else { // 'popularity' (인기순, 기본값)
        filteredProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    // 4. 페이지네이션 처리
    const totalItems = filteredProducts.length; // 필터링 및 정렬된 전체 상품 수
    const itemsPerPage = 12; // 한 페이지에 보여줄 상품 수
    setTotalPages(Math.ceil(totalItems / itemsPerPage)); // 전체 페이지 수 계산
    
    // 현재 페이지에 해당하는 상품들만 잘라냅니다.
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // 화면에 표시될 상품 목록 상태를 업데이트합니다.
    setProducts(paginatedProducts);
    
    // 데이터 처리가 끝났으므로 로딩 상태를 false로 설정합니다.
    setLoading(false);
  // 의존성 배열: 이 배열 안의 값이 변경될 때마다 useEffect 콜백 함수가 다시 실행됩니다.
    }, [currentPage, selectedCategory, searchTerm, categories.length, sortBy]);

  // --- HANDLER FUNCTIONS (이벤트 핸들러 함수) ---
    
  // 카테고리 버튼 클릭 시 호출되는 함수
    const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName); // 선택된 카테고리 상태 변경
    setCurrentPage(1); // 카테고리 변경 시 1페이지로 초기화
    };

  // 검색 폼 제출 시 호출되는 함수
    const handleSearch = (e) => {
      e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막습니다.
      setCurrentPage(1); // 검색 시 1페이지로 초기화 (실제 검색 로직은 useEffect에서 searchTerm 변경에 따라 처리됨)
    };

  // 페이지 번호 버튼 클릭 시 호출되는 함수
    const handlePageChange = (page) => {
      setCurrentPage(page); // 현재 페이지 상태 변경
      window.scrollTo(0, 0); // 페이지 변경 시 화면 상단으로 스크롤 이동
    };

  // 정렬 버튼 클릭 시 호출되는 함수
    const handleSortChange = (sortType) => {
      setSortBy(sortType); // 정렬 기준 상태 변경
      setCurrentPage(1); // 정렬 기준 변경 시 1페이지로 초기화
    };

  // 가격을 원화(KRW) 형식으로 포맷하는 유틸리티 함수
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
    }).format(price);
    };

  // --- RENDER (화면 렌더링) ---
    return (
    <div className={styles.commonPageContainer}>
      {/* 페이지 헤더 */}
        <header className={styles.commonHeader}>
        <h1 className={styles.commonTitle}>반려용품</h1>
        <p className={styles.commonSubtitle}>우리 아이를 위한 특별한 용품들을 만나보세요</p>
        </header>

      {/* 컨트롤 영역: 필터, 검색, 정렬 등 */}
        <div className={styles.controlsContainer}>
        {/* 카테고리 필터 */}
        <div className={styles.categoryFilter}>
            {/* '전체' 카테고리 버튼 */}
            <button
                className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
                onClick={() => handleCategoryChange('')}
            >
                전체
            </button>
            {/* API나 파일에서 받아온 카테고리 목록을 동적으로 렌더링 */}
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
        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
            type="text"
            placeholder="상품명을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 입력값이 변경될 때마다 searchTerm 상태 업데이트
            className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>검색</button>
            </form>

        {/* 정렬 및 뷰 모드 컨테이너 */}
        <div className={styles.sortAndViewContainer}>
          {/* 정렬 옵션 */}
            <div className={styles.sortOptions}>
            <button className={`${styles.sortButton} ${sortBy === 'popularity' ? styles.active : ''}`} onClick={() => handleSortChange('popularity')}>인기순</button>
            <button className={`${styles.sortButton} ${sortBy === 'price-asc' ? styles.active : ''}`} onClick={() => handleSortChange('price-asc')}>가격낮은순</button>
            <button className={`${styles.sortButton} ${sortBy === 'price-desc' ? styles.active : ''}`} onClick={() => handleSortChange('price-desc')}>가격높은순</button>
            <button className={`${styles.sortButton} ${sortBy === 'reviews' ? styles.active : ''}`} onClick={() => handleSortChange('reviews')}>리뷰많은순</button>
            </div>
          {/* 뷰 모드 토글 (격자/목록) */}
            <div className={styles.viewToggle}>
            <button className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.active : ''}`} onClick={() => setViewMode('grid')}>격자</button>
            <button className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`} onClick={() => setViewMode('list')}>목록</button>
            </div>
        </div>
        </div>

      {/* 로딩 상태에 따른 조건부 렌더링 */}
        {loading ? (
        <div className={styles.loading}>상품을 불러오는 중...</div>
        ) : (
        <>
          {/* 상품 목록 그리드 */}
          {/* viewMode 상태에 따라 'listView' 클래스를 동적으로 추가/제거 */}
            <div className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {/* 상품이 있을 경우와 없을 경우를 나누어 렌더링 */}
            {products.length > 0 ? (
              // products 배열을 순회하며 각 상품에 대한 ProductCard를 렌더링
                products.map((product) => (
                <Link
                    key={product.id}
                  to={`/product/${product.id}`} // 클릭 시 상품 상세 페이지로 이동
                    className={styles.productCard}
                    >
                    <div className={styles.imageWrapper}>
                    {/* 상품 이미지. 이미지가 없으면 기본 이미지 표시 */}
                    <img
                        src={product.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'}
                        alt={product.name}
                        className={styles.productImage}
                    />
                    {/* BEST, 추천 뱃지 조건부 렌더링 */}
                    {product.isBest && <span className={styles.bestBadge}>BEST</span>}
                    {product.isFeatured && <span className={styles.featuredBadge}>추천</span>}
                    </div>
                    <div className={styles.productInfo}>
                    <div className={styles.category}>{product.category}</div>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    <div className={styles.productMeta}>
                        <span className={styles.price}>{formatPrice(product.price)}</span>
                      {/* 평점이 0보다 클 경우에만 평점 표시 */}
                        {product.rating > 0 && (
                        <div className={styles.rating}>
                            <span className={styles.stars}>⭐</span>
                            <span className={styles.ratingText}>{product.rating}</span>
                        </div>
                        )}
                    </div>
                    {/* 브랜드 정보가 있을 경우에만 표시 */}
                    {product.brand && <div className={styles.brand}>{product.brand}</div>}
                    </div>
                </Link>
                ))
            ) : (
              // 필터링/검색 결과 상품이 없을 때 메시지 표시
                <div className={styles.noProducts}>
                <p>검색 결과가 없습니다.</p>
                </div>
            )}
            </div>

          {/* 페이지네이션: 전체 페이지가 1보다 클 때만 표시 */}
            {totalPages > 1 && (
            <div className={styles.pagination}>
              {/* 이전 페이지 버튼 */}
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.pageButton}>이전</button>
              {/* 페이지 번호 버튼들 생성 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                  // 현재 페이지와 일치하는 버튼에 'active' 클래스 적용
                    className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                >
                    {page}
                </button>
                ))}
              {/* 다음 페이지 버튼 */}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.pageButton}>다음</button>
            </div>
            )}
        </>
        )}
    </div>
    );
};

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 내보냅니다.
export default ProductPage;