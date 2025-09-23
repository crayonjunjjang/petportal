import React, { useEffect, useMemo, useState, useCallback } from 'react';
import CafeMapView from '../components/service/maps/CafeMapView';
import { Link } from 'react-router-dom';
import FilterSection from '../components/common/FilterSection';
import Pagination from '../components/common/Pagination';
import BusinessCardGrid from '../components/common/BusinessCardGrid';
import styles from './CafePage.module.css';
import { useUI } from '../contexts/UIContext';
import cafeData from '../data/cafe.json';

const CafePage = () => {
  const { setIsLoading } = useUI();
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    startTime: '',
    endTime: '',
    services: [],
    requiresReservation: null
  });

  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Simulate data fetching and filtering
    setLoading(true);
    setIsLoading(true);
    setTimeout(() => {
      let result = cafeData;

      if (filters.location) {
        result = result.filter(cafe =>
          cafe.name.toLowerCase().includes(filters.location.toLowerCase()) ||
          cafe.address.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.startTime && filters.endTime) {
        result = result.filter(cafe => {
          const cafeStart = parseInt((cafe.operatingHours?.start || '0').split(':')[0]);
          const cafeEnd = parseInt((cafe.operatingHours?.end || '0').split(':')[0]);
          const filterStart = parseInt(filters.startTime.split(':')[0]);
          const filterEnd = parseInt(filters.endTime.split(':')[0]);
          return cafeStart <= filterStart && cafeEnd >= filterEnd;
        });
      }
      if (filters.services.length > 0) {
        result = result.filter(cafe => filters.services.every(service => (cafe.services || []).includes(service)));
      }
      if (filters.requiresReservation !== null) {
        result = result.filter(cafe => cafe.requiresReservation === filters.requiresReservation);
      }

      setFilteredCafes(result);
      setLoading(false);
      setIsLoading(false);
    }, 500);
  }, [filters, setIsLoading]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        setError(new Error('위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.'));
        setUserLocation({ lat: 37.5665, lng: 126.9780 }); // Default to Seoul
      }
    );
  }, []);

  const totalPages = Math.ceil(filteredCafes.length / itemsPerPage);
  const currentCafes = filteredCafes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const markers = useMemo(() => filteredCafes.map(cafe => ({
    id: cafe.id,
    lat: cafe.lat,
    lng: cafe.lng,
    name: cafe.name,
    amenities: cafe.services || ['wifi'],
    specialties: cafe.specialties || ['coffee'],
    isOpen: cafe.isOpen !== undefined ? cafe.isOpen : true,
    openingHours: cafe.operatingHours ? `${cafe.operatingHours.start}-${cafe.operatingHours.end}` : '09:00-22:00',
    rating: cafe.rating || 4.0,
    phone: cafe.phone || '',
    address: cafe.address || '',
  })), [filteredCafes]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return <div className={styles.cafeContainer}><div className={styles.statusContainer} style={{ color: 'red' }}>오류: {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}</div></div>;
  }

  return (
    <div className={styles.cafeContainer}>
      {loading ? (
        <div className={styles.statusContainer}>카페 정보를 불러오는 중...</div>
      ) : (
        <>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>펫 카페</h1>
            <p className={styles.pageSubtitle}>반려동물과 함께 즐기는 특별한 카페 경험</p>
          </header>
          <div className={styles.mapWrapper}>
            <CafeMapView 
              userLocation={userLocation} 
              markers={markers}
              filters={{
                amenities: filters.services,
                isOpenOnly: false
              }}
              onMarkerClick={(markerData) => {
                console.log('Cafe marker clicked:', markerData);
                // Could show detailed popup or navigate to detail page
              }}
            />
            <div className={styles.filtersOnMap}>
              <FilterSection
                locationPlaceholder="카페명이나 지역을 검색해보세요"
                onLocationChange={(value) => handleFilterChange('location', value)}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>운영 시간</label>
                  <div className={`${styles.filterInputWrapper} ${styles.timeInputWrapper}`}>
                    <span className={styles.timeIcon}>⏰</span>
                    <select value={filters.startTime} onChange={(e) => handleFilterChange('startTime', e.target.value)} className={styles.filterInput}>
                      <option value="">시작 시간</option>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                      })}
                    </select>
                    <span>~</span>
                    <select value={filters.endTime} onChange={(e) => handleFilterChange('endTime', e.target.value)} className={styles.filterInput}>
                      <option value="">종료 시간</option>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>서비스</label>
                  <div className={styles.pillButtonContainer}>
                    {['애견음료', '대형견 가능', '야외 테라스', '고양이 전용 공간', '실내놀이터', '포토존', '굿즈', '보드게임', '수제 간식'].map(service => (
                      <button
                        key={service}
                        className={`${styles.pillButton} ${filters.services.includes(service) ? styles.active : ''}`}
                        onClick={() => {
                          const newServices = filters.services.includes(service)
                            ? filters.services.filter(s => s !== service)
                            : [...filters.services, service];
                          handleFilterChange('services', newServices);
                        }}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>예약</label>
                  <div className={styles.pillButtonContainer}>
                    <button
                      className={`${styles.pillButton} ${filters.requiresReservation === false ? styles.active : ''}`}
                      onClick={() => handleFilterChange('requiresReservation', filters.requiresReservation === false ? null : false)}
                    >
                      예약 불필요
                    </button>
                    <button
                      className={`${styles.pillButton} ${filters.requiresReservation === true ? styles.active : ''}`}
                      onClick={() => handleFilterChange('requiresReservation', filters.requiresReservation === true ? null : true)}
                    >
                      예약 필수
                    </button>
                  </div>
                </div>
              </FilterSection>
            </div>
          </div>

          {/* BusinessCardGrid 대신 직접 4열 그리드 구성 */}
          <div className={styles.cafeGrid}>
            <BusinessCardGrid items={currentCafes.map(c => ({ ...c, type: 'cafe' }))} />
          </div>

          {/* 페이징 */}
          {filteredCafes.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CafePage;
