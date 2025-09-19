// src/components/grooming/GroomingCardGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GroomingCardGrid.module.css';

const GroomingCardGrid = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>✂️</div>
        <h3>검색 결과가 없습니다</h3>
        <p>다른 조건으로 검색해보세요.</p>
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {items.map(item => (
          <Link to={`/grooming/${item.id}`} key={item.id} className={styles.cardLink}>
            <div className={styles.card}>
              <div className={styles.cardImage}>
                <img
                  src={item.imageUrl || '/api/placeholder/300/200'}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                {item.rating && (
                  <div className={styles.rating}>
                    <span className={styles.star}>⭐</span>
                    {item.rating}
                  </div>
                )}
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.address}>{item.address}</p>

                {item.services && item.services.length > 0 && (
                  <div className={styles.services}>
                    {item.services.slice(0, 3).map((service, index) => (
                      <span key={index} className={styles.serviceTag}>
                        {service}
                      </span>
                    ))}
                    {item.services.length > 3 && (
                      <span className={styles.moreServices}>
                        +{item.services.length - 3}개
                      </span>
                    )}
                  </div>
                )}

                <div className={styles.cardFooter}>
                  {item.phone && (
                    <div className={styles.phone}>
                      📞 {item.phone}
                    </div>
                  )}
                  {item.priceRange && (
                    <div className={styles.priceRange}>
                      {item.priceRange === 'low' ? '💰' :
                       item.priceRange === 'medium' ? '💰💰' : '💰💰💰'}
                    </div>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.detailButton}>
                    상세보기
                  </button>
                  <button className={styles.bookingButton}>
                    예약하기
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroomingCardGrid;