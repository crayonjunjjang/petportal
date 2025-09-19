import React, { useEffect, useMemo, useState, useCallback } from 'react';
import CafeMapView from '../components/service/maps/CafeMapView';
import { Link } from 'react-router-dom';
import FilterSection from '../components/common/FilterSection';
import Pagination from '../components/common/Pagination';
import BusinessCardGrid from '../components/common/BusinessCardGrid';
import '../styles/cafe.css';
import allCafes from '../data/cafe.json'; // Import local data

const ITEMS_PER_PAGE = 6;

const CafePage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState(allCafes);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    location: '',
    startTime: '',
    endTime: '',
    services: [],
    requiresReservation: null
  });

  const applyFilters = useCallback(() => {
    let filtered = allCafes;

    if (filters.location) {
        filtered = filtered.filter(cafe =>
        cafe.name.toLowerCase().includes(filters.location.toLowerCase()) ||
        cafe.address.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.startTime && filters.endTime) {
        filtered = filtered.filter(cafe => {
        const cafeStart = parseInt((cafe.operatingHours?.start || '0').split(':')[0]);
        const cafeEnd = parseInt((cafe.operatingHours?.end || '0').split(':')[0]);
        const filterStart = parseInt(filters.startTime.split(':')[0]);
        const filterEnd = parseInt(filters.endTime.split(':')[0]);
        return cafeStart <= filterStart && cafeEnd >= filterEnd;
      });
    }
    if (filters.services.length > 0) {
        filtered = filtered.filter(cafe => filters.services.every(service => (cafe.services || []).includes(service)));
    }
    if (filters.requiresReservation !== null) {
        filtered = filtered.filter(cafe => cafe.requiresReservation === filters.requiresReservation);
    }

    setFilteredCafes(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    setCafes(paginated);

  }, [currentPage, filters]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 37.5665, lng: 126.9780 })
    );
    applyFilters();
  }, [applyFilters]);

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
    address: cafe.address || ''
  })), [filteredCafes]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  }

  return (
    <div className="cafe-container">
      <header className="pageHeader">
        <h1 className="pageTitle">펫 카페</h1>
        <p className="pageSubtitle">반려동물과 함께 즐기는 특별한 카페 경험</p>
      </header>
      <div className="mapWrapper">
        <CafeMapView 
          userLocation={userLocation} 
          markers={markers}
          filters={{
            amenities: filters.services,
            isOpenOnly: false
          }}
          onMarkerClick={(markerData) => {
            console.log('Cafe marker clicked:', markerData);
          }}
        />
        <div className="filtersOnMap">
          <FilterSection
            locationPlaceholder="카페명이나 지역을 검색해보세요"
            onLocationChange={(value) => handleFilterChange('location', value)}>
            <div className="filterGroup">
              <label className="filterLabel">운영 시간</label>
              <div className="filterInputWrapper timeInputWrapper">
                <span className="timeIcon">⏰</span>
                <select value={filters.startTime} onChange={(e) => handleFilterChange('startTime', e.target.value)} className="filterInput">
                  <option value="">시작 시간</option>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                  })}
                </select>
                <span>~</span>
                <select value={filters.endTime} onChange={(e) => handleFilterChange('endTime', e.target.value)} className="filterInput">
                  <option value="">종료 시간</option>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="filterGroup">
              <label className="filterLabel">서비스</label>
              <div className="pillButtonContainer">
                {['애견음료', '대형견 가능', '야외 테라스', '고양이 전용 공간', '실내놀이터', '포토존', '굿즈', '보드게임', '수제 간식'].map(service => (
                  <button
                    key={service}
                    className={`pillButton ${filters.services.includes(service) ? 'active' : ''}`}
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
            <div className="filterGroup">
              <label className="filterLabel">예약</label>
              <div className="pillButtonContainer">
                <button
                  className={`pillButton ${filters.requiresReservation === false ? 'active' : ''}`}
                  onClick={() => handleFilterChange('requiresReservation', filters.requiresReservation === false ? null : false)}
                >
                  예약 불필요
                </button>
                <button
                  className={`pillButton ${filters.requiresReservation === true ? 'active' : ''}`}
                  onClick={() => handleFilterChange('requiresReservation', filters.requiresReservation === true ? null : true)}
                >
                  예약 필수
                </button>
              </div>
            </div>
          </FilterSection>
        </div>
      </div>

      <div className="cafe-grid">
        <BusinessCardGrid items={cafes.map(c => ({ ...c, type: 'cafe' }))} />
      </div>

      {cafes.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default CafePage;