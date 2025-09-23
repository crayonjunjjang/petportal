// PensionPage.jsx

// --- IMPORT ---
import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './PensionPage.module.css';
import Button from '../components/ui/Button';
import PensionCard from '../components/pension/PensionCard';
import GuestPetSelector from '../components/pension/GuestPetSelector';
import { useUI } from '../contexts/UIContext';
import Pagination from '../components/common/Pagination';
import { mockPensionData } from '../data/mockPensionData.js';
import FilterSection from '../components/common/FilterSection';

// --- CONSTANTS ---
// 한 페이지에 보여줄 숙소의 개수를 정의합니다.
const ITEMS_PER_PAGE = 8;

/**
 * @component PensionPage
 * @description 반려동물 동반 가능 숙소 목록을 보여주고, 사용자가 필터링 및 검색할 수 있는 페이지입니다.
 * 다양한 필터(숙소 유형, 반려동물 조건, 날짜, 인원)와 검색 기능을 제공하며, 결과를 페이지네이션으로 보여줍니다.
 */
const PensionPage = () => {
  // --- HOOKS ---
  // UI 컨텍스트에서 로딩 상태를 제어하는 함수를 가져옵니다.
  const { setIsLoading } = useUI() || {};

  // --- STATE MANAGEMENT ---
  // 필터링 및 페이지네이션된 숙소 목록을 저장하는 상태입니다.
  const [accommodations, setAccommodations] = useState([]);
  // 현재 페이지 번호를 저장하는 상태입니다.
  const [currentPage, setCurrentPage] = useState(1);
  // 전체 페이지 수를 저장하는 상태입니다.
  const [totalPages, setTotalPages] = useState(1);
  // 총 검색 결과 개수를 저장하는 상태입니다.
  const [totalResults, setTotalResults] = useState(0);

  // --- Filter States (필터 관련 상태) ---
  const [startDate, setStartDate] = useState(null); // 체크인 날짜
  const [endDate, setEndDate] = useState(null); // 체크아웃 날짜
  const [guests, setGuests] = useState(1); // 게스트 수
  const [pets, setPets] = useState(0); // 반려동물 수
  const [showGuestSelector, setShowGuestSelector] = useState(false); // 인원/반려동물 선택 UI 표시 여부
  const [selectedType, setSelectedType] = useState('전체'); // 선택된 숙소 유형
  const [selectedPetConditions, setSelectedPetConditions] = useState([]); // 선택된 반려동물 관련 조건들
  const [searchTerm, setSearchTerm] = useState(''); // 검색어

  // --- DATA FETCHING & FILTERING ---
  // useCallback을 사용하여 필터링 로직을 메모이제이션합니다.
  // 종속성 배열의 값(currentPage, searchTerm 등)이 변경될 때만 함수가 재생성됩니다.
  const applyFilters = useCallback(() => {
    let filtered = mockPensionData;

    // 1. 검색어 필터링: 숙소 이름 또는 위치에 검색어가 포함된 경우
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(pension =>
        pension.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pension.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. 숙소 유형 필터링: '전체'가 아닌 경우, 선택된 유형과 일치하는 숙소만
    if (selectedType !== '전체') {
      filtered = filtered.filter(pension => pension.type === selectedType);
    }

    // 3. 반려동물 조건 필터링: 선택된 모든 조건을 만족하는 숙소만
    if (selectedPetConditions.length > 0) {
      const conditionKeywords = {
        '대형견 가능': ['대형견'],
        '고양이 가능': ['고양이'],
        '펫스파': ['스파'],
        '펫 운동장': ['운동장'],
      };

      filtered = filtered.filter(pension => {
        const cleanTags = (pension.tags || []).map(tag => tag.replace(/^#/, '').toLowerCase());
        return selectedPetConditions.every(condition => {
          const keywords = conditionKeywords[condition] || [condition];
          return keywords.some(keyword =>
            cleanTags.some(tag => tag.includes(keyword.toLowerCase()))
          );
        });
      });
    }

    // 필터링된 결과를 바탕으로 상태를 업데이트합니다.
    setTotalResults(filtered.length); // 총 결과 수 업데이트
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE)); // 전체 페이지 수 계산
    
    // 현재 페이지에 해당하는 부분만 잘라서 보여줍니다 (페이지네이션).
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    setAccommodations(paginated);

  }, [currentPage, searchTerm, selectedType, selectedPetConditions]);

  // --- EFFECTS ---
  // 필터링 로직(applyFilters)이나 로딩 상태 제어 함수(setIsLoading)가 변경될 때마다 실행됩니다.
  useEffect(() => {
    if (setIsLoading) setIsLoading(true); // 로딩 시작
    applyFilters(); // 필터 적용
    if (setIsLoading) setIsLoading(false); // 로딩 종료
  }, [applyFilters, setIsLoading]);

  // --- EVENT HANDLERS ---
  // 검색 버튼 클릭 시 실행되는 핸들러
  const handleSearchAndFilter = () => {
      setCurrentPage(1); // 페이지를 1로 초기화
      applyFilters(); // 필터 적용
  };

  // 숙소 유형 라디오 버튼 변경 시 실행되는 핸들러
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setCurrentPage(1); // 필터 변경 시 1페이지로 이동
  };

  // 반려동물 조건 체크박스 변경 시 실행되는 핸들러
  const handlePetConditionChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPetConditions(prev =>
      checked ? [...prev, value] : prev.filter(c => c !== value)
    );
    setCurrentPage(1); // 필터 변경 시 1페이지로 이동
  };

  // 페이지네이션에서 페이지 번호 클릭 시 실행되는 핸들러
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // 페이지 이동 시 화면 상단으로 스크롤
  }

  // --- RENDER LOGIC ---
  return (
    <div className={styles.mainContent}> 
      {/* 좌측 필터 사이드바 */}
      <aside className={styles.filters}>
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>숙소 유형</h3>
          <div className={styles.radioGroup}>
            {['전체', '펜션', '호텔', '리조트'].map(type => (
              <label key={type} className={styles.radioLabel}>
                <input
                  type="radio"
                  value={type}
                  checked={selectedType === type}
                  onChange={handleTypeChange}
                  name="accommodationType"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>반려동물 조건</h3>
          <div className={styles.checkboxGroup}>
            {['대형견 가능', '고양이 가능', '펫스파', '펫 운동장'].map(condition => (
              <label key={condition} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={condition}
                  checked={selectedPetConditions.includes(condition)}
                  onChange={handlePetConditionChange}
                />
                {condition}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* 우측 메인 컨텐츠 (검색 결과) */}
      <main className={styles.results}>
        <div className={styles.titleBox}>
            <h1 className={styles.title}>어디로 떠나시나요?</h1>
            <p className={styles.subtitle}>반려동물과 <span className={styles.highlight}>함께 입실</span>하는 숙소만 모아놨어요!</p>
        </div>

        {/* 검색 및 날짜/인원 필터 섹션 */}
        <FilterSection
            locationPlaceholder="지역이나 숙소명을 검색해보세요"
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearchAndFilter}
        >
            <div className={styles.filterGroupInline}>
              <label className={styles.filterLabel}>체크인/아웃</label>
              <div className={styles.datePickerWrapper}>
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
            </div>
            <div className={styles.filterGroupInline} style={{ position: 'relative' }}>
              <label htmlFor="guests" className={styles.filterLabel}>인원 및 반려동물</label>
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
                    maxGuests={10} // 최대 인원 설정
                  />
                </div>
              )}
            </div>
        </FilterSection>

        <div className={styles.resultsHeader}>
          <h2>검색 결과 ({totalResults}개)</h2>
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
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </main>
    </div>
  );
};

export default PensionPage;
