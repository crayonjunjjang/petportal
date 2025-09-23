import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './CafeDetailPage.module.css';
import { mockDataService } from '../utils/mockDataService';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const CafeDetailPage = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCafeData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this from an API
        // For now, we'll simulate with mock data service
        const response = await mockDataService.getAll('cafe');

        if (response.success) {
          const foundCafe = response.data.find(c => c.id.toString() === cafeId);
          if (foundCafe) {
            setCafe(foundCafe);
          } else {
            setError(`ID가 ${cafeId}인 카페를 찾을 수 없습니다.`);
          }
        } else {
          setError(response.message || '카페 목록을 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCafeData();
  }, [id]);

  if (loading) {
    return <div className={styles.notFound}><Spinner /></div>;
  }

  if (error) {
    return (
      <div className={styles.notFound}>
        <h2>오류</h2>
        <p>{error}</p>
        <Link to="/cafe"><Button>카페 목록으로 돌아가기</Button></Link>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className={styles.notFound}>
        <h2>카페를 찾을 수 없습니다.</h2>
        <p>요청하신 ID의 카페 정보가 존재하지 않습니다.</p>
        <Link to="/cafe"><Button>카페 목록으로 돌아가기</Button></Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPageContainer}>
      <section className={styles.carouselSection}>
        <Carousel showThumbs={false} infiniteLoop autoPlay>
          {(cafe.images && cafe.images.length > 0 ? cafe.images : [cafe.image]).map((img, index) => (
            <div key={index}>
              <img src={img} alt={`${cafe.name} 이미지 ${index + 1}`} />
            </div>
          ))}
        </Carousel>
        <div className={styles.heroContent}>
          <span className={styles.cafeType}>애견 동반 카페</span>
          <h1>{cafe.name}</h1>
          <p className={styles.cafeLocation}>{cafe.address}</p>
        </div>
      </section>

      <div className={styles.mainContent}>
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>카페 소개</h3>
            <p className={styles.description}>{cafe.description}</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>기본 정보</h3>
            <p><strong>운영시간:</strong> {cafe.openingHours}</p>
            <p><strong>연락처:</strong> {cafe.phone}</p>
            <p><strong>주소:</strong> {cafe.address}</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>편의시설 및 특징</h3>
            <div className={styles.tags}>
              {cafe.amenities?.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
              {cafe.specialties?.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
          </div>
        </div>
        <aside className={styles.bookingColumn}>
          <div className={styles.bookingBox}>
            <div className={styles.bookingSummary}>
              <p className={styles.price}>대표 메뉴</p>
              <ul className={styles.summaryList}>
                {cafe.menu?.map(item => (
                  <li key={item.name}>{item.name}: ₩{item.price}</li>
                ))}
              </ul>
            </div>
            <div className={styles.bookingActions}>
              <Button className={styles.bookingButton} fullWidth>전화 문의</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CafeDetailPage;