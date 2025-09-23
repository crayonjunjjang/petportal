import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import styles from './CafeDetailPage.module.css';
import Button from '../components/ui/Button';
import { useUI } from '../contexts/UIContext';
import { mockCafes } from './CafePage'; // Import the mock data

const CafeDetailPage = () => {
  const { cafeId } = useParams();
  const { setIsLoading } = useUI();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const foundCafe = mockCafes.find(c => c.id === parseInt(cafeId, 10));
      
      if (foundCafe) {
        // Simulate fetching more details if needed, for now just use the found data
        const detailedCafe = {
          ...foundCafe,
          images: [
            `https://picsum.photos/seed/cafe_detail${foundCafe.id}_1/1200/800`,
            `https://picsum.photos/seed/cafe_detail${foundCafe.id}_2/1200/800`,
            `https://picsum.photos/seed/cafe_detail${foundCafe.id}_3/1200/800`,
          ],
          type: '카페',
          location: foundCafe.address, // Use address for location
        };
        setCafe(detailedCafe);
      } else {
        setError('카페 정보를 찾을 수 없습니다.');
      }
      setLoading(false);
      setIsLoading(false);
    }, 500);
  }, [cafeId, setIsLoading]);

  if (loading) {
    return <div className="container">카페 정보를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>{error}</h2>
          <Link to="/cafe">
            <Button variant="primary">카페 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div>
        <div className={styles.notFound}>
          <h2>해당 카페 정보를 찾을 수 없습니다.</h2>
          <p>주소가 올바른지 확인해주세요.</p>
          <Link to="/cafe">
            <Button variant="primary">카페 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPageContainer}>
      <section className={styles.carouselSection}>
        <Carousel
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          showStatus={false}
        >
          {cafe.images && cafe.images.length > 0 ? (
            cafe.images.map((img, index) => (
              <div key={index}>
                <img src={img} alt={`${cafe.name} 이미지 ${index + 1}`} />
              </div>
            ))
          ) : (
            <div key="default-image">
              <img src="https://placehold.co/1200x400?text=No+Image" alt="기본 이미지" />
            </div>
          )}
        </Carousel>
        <div className={styles.heroContent}>
          <p className={styles.cafeType}>{cafe.type}</p>
          <h1>{cafe.name}</h1>
          <p className={styles.cafeLocation}>{cafe.location}</p>
        </div>
      </section>

      <div className={styles.mainContent}>
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>카페 특징</h3>
            <div className={styles.tags}>
              {cafe.services?.map(service => <span key={service} className={styles.tag}>{service}</span>)}
            </div>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>카페 소개</h3>
            <p className={styles.description}>
              {cafe.description || '상세 정보가 준비중입니다.'}
            </p>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>운영 정보</h3>
            <p><strong>주소:</strong> {cafe.address}</p>
            <p><strong>전화번호:</strong> {cafe.phone || '정보 없음'}</p>
            <p><strong>운영 시간:</strong> {cafe.operatingHours?.start || '정보 없음'} - {cafe.operatingHours?.end || '정보 없음'}</p>
            <p><strong>예약 필요:</strong> {cafe.requiresReservation ? '예' : '아니오'}</p>
          </div>
        </div>

        <aside className={styles.bookingColumn}>
          <div className={styles.bookingBox}>
            <div className={styles.bookingSummary}>
              <p className={styles.price}><strong>⭐ {cafe.rating || '-'}</strong> ({cafe.reviews || 0} 리뷰)</p>
              <ul className={styles.summaryList}>
                <li><strong>거리:</strong> {cafe.distanceKm}km</li>
              </ul>
            </div>
            
            <div className={styles.bookingActions}>
              <Button variant="primary" size="large" className={styles.bookingButton}>
                문의하기
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CafeDetailPage;