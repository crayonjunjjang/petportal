import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './PensionPage.module.css';
import Button from '../components/ui/Button';
import PensionCard from '../components/pension/PensionCard';
import GuestPetSelector from '../components/pension/GuestPetSelector';
import { useUI } from '../contexts/UIContext';
import Pagination from '../components/common/Pagination';
import allAccommodations from '../data/accommodation.json'; // 로컬 숙소 데이터 import

const ITEMS_PER_PAGE = 6; // 페이지 당 보여줄 숙소 수

// PensionPage: 반려동물 동반 가능 숙소를 검색하고 필터링하는 메인 페이지 컴포넌트입니다.
const PensionPage = () => {
  // --- STATE MANAGEMENT ---
  const { setIsLoading } = useUI() || {}; // 전역 로딩 상태 관리를 위한 UI 컨텍스트
  const [accommodations, setAccommodations] = useState([]); // 현재 페이지에 표시될 숙소 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  // --- Filter States ---
  const [startDate, setStartDate] = useState(null); // 체크인 날짜
  const [endDate, setEndDate] = useState(null); // 체크아웃 날짜
  const [guests, setGuests] = useState(1); // 게스트 수
  const [pets, setPets] = useState(0); // 반려동물 수
  const [showGuestSelector, setShowGuestSelector] = useState(false); // 인원 선택 드롭다운 표시 여부
  const [selectedType, setSelectedType] = useState('전체'); // 선택된 숙소 유형
  const [selectedPetConditions, setSelectedPetConditions] = useState([]); // 선택된 반려동물 관련 조건
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 (지역 또는 숙소명)

  // --- DATA FETCHING & FILTERING ---
  // 필터 조건에 따라 숙소 목록을 필터링하고 상태를 업데이트하는 함수입니다.
  // useCallback을 사용하여 필터링 로직이 필요할 때만 재생성되도록 최적화합니다.
  const applyFilters = useCallback(() => {
    let filtered = allAccommodations;

    // 1. 검색어 필터링 (숙소명 또는 지역)
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(pension =>
        pension.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pension.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. 숙소 유형 필터링
    if (selectedType !== '전체') {
      filtered = filtered.filter(pension => pension.type === selectedType);
    }

    // 3. 반려동물 조건 필터링 (선택된 모든 조건을 만족해야 함)
    if (selectedPetConditions.length > 0) {
      filtered = filtered.filter(pension =>
        selectedPetConditions.every(condition => (pension.tags || []).includes(condition))
      );
    }

    // 4. 페이지네이션 계산 및 현재 페이지에 맞는 데이터 슬라이싱
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    setAccommodations(paginated);

  }, [currentPage, searchTerm, selectedType, selectedPetConditions]);

  // 컴포넌트 마운트 또는 필터 관련 상태가 변경될 때 필터링 함수를 실행합니다.
  useEffect(() => {
    if (setIsLoading) setIsLoading(true);
    applyFilters();
    if (setIsLoading) setIsLoading(false);
  }, [applyFilters, setIsLoading]);

  // --- HANDLER FUNCTIONS ---
  // '검색' 또는 '상세 조건 적용' 버튼 클릭 시 필터를 적용하는 핸들러
  const handleSearchAndFilter = () => {
      setCurrentPage(1); // 새로운 검색이므로 1페이지로 초기화
      applyFilters();
  };

  // 숙소 유형 라디오 버튼 변경 핸들러
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setCurrentPage(1);
  };

  // 반려동물 조건 체크박스 변경 핸들러
  const handlePetConditionChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPetConditions(prev =>
      checked ? [...prev, value] : prev.filter(c => c !== value)
    );
    setCurrentPage(1);
  };

  // 페이지네이션 컴포넌트에서 페이지 변경 시 호출될 함수
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // 페이지 변경 시 화면 상단으로 스크롤
  }

  // --- RENDER ---
  return (
    <div className="container">
      <div className={styles.pensionPageContainer}>
        <header className={styles.pageHeader}>
          <h1>어디로 떠나시나요?</h1>
          <p>반려동물과 <span className={styles.highlight}>함께 입실</span>하는 숙소만 모아놨어요!</p>
        </header>

        {/* 검색 바 섹션 */}
        <section className={styles.searchSection}>
          {/* ... DatePicker, GuestPetSelector, Input 등 검색 관련 UI ... */}
        </section>

        <div className={styles.mainContent}>
          {/* 상세 필터 사이드바 */}
          <aside className={styles.filters}>
            {/* ... 숙소 유형, 반려동물 조건 등 필터 UI ... */}
          </aside>

          {/* 검색 결과 메인 영역 */}
          <main className={styles.results}>
            <div className={styles.resultsHeader}>
              <h2>검색 결과 ({accommodations.length}개)</h2>
            </div>
            <div className={styles.resultsGrid}>
              {accommodations.length > 0 ? (
                accommodations.map(pension => (
                  <PensionCard key={pension.id} pension={pension} />
                ))
              ) : (
                <p className={styles.noResults}>아쉽지만, 조건에 맞는 동반 입실 가능 숙소를 찾지 못했어요.</p>
              )}
            </div>
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PensionPage;