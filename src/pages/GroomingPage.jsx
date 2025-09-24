// src/pages/GroomingPage.jsx

// --- 파일 역할: '펫 미용' 서비스 목록을 보여주는 페이지 ---
// 이 컴포넌트는 사용자가 펫 미용실을 검색하고 필터링할 수 있는 기능을 제공합니다.
// 필터 패널과 지도를 나란히 보여주고, 하단에는 필터링된 결과를 카드 그리드 형태로 표시합니다.
// 주요 기능으로는 검색어(디바운싱 적용), 날짜/시간, 미용 종류, 대상 동물에 따른 필터링이 있습니다.

import React, { useEffect, useMemo, useState } from 'react';
import MapView from '../components/common/MapView'; // 공통 지도 뷰 컴포넌트
import GroomingCardGrid from '../components/grooming/GroomingCardGrid'; // 미용실 카드 그리드
import FilterSection from '../components/common/FilterSection'; // 필터 섹션 컴포넌트
import mapStyles from './MapPage.module.css'; // 지도와 필터 레이아웃 공통 스타일
import styles from './GroomingPage.module.css'; // 미용 페이지 전용 스타일
import groomingData from '../data/grooming.json'; // 미용실 목 데이터

// --- GroomingPage Component ---
const GroomingPage = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const [userLocation, setUserLocation] = useState(null); // 사용자 현재 위치
  const [searchTerm, setSearchTerm] = useState(''); // 사용자가 입력하는 검색어
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // 디바운싱이 적용된 검색어 (API 호출용)
  const [filters, setFilters] = useState({ // 필터링 조건 상태
    date: '',
    time: '',
    groomingTypes: [],
    targetAnimals: []
  });

  const [groomings, setGroomings] = useState([]); // 필터링된 미용실 목록
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 오류 메시지 상태
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // 모바일 뷰 여부

  // --- EFFECTS (생명주기 및 이벤트 리스너) ---

  // 화면 크기 변경을 감지하여 모바일 뷰 상태를 업데이트합니다.
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 검색어 입력 시, 500ms 디바운스를 적용하여 API 호출을 최소화합니다.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    // cleanup 함수: 이전 타이머를 제거하여 마지막 입력 후 500ms가 지나면 한번만 실행되도록 보장
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 디바운싱된 검색어나 필터가 변경될 때마다 미용실 데이터를 다시 필터링합니다.
  useEffect(() => {
    setLoading(true);
    setError(null);

    let result = groomingData;

    // 검색어 필터링
    if (debouncedSearchTerm) {
      result = result.filter(g =>
        g.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        g.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    // 미용 종류 필터링 (선택된 종류 중 하나라도 포함하면 통과)
    if (filters.groomingTypes.length > 0) {
      result = result.filter(g =>
        filters.groomingTypes.some(type => (g.services || []).includes(type))
      );
    }
    // 대상 동물 필터링 (선택된 동물 중 하나라도 포함하면 통과)
    if (filters.targetAnimals.length > 0) {
      result = result.filter(g =>
        filters.targetAnimals.some(animal => (g.targetAnimals || []).includes(animal))
      );
    }

    setGroomings(result);
    setLoading(false);
  }, [debouncedSearchTerm, filters]);

  // 컴포넌트 마운트 시 사용자의 현재 위치를 가져옵니다.
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        setError(new Error('위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.'));
        setUserLocation({ lat: 37.5665, lng: 126.9780 }); // 실패 시 기본 위치(서울)로 설정
      }
    );
  }, []);

  // --- MEMOIZED VALUES (메모이제이션) ---
  // 필터링된 미용실 목록이 변경될 때만 지도 마커를 다시 계산합니다. (성능 최적화)
  const markers = useMemo(() => groomings.map(({ id, lat, lng, name }) => ({ id, lat, lng, name })), [groomings]);

  // --- EVENT HANDLERS (이벤트 처리 함수) ---
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleToggleFilter = (filterType, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  // --- RENDER (렌더링) ---
  if (loading) return <div className={styles.pageContainer}>미용 정보를 불러오는 중...</div>;
  if (error) return <div className={styles.pageContainer} style={{ color: 'red' }}>오류: {error.message}</div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>펫 미용</h1>
        <p className={styles.pageSubtitle}>전문 그루머가 제공하는 최고의 반려동물 미용 서비스</p>
      </header>

      <div className={mapStyles.mapWrapper}>
        {/* 왼쪽 필터 패널 */}
        <div className={mapStyles.filterPanel}>
          <FilterSection
            locationPlaceholder="미용실명이나 지역을 검색해보세요"
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={() => { /* 검색 버튼 클릭 시 필요한 로직 추가 */ }}
            isMobile={isMobile}
          >
            <div className={`${mapStyles.filterGroup} ${styles.filterRow}`}>
              <div className={`${mapStyles.filterInputWrapper} ${mapStyles.dateInputWrapper}`}>
                <span className={mapStyles.dateIcon}>📅</span>
                <input type="date" value={filters.date} onChange={(e) => handleFilterChange('date', e.target.value)} className={mapStyles.filterInput} />
              </div>
              <div className={`${mapStyles.filterInputWrapper} ${mapStyles.timeInputWrapper}`}>
                <span className={mapStyles.timeIcon}>⏰</span>
                <select value={filters.time} onChange={(e) => handleFilterChange('time', e.target.value)} className={mapStyles.filterInput}>
                  <option value="">시간 선택</option>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                  })}
                </select>
              </div>
            </div>
            <div className={mapStyles.filterGroup}>
              <label className={mapStyles.filterLabel}>미용 종류</label>
              <div className={mapStyles.checkboxContainer}>
                {['목욕', '부분미용', '전체미용', '스타일링', '스파', '마사지', '무마취 미용', '고양이전문', '네일케어'].map(type => (
                  <label key={type} className={mapStyles.checkboxLabel}>
                    <input type="checkbox" value={type}
                      checked={filters.groomingTypes.includes(type)}
                      onChange={() => handleToggleFilter('groomingTypes', type)}
                      className={mapStyles.checkboxInput}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <div className={mapStyles.filterGroup}>
              <label className={mapStyles.filterLabel}>대상 동물</label>
              <div className={mapStyles.checkboxContainer}>
                {['강아지', '고양이', '특수동물'].map(animal => (
                  <label key={animal} className={mapStyles.checkboxLabel}>
                    <input type="checkbox" value={animal}
                      checked={filters.targetAnimals.includes(animal)}
                      onChange={() => handleToggleFilter('targetAnimals', animal)}
                      className={mapStyles.checkboxInput}
                    />
                    {animal}
                  </label>
                ))}
              </div>
            </div>
          </FilterSection>
        </div>
        {/* 오른쪽 지도 */}
        <div className={mapStyles.mapContainer}>
          <MapView userLocation={userLocation} markers={markers} />
        </div>
      </div>

      {/* 하단 미용실 카드 그리드 */}
      <GroomingCardGrid items={groomings} />
    </div>
  );
};

export default GroomingPage;
