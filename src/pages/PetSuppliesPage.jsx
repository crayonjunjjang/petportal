import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './PetSuppliesPage.module.css';
import '../styles/commonPage.css';
import allProducts from '../data/products.json'; // 모든 상품 데이터를 로컬 JSON 파일에서 가져옵니다.

// PetSuppliesPage: 반려용품 목록을 표시하고, 카테고리 필터링, 검색, 페이지네이션 기능을 제공하는 페이지 컴포넌트입니다.
const PetSuppliesPage = () => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'price-asc', 'price-desc', 'reviews'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // --- HOOKS ---

  // --- EFFECTS ---
  useEffect(() => {
    if (categories.length === 0) {
      const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
      setCategories(uniqueCategories);
    }

    setLoading(true);
    
    let filteredProducts = allProducts;
    
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
    if (sortBy === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'reviews') {
      filteredProducts.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else { // popularity
      filteredProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    const totalItems = filteredProducts.length;
    const itemsPerPage = 12;
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
    
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    setProducts(paginatedProducts);
    
    setLoading(false);
  }, [currentPage, selectedCategory, searchTerm, categories.length, sortBy]);

  // --- HANDLER FUNCTIONS ---
  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  // --- RENDER ---
  return (
    <div className="common-page-container">
      <header className="common-header">
        <h1 className="common-title">반려용품</h1>
        <p className="common-subtitle">우리 아이를 위한 특별한 용품들을 만나보세요</p>
      </header>

      <div className={styles.controlsContainer}>
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

        <div className={styles.sortAndViewContainer}>
          <div className={styles.sortOptions}>
            <button className={`${styles.sortButton} ${sortBy === 'popularity' ? styles.active : ''}`} onClick={() => handleSortChange('popularity')}>인기순</button>
            <button className={`${styles.sortButton} ${sortBy === 'price-asc' ? styles.active : ''}`} onClick={() => handleSortChange('price-asc')}>가격낮은순</button>
            <button className={`${styles.sortButton} ${sortBy === 'price-desc' ? styles.active : ''}`} onClick={() => handleSortChange('price-desc')}>가격높은순</button>
            <button className={`${styles.sortButton} ${sortBy === 'reviews' ? styles.active : ''}`} onClick={() => handleSortChange('reviews')}>리뷰많은순</button>
          </div>
          <div className={styles.viewToggle}>
            <button className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.active : ''}`} onClick={() => setViewMode('grid')}>격자</button>
            <button className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`} onClick={() => setViewMode('list')}>목록</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>상품을 불러오는 중...</div>
      ) : (
        <>
          <div className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product.id}
                  to={`/pet-supplies/${product.id}`}
                  className={styles.productCard}
                >
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
