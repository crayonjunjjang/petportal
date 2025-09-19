import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PensionCard.module.css';

const PensionCard = ({ pension }) => {
  const formatPrice = (price) => {
    if (typeof price === 'number' && !isNaN(price)) {
      return price.toLocaleString();
    }
    return '가격 정보 없음';
  };

  return (
    <Link to={`/pet-friendly-lodging/${pension.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img 
          src={
            pension.images && pension.images.length > 0 
              ? (Array.isArray(pension.images) ? pension.images[0] : JSON.parse(pension.images || '[]')[0])
              : pension.image || 'https://picsum.photos/400/300'
          } 
          alt={pension.name} 
          className={styles.cardImage} 
        />
        <div className={styles.cardContent}>
          <div className={styles.info}>
            <span className={styles.location}>{pension.location}</span>
            <span className={styles.rating}>⭐ {pension.rating.toFixed(1)}</span>
          </div>
          <h3 className={styles.title}>{pension.name}</h3>
          {pension.checkInTime && pension.checkOutTime && (
            <div className={styles.timeInfo}>
              <span>체크인 {pension.checkInTime}</span>
              <span>체크아웃 {pension.checkOutTime}</span>
            </div>
          )}
          <p className={styles.price}>₩{formatPrice(pension.price)} / 박</p>
          <div className={styles.tags}>
            {(pension.tags && typeof pension.tags === 'string' ? JSON.parse(pension.tags) : pension.tags || []).map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PensionCard;