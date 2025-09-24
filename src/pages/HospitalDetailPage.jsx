// src/pages/HospitalDetailPage.jsx

// --- 파일 역할: 특정 동물병원의 상세 정보를 보여주는 페이지 ---
// 이 컴포넌트는 URL 파라미터로 전달된 병원 ID를 사용하여
// 해당 병원의 상세 정보(이미지, 소개, 진료 과목, 대상 동물 등)를 표시합니다.
// 데이터는 hospital.json 목(mock) 파일에서 가져옵니다.

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // URL 파라미터, 링크 생성을 위한 훅
import allHospitals from '../data/hospital.json'; // 전체 병원 목 데이터
import styles from './HospitalDetailPage.module.css'; // 상세 페이지 전용 스타일
import Button from '../components/ui/Button'; // 공통 버튼 컴포넌트

// --- HospitalDetailPage Component ---
const HospitalDetailPage = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const { hospitalId } = useParams(); // URL에서 'hospitalId' 파라미터를 가져옵니다.
  const [hospital, setHospital] = useState(null); // 현재 페이지에 표시할 병원 데이터

  // --- EFFECTS (데이터 로딩) ---
  // hospitalId가 변경될 때마다 해당 ID에 맞는 병원 데이터를 찾아서 상태를 업데이트합니다.
  useEffect(() => {
    // hospital.json 데이터에서 URL 파라미터와 일치하는 ID를 가진 병원을 찾습니다.
    const foundHospital = allHospitals.find(h => h.id === hospitalId);
    setHospital(foundHospital);
  }, [hospitalId]);

  // --- RENDER (렌더링) ---

  // 병원 데이터를 아직 찾지 못했거나 로딩 중일 때 표시할 UI
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

  // 정상적으로 데이터가 로드되었을 경우의 UI
  return (
    <div className={styles.detailPageContainer}>
      {/* 상단 히어로 섹션 (대표 이미지 및 이름) */}
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

      {/* 메인 콘텐츠 영역 (소개, 진료 과목, 기본 정보 등) */}
      <div className={styles.mainContent}>
        {/* 왼쪽 정보 컬럼 */}
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

        {/* 오른쪽 예약/문의 컬럼 */}
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