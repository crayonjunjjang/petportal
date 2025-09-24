// src/pages/GroomingDetailPage.jsx

// --- 파일 역할: 특정 펫 미용실의 상세 정보를 보여주는 페이지 ---
// 이 컴포넌트는 URL 파라미터로 전달된 미용실 ID를 사용하여
// 해당 미용실의 상세 정보(이미지, 소개, 제공 서비스, 대상 동물 등)를 표시합니다.
// 데이터는 grooming.json 목(mock) 파일에서 가져옵니다.

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // URL 파라미터, 링크 생성을 위한 훅
import allGroomings from '../data/grooming.json'; // 전체 미용실 목 데이터
import styles from './GroomingDetailPage.module.css'; // 상세 페이지 전용 스타일
import Button from '../components/ui/Button'; // 공통 버튼 컴포넌트

// --- GroomingDetailPage Component ---
const GroomingDetailPage = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const { groomingId } = useParams(); // URL에서 'groomingId' 파라미터를 가져옵니다.
  const [grooming, setGrooming] = useState(null); // 현재 페이지에 표시할 미용실 데이터

  // --- EFFECTS (데이터 로딩) ---
  // groomingId가 변경될 때마다 해당 ID에 맞는 미용실 데이터를 찾아서 상태를 업데이트합니다.
  useEffect(() => {
    console.log("Grooming ID from URL:", groomingId);
    // grooming.json 데이터에서 URL 파라미터와 일치하는 ID를 가진 미용실을 찾습니다.
    const foundGrooming = allGroomings.find(g => g.id === groomingId);
    console.log("Found Grooming Data:", foundGrooming);
    setGrooming(foundGrooming);
  }, [groomingId]);

  // --- RENDER (렌더링) ---

  // 미용실 데이터를 아직 찾지 못했거나 로딩 중일 때 표시할 UI
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

  // 정상적으로 데이터가 로드되었을 경우의 UI
  return (
    <div className={styles.detailPageContainer}>
      {/* 상단 히어로 섹션 (대표 이미지 및 이름) */}
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

      {/* 메인 콘텐츠 영역 (소개, 서비스, 기본 정보 등) */}
      <div className={styles.mainContent}>
        {/* 왼쪽 정보 컬럼 */}
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

        {/* 오른쪽 예약/문의 컬럼 */}
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