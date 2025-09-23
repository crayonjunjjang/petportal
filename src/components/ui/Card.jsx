import React from 'react';
import styles from './Card.module.css';
import Button from './Button';

const Card = ({ item, type = 'default' }) => {
  const { 
    id, 
    image, 
    images, 
    title, 
    name, 
    location,
    specialty, 
    specialties,
    author, 
    rating, 
    reviews,
    description,
    address,
    phone,
    distanceKm,
    services,
    operatingHours,
    requiresReservation,
    targetAnimals,
    amenities // for hotels
  } = item;

  const cardImage = images ? images[0] : image;

  return (
    <div 
      className={`${styles.card} ${styles[type]}`}
    >
      <img src={cardImage} alt={title || name} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <div className={styles.titleContainer}>
          <h3 className={styles.cardTitle}>{title || name}</h3>
          {location && <span className={styles.locationTag}>{location}</span>}
        </div>
        {specialty && <p className={styles.cardSubtitle}>{specialty}</p>}
        {author && <p className={styles.cardAuthor}>by {author}</p>}
        
        {/* 비즈니스 카드 전용 정보 */}
        {(type === 'business' || type === 'hospital' || type === 'grooming' || type === 'cafe' || type === 'hotel') && (
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
                  {typeof operatingHours === 'string' ? operatingHours : `${operatingHours.start} - ${operatingHours.end}`}
                </p>
              )}
              {requiresReservation !== undefined && (
                <p className={styles.reservation}>
                  {requiresReservation ? '예약 필수' : '예약 불필요'}
                </p>
              )}
            </div>

            {specialties && specialties.length > 0 && (
              <div className={styles.specialtiesContainer}>
                {specialties.map(spec => (
                  <span key={spec} className={styles.specialtyTag}>{spec}</span>
                ))}
              </div>
            )}

            {services && services.length > 0 && (
              <div className={styles.services}>
                {services.slice(0, 3).map(service => (
                  <span key={service} className={styles.serviceTag}>{service}</span>
                ))}
                {services.length > 3 && <span className={styles.moreServices}>+{services.length - 3}</span>}
              </div>
            )}

            {targetAnimals && targetAnimals.length > 0 && (
              <div className={styles.targetAnimalsContainer}>
                {targetAnimals.map(animal => (
                  <span key={animal} className={styles.targetAnimalTag}>{animal}</span>
                ))}
              </div>
            )}

            {amenities && amenities.length > 0 && (
              <div className={styles.amenitiesContainer}>
                {amenities.slice(0, 3).map(amenity => (
                  <span key={amenity} className={styles.amenityTag}>{amenity}</span>
                ))}
                 {amenities.length > 3 && <span className={styles.moreServices}>+{amenities.length - 3}</span>}
              </div>
            )}
          </>
        )}
        
        {/* 기본 정보 */}
        {rating && !['business', 'hospital', 'grooming', 'cafe', 'hotel'].includes(type) && <span className={styles.cardRating}>⭐ {rating}</span>}
        
        {type === 'sitter' && (
          <Button variant="primary" size="small" className={styles.viewProfileButton}>
            프로필 보기
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card;