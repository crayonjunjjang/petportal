import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import allHospitals from '../data/hospital.json';
import styles from './HospitalDetailPage.module.css';
import Button from '../components/ui/Button';

const HospitalDetailPage = () => {
  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const foundHospital = allHospitals.find(h => h.id === hospitalId);
    setHospital(foundHospital);
  }, [hospitalId]);

  if (!hospital) {
    return (
      <div className={styles.notFound}>
        <h2>병원 정보를 불러오는 중...</h2>
        <Link to="/hospital">
          <Button variant="primary">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPageContainer}>
      <section className={styles.heroSection}>
        <img 
          src={hospital.imageUrl || 'https://placehold.co/1200x400?text=Hospital'}
          alt={`${hospital.name} 대표 이미지`}
          className={styles.heroImage} 
        />
        <div className={styles.heroContent}>
          <h1>{hospital.name}</h1>
          <p>{hospital.address}</p>
        </div>
      </section>

      <div className={styles.mainContent}>
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>병원 소개</h3>
            <p className={styles.description}>
              {hospital.description || '상세 정보가 준비중입니다.'}
            </p>
          </div>

          <div className={styles.infoBlock}>
            <h3>진료 과목</h3>
            <div className={styles.tags}>
              {(hospital.specialties || []).map(specialty => (
                <span key={specialty} className={styles.tag}>{specialty}</span>
              ))}
            </div>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>진료 가능 동물</h3>
            <div className={styles.tags}>
              {(hospital.targetAnimals || []).map(animal => (
                <span key={animal} className={styles.tag}>{animal}</span>
              ))}
            </div>
          </div>

          <div className={styles.infoBlock}>
            <h3>기본 정보</h3>
            <div className={styles.infoGrid}>
              <p className={styles.infoItem}><strong>주소:</strong> {hospital.address}</p>
              <p className={styles.infoItem}><strong>전화번호:</strong> {hospital.phone || '정보 없음'}</p>
              <p className={styles.infoItem}><strong>운영 시간:</strong> {hospital.operatingHours || '정보 없음'}</p>
              <p className={styles.infoItem}><strong>24시 운영:</strong> {hospital.is24Hours ? '예' : '아니오'}</p>
              <p className={styles.infoItem}><strong>응급실 운영:</strong> {hospital.isEmergency ? '예' : '아니오'}</p>
            </div>
          </div>
        </div>

        <aside className={styles.actionColumn}>
          <div className={styles.actionBox}>
            <h3>진료 예약</h3>
            <p>⭐ {hospital.rating || '평점 없음'} ({hospital.reviews || 0} 리뷰)</p>
            <Button variant="primary" size="large" className={styles.actionButton}>
              전화로 예약하기
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HospitalDetailPage;
