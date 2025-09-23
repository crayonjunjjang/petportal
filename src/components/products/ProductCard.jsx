import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => price.toLocaleString();

  return (
    <Link to={`/products/${product.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img src={product.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={product.name} className={styles.cardImage} />
        <div className={styles.cardContent}>
          <p className={styles.brand}>{product.brand}</p>
          <h3 className={styles.name}>{product.name}</h3>
          
          {/* 👇 이 부분이 새로 추가된 태그 영역입니다! */}
          <div className={styles.tags}>
            {(product.tags || []).map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          <div className={styles.ratingInfo}>
            <span className={styles.rating}>
              {product.rating !== undefined && product.rating !== null ? `⭐ ${product.rating.toFixed(1)}` : ''}
            </span>
            <span className={styles.reviews}>
              {product.reviewCount !== undefined && product.reviewCount !== null ? `리뷰 ${product.reviewCount.toLocaleString()}` : ''}
            </span>
          </div>
          <p className={styles.price}>{formatPrice(product.price)}원</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;