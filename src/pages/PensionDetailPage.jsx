// PensionDetailPage.jsx

// --- IMPORT ---
// React 및 라우팅, UI 라이브러리들을 가져옵니다.
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // URL 파라미터와 네비게이션을 위한 훅
import DatePicker from 'react-datepicker'; // 날짜 선택 UI
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker 스타일
import { Carousel } from 'react-responsive-carousel'; // 이미지 슬라이더 UI
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel 스타일
import styles from './PensionDetailPage.module.css'; // 이 컴포넌트의 전용 CSS 모듈
import Button from '../components/ui/Button'; // 공용 버튼 컴포넌트
import GuestPetSelector from '../components/pension/GuestPetSelector'; // 인원/반려동물 선택 컴포넌트
import { useUI } from '../contexts/UIContext'; // 전역 UI 상태(로딩 등)를 관리하는 커스텀 훅
import { mockPensionData } from '../data/mockPensionData.js'; // 목업 데이터

/**
 * @component PensionDetailPage
 * @description 단일 숙소의 모든 상세 정보를 보여주는 페이지 컴포넌트입니다.
 * URL의 파라미터(pensionId)를 사용하여 특정 숙소의 데이터를 찾고,
 * 이미지 캐러셀, 숙소 소개, 예약 위젯 등을 렌더링합니다.
 */
const PensionDetailPage = () => {
  // --- HOOKS ---
  // useParams를 사용하여 URL 경로에서 'pensionId'를 추출합니다. 예: /pension/123 -> pensionId는 '123'
  const { pensionId } = useParams(); 
  // UI 컨텍스트에서 로딩 상태를 제어하는 함수를 가져옵니다.
  const { setIsLoading } = useUI() || {}; 

  // --- STATE MANAGEMENT ---
  // 현재 페이지에 표시할 숙소의 상세 데이터를 저장하는 상태입니다. 초기값은 null입니다.
  const [pension, setPension] = useState(null); 
  // 데이터 로딩 중 에러가 발생했을 때 에러 메시지를 저장하는 상태입니다.
  const [error, setError] = useState(null); 

  // --- Booking Widget States (예약 위젯 관련 상태) ---
  const [startDate, setStartDate] = useState(null); // 체크인 날짜
  const [endDate, setEndDate] = useState(null); // 체크아웃 날짜
  const [guests, setGuests] = useState(1); // 게스트 수
  const [pets, setPets] = useState(0); // 반려동물 수
  const [showGuestSelector, setShowGuestSelector] = useState(false); // 인원 선택 드롭다운 UI의 표시 여부

  // --- EFFECTS ---
  // 컴포넌트가 처음 렌더링되거나 pensionId가 변경될 때 실행됩니다.
  useEffect(() => {
    // 데이터 로딩 시작을 알립니다.
    if (setIsLoading) setIsLoading(true);
    setError(null); // 이전 에러 상태를 초기화합니다.

    // 목업 데이터에서 URL 파라미터로 받은 pensionId와 일치하는 숙소를 찾습니다.
    // URL에서 받은 pensionId는 문자열이므로, 숫자형 ID와 비교하기 위해 parseInt()로 변환합니다.
    const foundPension = mockPensionData.find(acc => acc.id === parseInt(pensionId));

    if (foundPension) {
      // 숙소를 찾으면 상태에 저장합니다.
      setPension(foundPension);
    } else {
      // 숙소를 찾지 못하면 에러 메시지를 설정합니다.
      setError('해당 숙소 정보를 찾을 수 없습니다.');
    }
    // 데이터 로딩 완료를 알립니다.
    if (setIsLoading) setIsLoading(false);
  }, [pensionId, setIsLoading]); // pensionId나 setIsLoading 함수가 변경될 때마다 이 effect가 다시 실행됩니다.

  // --- DERIVED STATE & HELPER FUNCTIONS (파생된 상태 및 헬퍼 함수) ---
  // 숙박일수를 계산하는 함수입니다.
  const calculateNights = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate); // 두 날짜의 시간 차이 (밀리초)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 일(day) 단위로 변환
      return diffDays > 0 ? diffDays : 0;
    }
    return 0; // 날짜가 선택되지 않았으면 0을 반환합니다.
  };

  const numberOfNights = calculateNights(); // 계산된 숙박일수
  const totalPrice = pension ? pension.price * numberOfNights : 0; // 총 예약 가격
  const formatPrice = (price) => price.toLocaleString(); // 숫자를 통화 형식(1,000)의 문자열로 변환하는 함수

  // --- RENDER LOGIC ---
  // 1. 로딩 중 렌더링: pension 데이터가 아직 없고 에러도 없는 초기 상태
  if (!pension && !error) {
    return <div className="container">숙소 정보를 불러오는 중...</div>;
  }

  // 2. 에러 발생 시 렌더링: error 상태에 메시지가 있을 경우
  if (error) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>{error}</h2>
          <Link to="/pension">
            <Button variant="primary">숙소 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 3. 데이터 없음 렌더링: 로딩은 끝났지만 pension 데이터를 찾지 못한 경우
  if (!pension) {
    return (
      <div>
        <div className={styles.notFound}>
          <h2>해당 숙소 정보를 찾을 수 없습니다.</h2>
          <p>주소가 올바른지 확인해주세요.</p>
          <Link to="/pension">
            <Button variant="primary">숙소 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // pension 객체에서 이미지와 태그 배열을 안전하게 추출합니다. (데이터가 없을 경우 빈 배열 사용)
  const pensionImages = pension.images || [];
  const pensionTags = pension.tags || [];

  // 4. 메인 상세 페이지 렌더링
  return (
    <div className={styles.detailPageContainer}>
      {/* 상단 이미지 캐러셀 섹션 */}
      <section className={styles.carouselSection}>
        <Carousel showThumbs={false} infiniteLoop autoPlay interval={5000} showStatus={false}>
          {pensionImages.map((img, index) => (
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

      {/* 메인 컨텐츠 (좌: 정보, 우: 예약 위젯) */}
      <div className={styles.mainContent}>
        {/* 숙소 정보 컬럼 */}
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>숙소 특징</h3>
            <div className={styles.tags}>
              {pensionTags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
          </div>
          <div className={styles.infoBlock}>
            <h3>숙소 소개</h3>
            <p className={styles.description}>{pension.description}</p>
          </div>
        </div>

        {/* 예약 위젯 컬럼 */}
        <aside className={styles.bookingColumn}>
          <div className={styles.bookingBox}>
            <div className={styles.bookingSummary}>
              <div className={styles.price}>
                <strong>₩{formatPrice(pension.price)}</strong> / 박
              </div>
              <div className={styles.rating}>
                ⭐ {pension.rating.toFixed(1)}
              </div>
            </div>
            <div className={styles.bookingInputs}>
              <div className={styles.datePickers}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="체크인"
                  className={styles.dateInput}
                  dateFormat="yyyy/MM/dd"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="체크아웃"
                  className={styles.dateInput}
                  dateFormat="yyyy/MM/dd"
                />
              </div>
              <div className={styles.guestInputWrapper}>
                <input
                    type="text"
                    id="guests"
                    placeholder={`게스트 ${guests}명, 반려동물 ${pets}마리`}
                    onClick={() => setShowGuestSelector(!showGuestSelector)}
                    readOnly
                    className={styles.guestInput}
                />
                {showGuestSelector && (
                    <div className={styles.guestSelectorDropdown}>
                    <GuestPetSelector
                        guests={guests}
                        setGuests={setGuests}
                        pets={pets}
                        setPets={setPets}
                        maxGuests={pension.maxGuests || 10}
                    />
                    </div>
                )}
              </div>
            </div>
            {/* 숙박일수가 1 이상일 때만 총 가격을 표시합니다. */}
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