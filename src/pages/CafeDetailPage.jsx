// src/pages/CafeDetailPage.jsx

// --- 파일 역할: 특정 카페의 상세 정보를 보여주는 페이지 ---
// 이 컴포넌트는 URL 파라미터로 전달된 카페 ID를 사용하여
// 해당 카페의 상세 정보(이미지, 소개, 운영 정보, 특징 등)를 표시합니다.
// 데이터는 cafe.json 목(mock) 파일에서 가져오며, 로딩 및 오류 상태를 처리합니다.
// 이미지 슬라이드를 위해 'react-responsive-carousel' 라이브러리를 사용합니다.

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // URL 파라미터, 링크 생성을 위한 훅
import { Carousel } from 'react-responsive-carousel'; // 이미지 슬라이드(캐러셀) 컴포넌트
import "react-responsive-carousel/lib/styles/carousel.min.css"; // 캐러셀 기본 스타일
import styles from './CafeDetailPage.module.css'; // 상세 페이지 전용 스타일
import Button from '../components/ui/Button'; // 공통 버튼 컴포넌트
import { useUI } from '../contexts/UIContext'; // 전역 UI 상태(로딩 등)를 위한 컨텍스트
import mockCafes from '../data/cafe.json'; // 카페 목 데이터
import LoadingOverlay from '../components/common/LoadingOverlay'; // 로딩 오버레이 컴포넌트

// --- CafeDetailPage Component ---
const CafeDetailPage = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const { cafeId } = useParams(); // URL에서 'cafeId' 파라미터를 가져옵니다.
  const { isLoading, setIsLoading } = useUI(); // 전역 로딩 상태 및 컨트롤 함수
  const [cafe, setCafe] = useState(null); // 현재 페이지에 표시할 카페 데이터
  const [error, setError] = useState(null); // 오류 메시지 상태

  // --- EFFECTS (데이터 로딩) ---
  // cafeId가 변경될 때마다 해당 ID에 맞는 카페 데이터를 불러옵니다.
  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 시작
    setError(null);

    // 실제 API 호출을 시뮬레이션하기 위해 setTimeout 사용
    setTimeout(() => {
      // cafe.json 데이터에서 URL 파라미터와 일치하는 ID를 가진 카페를 찾습니다.
      const foundCafe = mockCafes.find(c => c.id === cafeId);
      
      if (foundCafe) {
        // 찾은 카페 데이터에 상세 페이지에서 사용할 추가 정보(이미지 등)를 결합합니다.
        const detailedCafe = {
          ...foundCafe,
          images: [
            `https://picsum.photos/seed/cafe_detail${foundCafe.id}_1/1200/800`,
            `https://picsum.photos/seed/cafe_detail${foundCafe.id}_2/1200/800`,
            `https://picsum.photos/seed/cafe_detail${foundCafe.id}_3/1200/800`,
          ],
          type: '카페',
          location: foundCafe.address, // 주소를 위치 정보로 사용
        };
        setCafe(detailedCafe); // 카페 상태 업데이트
      } else {
        setError('카페 정보를 찾을 수 없습니다.'); // 카페를 찾지 못한 경우 오류 설정
      }
      setIsLoading(false); // 데이터 로딩 종료
    }, 500); // 0.5초 지연
  }, [cafeId, setIsLoading]);

  // --- RENDER (렌더링) ---

  // 오류가 발생했을 경우의 UI
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

  // 로딩 중이 아니고, 카페 데이터도 없을 경우 (잘못된 ID 등)
  if (!cafe && !isLoading) {
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

  // 정상적으로 데이터가 로드되었을 경우의 UI
  return (
    <>
      {/* 전역 로딩 오버레이 */}
      <LoadingOverlay isLoading={isLoading} />
      {/* 로딩이 끝나고 카페 데이터가 있을 때만 상세 정보 표시 */}
      {!isLoading && cafe && (
        <div className={styles.detailPageContainer}>
          {/* 상단 이미지 캐러셀 섹션 */}
          <section className={styles.carouselSection}>
            <Carousel
              showThumbs={false} // 썸네일 이미지 표시 안함
              infiniteLoop={true} // 무한 루프
              autoPlay={true} // 자동 재생
              interval={5000} // 재생 간격 (5초)
              showStatus={false} // 상태 표시(예: 1/3) 안함
            >
              {cafe.images && cafe.images.length > 0 ? (
                cafe.images.map((img, index) => (
                  <div key={index}>
                    <img src={img} alt={`${cafe.name} 이미지 ${index + 1}`} />
                  </div>
                ))
              ) : (
                // 이미지가 없을 경우 기본 이미지 표시
                <div key="default-image">
                  <img src="https://placehold.co/1200x400?text=No+Image" alt="기본 이미지" />
                </div>
              )}
            </Carousel>
            {/* 캐러셀 위에 표시될 카페 이름 및 정보 */}
            <div className={styles.heroContent}>
              <p className={styles.cafeType}>{cafe.type}</p>
              <h1>{cafe.name}</h1>
              <p className={styles.cafeLocation}>{cafe.location}</p>
            </div>
          </section>

          {/* 메인 콘텐츠 영역 (소개, 운영 정보 등) */}
          <div className={styles.mainContent}>
            {/* 왼쪽 정보 컬럼 */}
            <div className={styles.infoColumn}>
              <div className={styles.infoBlock}>
                <h3>카페 특징</h3>
                <div className={styles.tags}>
                  {/* 제공 서비스 태그 목록 */}
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

            {/* 오른쪽 예약/문의 컬럼 */}
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
      )}
    </>
  );
};

export default CafeDetailPage;
