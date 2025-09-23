import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import allHotels from '../data/hotel.json';
import styles from './HotelDetailPage.module.css';
import Button from '../components/ui/Button';

const HotelDetailPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const foundHotel = allHotels.find(h => h.id === hotelId);

    if (foundHotel) {
      setHotel(foundHotel);
    } else {
      setError('호텔을 찾을 수 없습니다.');
    }
    setLoading(false);
  }, [hotelId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  if (loading) {
    return <div className={styles.loading}>호텔 정보를 불러오는 중...</div>;
  }

  if (error || !hotel) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/hotel')}>호텔 목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <span onClick={() => navigate('/hotel')} className={styles.breadcrumbLink}>호텔</span>
        <span className={styles.separator}>&gt;</span>
        <span className={styles.currentPage}>{hotel.name}</span>
      </div>

      <div className={styles.detailLayout}>
        <div className={styles.imageSection}>
          <img src={hotel.imageUrl} alt={hotel.name} className={styles.mainImage} />
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.hotelName}>{hotel.name}</h1>
          <div className={styles.rating}>
            <span className={styles.stars}>{'⭐'.repeat(Math.floor(hotel.rating))}</span>
            <span className={styles.ratingText}>{hotel.rating}</span>
            <span className={styles.reviewCount}>({hotel.reviews}개 리뷰)</span>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>주소</span>
              <span className={styles.infoValue}>{hotel.address}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>연락처</span>
              <span className={styles.infoValue}>{hotel.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>운영시간</span>
              <span className={styles.infoValue}>{hotel.operatingHours}</span>
            </div>
          </div>

          <div className={styles.amenities}>
            <h3>주요 편의시설</h3>
            <div className={styles.amenityList}>
              {hotel.amenities.map((amenity, index) => (
                <span key={index} className={styles.amenityTag}>{amenity}</span>
              ))}
            </div>
          </div>

          <div className={styles.description}>
            <h3>호텔 소개</h3>
            <p>{hotel.description}</p>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" size="large">예약하기</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
