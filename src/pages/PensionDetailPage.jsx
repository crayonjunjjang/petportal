import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import styles from './PensionDetailPage.module.css';
import Button from '../components/ui/Button';
import GuestPetSelector from '../components/pension/GuestPetSelector';
import { useUI } from '../contexts/UIContext';
import allAccommodations from '../data/accommodation.json'; // 로컬 숙소 데이터 import

// PensionDetailPage: 단일 숙소의 상세 정보를 보여주는 페이지 컴포넌트입니다.
const PensionDetailPage = () => {
  // --- HOOKS ---
  const { pensionId } = useParams(); // URL 파라미터에서 숙소 ID를 가져옵니다.
  const { setIsLoading } = useUI() || {}; // 전역 로딩 상태 관리를 위한 UI 컨텍스트
  
  // --- STATE MANAGEMENT ---
  const [pension, setPension] = useState(null); // 현재 페이지에 표시할 숙소의 상세 데이터
  const [error, setError] = useState(null); // 데이터 로딩 중 발생한 에러 메시지

  // --- Booking Widget States ---
  const [startDate, setStartDate] = useState(null); // 체크인 날짜
  const [endDate, setEndDate] = useState(null); // 체크아웃 날짜
  const [guests, setGuests] = useState(1); // 게스트 수
  const [pets, setPets] = useState(0); // 반려동물 수
  const [showGuestSelector, setShowGuestSelector] = useState(false); // 인원 선택 드롭다운 표시 여부

  // --- EFFECTS ---
  // 컴포넌트 마운트 시 또는 숙소 ID가 변경될 때, 해당 ID의 숙소 데이터를 찾습니다.
  useEffect(() => {
    if (setIsLoading) setIsLoading(true);
    setError(null);
    
    // URL 파라미터로 받은 pensionId는 문자열이므로, 숫자형 ID와 비교하기 위해 parseInt()로 변환합니다.
    const foundPension = allAccommodations.find(acc => acc.id === parseInt(pensionId));
    
    if (foundPension) {
      setPension(foundPension);
    } else {
      setError('해당 숙소 정보를 찾을 수 없습니다.');
    }
    if (setIsLoading) setIsLoading(false);
  }, [pensionId, setIsLoading]);

  // --- DERIVED STATE & HELPERS ---
  // 숙박일수 계산 함수
  const calculateNights = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };
  const numberOfNights = calculateNights(); // 계산된 숙박일수
  const totalPrice = pension ? pension.price * numberOfNights : 0; // 총 가격
  const formatPrice = (price) => price.toLocaleString(); // 가격 포맷팅 함수

  // --- RENDER LOGIC ---
  // 초기 로딩 상태 렌더링
  if (!pension && !error) {
    return <div className="container">숙소 정보를 불러오는 중...</div>;
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>{error}</h2>
          <Link to="/pet-friendly-lodging">
            <Button variant="primary">숙소 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // pension 데이터가 없는 경우 (로딩은 끝났지만 못 찾음)
  if (!pension) {
    return (
      <div>
        <div className={styles.notFound}>
          <h2>해당 숙소 정보를 찾을 수 없습니다.</h2>
          <p>주소가 올바른지 확인해주세요.</p>
          <Link to="/pet-friendly-lodging">
            <Button variant="primary">숙소 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 메인 상세 페이지 렌더링
  return (
    <div className={styles.detailPageContainer}>
      {/* 상단 이미지 캐러셀 섹션 */}
      <section className={styles.carouselSection}>
        <Carousel showThumbs={false} infiniteLoop autoPlay interval={5000} showStatus={false}>
          {pension.images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`${pension.name} 이미지 ${index + 1}`} />
            </div>
          ))}
        </Carousel>
        <div className={styles.heroContent}>
          <p className={styles.pensionType}>{pension.type}</p>
          <h1>{pension.name}</h1>
          <p className={styles.pensionLocation}>{pension.location}</p>
        </div>
      </section>

      {/* 메인 컨텐츠 (정보 + 예약 위젯) */}
      <div className={styles.mainContent}>
        {/* 숙소 정보 컬럼 */}
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>숙소 특징</h3>
            <div className={styles.tags}>
              {pension.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
          </div>
          <div className={styles.infoBlock}>
            <h3>숙소 소개</h3>
            <p className={styles.description}>
              {pension.name}에 오신 것을 환영합니다! (이하 생략)
            </p>
          </div>
        </div>

        {/* 예약 위젯 컬럼 */}
        <aside className={styles.bookingColumn}>
          <div className={styles.bookingBox}>
            <div className={styles.bookingSummary}>
              {/* ... 가격, 최대인원 등 요약 정보 ... */}
            </div>
            <div className={styles.bookingInputs}>
              {/* ... DatePicker, GuestPetSelector 등 예약 입력 UI ... */}
            </div>
            {numberOfNights > 0 && (
              <div className={styles.totalPrice}>
                <span>총 {numberOfNights}박</span>
                <span>₩{formatPrice(totalPrice)}</span>
              </div>
            )}
            <div className={styles.bookingActions}>
              <Button variant="primary" size="large" className={styles.bookingButton}>예약하기</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PensionDetailPage;