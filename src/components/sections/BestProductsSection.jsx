// src/components/sections/BestProductsSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BestProductsSection.module.css';
import allProducts from '../../data/products.json'; // Import local data

const BestProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    try {
      const categoriesToFeature = ['사료', '간식', '장난감', '의류', '리빙'];
      const bestProducts = categoriesToFeature.map(category => {
        const productsInCategory = allProducts.filter(p => p.category === category);
        if (productsInCategory.length === 0) {
          return null;
        }
        // Sort by rating, then by reviewCount as a tie-breaker
        productsInCategory.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.reviewCount - a.reviewCount;
        });
        return productsInCategory[0];
      }).filter(Boolean); // Filter out any nulls if a category had no products

      setProducts(bestProducts);
    } catch (error) {
      console.error('카테고리별 베스트 상품 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAllClick = () => {
    navigate('/product');
  };

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

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>카테고리별 베스트 상품</h2>
          <p className={styles.subtitle}>삐삐 유저들이 가장 많이 선택한 카테고리별 인기 상품이에요.</p>
          <button onClick={handleViewAllClick} className={styles.viewMore}>
            반려용품 전체보기 &gt;
          </button>
        </div>
        <div className={styles.grid}>
          {products.map((product) => (
            <div 
              key={product.id} 
              className={styles.card}
              onClick={() => handleProductClick(product.id)}
            >
              <div className={styles.imageWrapper}>
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'} 
                  alt={product.name} 
                  className={styles.image} 
                />
                <span className={styles.categoryBadge}>{product.category}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.productInfo}>
                  <p className={styles.productPrice}>{formatPrice(product.price)}</p>
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

export default BestProductsSection;