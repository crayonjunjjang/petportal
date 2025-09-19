import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Card.module.css';
import Button from './Button';

const Card = ({ item, type = 'default' }) => {
  const navigate = useNavigate();
  const { 
    id, 
    image, 
    images, 
    title, 
    name, 
    specialty, 
    author, 
    rating, 
    reviews,
    description,
    address,
    phone,
    distanceKm,
    services,
    operatingHours,
    requiresReservation
  } = item;

  const handleCardClick = () => {
    if (type === 'business') {
      navigate(`/cafe/${id}`);
    }
  };

  const cardImage = images ? images[0] : image;

  return (
    <div 
      className={`${styles.card} ${styles[type]} ${type === 'business' ? styles.clickable : ''}`}
      onClick={type === 'business' ? handleCardClick : undefined}
    >
      <img src={cardImage} alt={title || name} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title || name}</h3>
        {specialty && <p className={styles.cardSubtitle}>{specialty}</p>}
        {author && <p className={styles.cardAuthor}>by {author}</p>}
        
        {/* 비즈니스 카드 전용 정보 */}
        {type === 'business' && (
          <>
            <div className={styles.businessInfo}>
              {rating && (
                <div className={styles.ratingInfo}>
                  <span className={styles.cardRating}>⭐ {rating}</span>
                  {reviews && <span className={styles.reviewCount}>({reviews}개 리뷰)</span>}
                </div>
              )}
              {address && <p className={styles.address}>{address}</p>}
              {phone && <p className={styles.phone}>{phone}</p>}
              {distanceKm && <p className={styles.distance}>{distanceKm}km</p>}
              {operatingHours && (
                <p className={styles.hours}>
                  {operatingHours.start} - {operatingHours.end}
                </p>
              )}
              {requiresReservation !== undefined && (
                <p className={styles.reservation}>
                  {requiresReservation ? '예약 필수' : '예약 불필요'}
                </p>
              )}
            </div>
            
            {services && services.length > 0 && (
              <div className={styles.services}>
                {services.slice(0, 3).map(service => (
                  <span key={service} className={styles.serviceTag}>{service}</span>
                ))}
                {services.length > 3 && <span className={styles.moreServices}>+{services.length - 3}</span>}
              </div>
            )}
          </>
        )}
        
        {/* 기본 정보 */}
        {rating && type !== 'business' && <span className={styles.cardRating}>⭐ {rating}</span>}
        {description && <p className={styles.cardDescription}>{description}</p>}
        
        {type === 'sitter' && (
          <Button variant="primary" size="small" className={styles.viewProfileButton}>
            프로필 보기
          </Button>
        )}
      </div>
      {type === 'business' && (
        <div className={styles.clickHint}>
          클릭하여 상세정보 보기
        </div>
      )}
    </div>
  );
};

export default Card;