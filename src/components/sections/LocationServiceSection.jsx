// src/components/sections/LocationServiceSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleMapView from '../common/SimpleMapView';
import styles from './LocationServiceSection.module.css';

const serviceButtons = [
  { name: '응급병원', path: '/hospital', icon: '🏥' },
  { name: '펜션', path: '/pet-friendly-lodging', icon: '🏨' },
  { name: '미용실', path: '/grooming', icon: '✂️' },
  { name: '용품점', path: '/pet-supplies', icon: '🛍️' }
];

const LocationServiceSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다:', error);
          // 기본 위치 (서울 시청)
          setUserLocation({
            lat: 37.5665,
            lng: 126.9780
          });
        }
      );
    } else {
      // 기본 위치 설정
      setUserLocation({
        lat: 37.5665,
        lng: 126.9780
      });
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 검색어에 따라 적절한 페이지로 이동
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      if (lowerSearchTerm.includes('병원') || lowerSearchTerm.includes('응급')) {
        navigate('/hospital');
      } else if (lowerSearchTerm.includes('펜션') || lowerSearchTerm.includes('숙박')) {
        navigate('/pet-friendly-lodging');
      } else if (lowerSearchTerm.includes('미용') || lowerSearchTerm.includes('그루밍')) {
        navigate('/grooming');
      } else if (lowerSearchTerm.includes('용품') || lowerSearchTerm.includes('사료') || lowerSearchTerm.includes('간식')) {
        navigate('/pet-supplies');
      } else {
        // 기본적으로 전체 검색
        navigate(`/pet-supplies?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleServiceClick = (service) => {
    navigate(service.path);
  };

  // 샘플 마커 데이터 (실제로는 API에서 가져와야 함)
  const sampleMarkers = [
    {
      id: 1,
      lat: 37.5665,
      lng: 126.9780,
      title: '서울 동물병원',
      info: '24시간 응급진료'
    },
    {
      id: 2,
      lat: 37.5675,
      lng: 126.9790,
      title: '펫 미용실',
      info: '전문 그루밍 서비스'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>내 주변 서비스 찾기</h2>
          <p className={styles.subtitle}>가까운 병원, 펜션, 미용실, 용품점을 찾아보세요.</p>
          <form onSubmit={handleSearch} className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="병원, 펜션, 미용실, 용품점 검색..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>검색</button>
          </form>
          <div className={styles.buttonContainer}>
            {serviceButtons.map((service, index) => (
              <button 
                key={index} 
                className={styles.serviceButton}
                onClick={() => handleServiceClick(service)}
              >
                <span className={styles.serviceIcon}>{service.icon}</span>
                {service.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.mapContainer}>
          <SimpleMapView 
            userLocation={userLocation}
            markers={sampleMarkers}
            serviceType="general"
            serviceConfig={{
              name: '주변 서비스',
              markerIcon: '📍',
              accentColor: '#4A90E2',
              backgroundColor: '#F0F8FF'
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default LocationServiceSection;