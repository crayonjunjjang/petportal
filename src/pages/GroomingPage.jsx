import React, { useEffect, useMemo, useState, useCallback } from 'react';
import MapView from '../components/common/MapView';
import GroomingCardGrid from '../components/grooming/GroomingCardGrid';
import FilterSection from '../components/common/FilterSection';
import pageStyles from './Page.module.css';
import mapStyles from './MapPage.module.css';
import styles from './GroomingPage.module.css';
import { getDistance } from '../utils/locationUtils';
import groomingData from '../data/grooming.json';

const GroomingPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    date: '',
    time: '',
    groomingTypes: [],
    targetAnimals: []
  });

  const [groomings, setGroomings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Add isMobile state

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulate data fetching and filtering
    setLoading(true);
    setError(null);
    setTimeout(() => {
      let result = groomingData;

      if (filters.location && !result.some(grooming =>
          grooming.name.toLowerCase().includes(filters.location.toLowerCase()) ||
          grooming.address.toLowerCase().includes(filters.location.toLowerCase()))
      ) {
          result = [];
      } else if (filters.location) {
          result = result.filter(grooming =>
              grooming.name.toLowerCase().includes(filters.location.toLowerCase()) ||
              grooming.address.toLowerCase().includes(filters.location.toLowerCase())
          );
      }
      if (filters.groomingTypes.length > 0) {
          result = result.filter(grooming => filters.groomingTypes.every(type => (grooming.services || []).includes(type)));
      }
      if (filters.targetAnimals.length > 0) {
          result = result.filter(grooming => filters.targetAnimals.every(animal => (grooming.targetAnimals || []).includes(animal)));
      }
      // 거리 필터링 추가 (mock data에서는 실제 위치 기반 필터링 어려움)
      // if (userLocation && result.length > 0) { ... }

      setGroomings(result);
      setLoading(false);
    }, 500);
  }, [filters, userLocation]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        setError(new Error('위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.'));
        setUserLocation({ lat: 37.5665, lng: 126.9780 }); // Default to Seoul
      }
    );
  }, []);

  const markers = useMemo(() => groomings.map(({ id, lat, lng, name }) => ({ id, lat, lng, name })), [groomings]);

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


  if (loading) {
    return <div className={pageStyles.pageContainer}>미용 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={pageStyles.pageContainer} style={{ color: 'red' }}>오류: {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}</div>;
  }

  return (
    <div className={pageStyles.pageContainer}>
      <header className={pageStyles.pageHeader}>
        <h1 className={pageStyles.pageTitle}>펫 미용</h1>
        <p className={pageStyles.pageSubtitle}>전문 그루머가 제공하는 최고의 반려동물 미용 서비스</p>
      </header>

      <div className={mapStyles.mapWrapper}>
        <div className={mapStyles.filterPanel}>
          <FilterSection
            locationPlaceholder="미용실명이나 지역을 검색해보세요"
            searchTerm={filters.location}
            onSearchTermChange={(value) => handleFilterChange('location', value)}
            onSearch={() => { /* 검색 버튼 클릭 시 필요한 로직 추가 */ }}
            isMobile={isMobile} // Pass isMobile prop
          >
            <div className={mapStyles.filterGroup}>
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
        <div className={mapStyles.mapContainer}>
          <MapView userLocation={userLocation} markers={markers} />
        </div>
      </div>

      <GroomingCardGrid items={groomings} />
    </div>
  );
};

export default GroomingPage;