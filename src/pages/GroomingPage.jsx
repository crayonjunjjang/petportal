import React, { useEffect, useMemo, useState, useCallback } from 'react';
import GroomingMapView from '../components/service/maps/GroomingMapView';
import GroomingCardGrid from '../components/grooming/GroomingCardGrid';
import FilterSection from '../components/common/FilterSection';
import pageStyles from './Page.module.css';
import mapStyles from './MapPage.module.css';
import styles from './GroomingPage.module.css';
import { getDistance } from '../utils/locationUtils';
import allGroomings from '../data/grooming.json';

const GroomingPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [groomings, setGroomings] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    date: '',
    time: '',
    groomingTypes: [],
    targetAnimals: []
  });

  const applyFilters = useCallback(() => {
    let filtered = allGroomings;

    if (filters.location) {
        filtered = filtered.filter(grooming =>
            grooming.name.toLowerCase().includes(filters.location.toLowerCase()) ||
            grooming.address.toLowerCase().includes(filters.location.toLowerCase())
        );
    }
    if (filters.groomingTypes.length > 0) {
        filtered = filtered.filter(grooming => filters.groomingTypes.every(type => (grooming.services || []).includes(type)));
    }
    if (filters.targetAnimals.length > 0) {
        filtered = filtered.filter(grooming => filters.targetAnimals.every(animal => (grooming.targetAnimals || []).includes(animal)));
    }
    if (userLocation) {
        filtered = filtered.filter(grooming => {
            if (typeof grooming.lat === 'number' && typeof grooming.lng === 'number') {
                const distance = getDistance(userLocation.lat, userLocation.lng, grooming.lat, grooming.lng);
                return distance <= 20; // 20km
            }
            return true;
        });
    }
    setGroomings(filtered);
  }, [filters, userLocation]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 37.5665, lng: 126.9780 })
    );
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
            onLocationChange={(value) => handleFilterChange('location', value)}
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
          <GroomingMapView userLocation={userLocation} rawData={groomings} serviceType="grooming" />
        </div>
      </div>

      <GroomingCardGrid items={groomings} />
    </div>
  );
};

export default GroomingPage;
