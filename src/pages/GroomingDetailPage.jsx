import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import allGroomings from '../data/grooming.json';
import styles from './GroomingDetailPage.module.css';
import Button from '../components/ui/Button'; // Assuming a Button component exists

const GroomingDetailPage = () => {
  const { groomingId } = useParams();
  const [grooming, setGrooming] = useState(null);

  useEffect(() => {
    console.log("Grooming ID from URL:", groomingId);
    const foundGrooming = allGroomings.find(g => g.id === groomingId);
    console.log("Found Grooming Data:", foundGrooming);
    setGrooming(foundGrooming);
  }, [groomingId]);

  if (!grooming) {
    return (
      <div className={styles.notFound}>
        <h2>미용실 정보를 찾는 중...</h2>
        <p>잠시만 기다려주세요. 문제가 지속되면 관리자에게 문의하세요.</p>
        <Link to="/grooming">
          <Button variant="primary">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPageContainer}>
      <section className={styles.heroSection}>
        <img 
          src={grooming.imageUrl || 'https://placehold.co/1200x400?text=Grooming'}
          alt={`${grooming.name} 대표 이미지`}
          className={styles.heroImage} 
        />
        <div className={styles.heroContent}>
          <h1>{grooming.name}</h1>
          <p>{grooming.address}</p>
        </div>
      </section>

      <div className={styles.mainContent}>
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>매장 소개</h3>
            <p className={styles.description}>
              {grooming.description || '상세 정보가 준비중입니다.'}
            </p>
          </div>
          <div className={styles.infoBlock}>
            <h3>제공 서비스</h3>
            <div className={styles.tags}>
              {(grooming.services || []).map(service => (
                <span key={service} className={styles.tag}>{service}</span>
              ))}
            </div>
          </div>

          <div className={styles.infoBlock}>
            <h3>미용 가능 동물</h3>
            <div className={styles.tags}>
              {(grooming.targetAnimals || []).map(animal => (
                <span key={animal} className={styles.tag}>{animal}</span>
              ))}
            </div>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>기본 정보</h3>
            <div className={styles.infoGrid}>
              <p className={styles.infoItem}><strong>주소:</strong> {grooming.address}</p>
              <p className={styles.infoItem}><strong>전화번호:</strong> {grooming.phone || '정보 없음'}</p>
              <p className={styles.infoItem}><strong>운영 시간:</strong> {grooming.operatingHours || '정보 없음'}</p>
            </div>
          </div>
        </div>

        <aside className={styles.bookingColumn}>
          <div className={styles.bookingBox}>
            <div className={styles.bookingSummary}>
              <p className={styles.price}><strong>⭐ {grooming.rating || '평점 없음'}</strong></p>
            </div>
            <div className={styles.bookingActions}>
              <Button variant="primary" size="large" className={styles.bookingButton}>
                예약 문의하기
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GroomingDetailPage;
