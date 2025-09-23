import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../common/MapView';
import styles from './LocationServiceSection.module.css';
import groomingData from '../../data/grooming.json';
import cafeData from '../../data/cafe.json';
import hospitalData from '../../data/hospital.json';
import hotelData from '../../data/hotel.json';

const categories = [
  { name: '전체', type: 'all', icon: '🗺️' },
  { name: '미용', type: 'grooming', icon: '✂️' },
  { name: '카페', type: 'cafe', icon: '☕' },
  { name: '병원', type: 'hospital', icon: '🏥' },
  { name: '호텔', type: 'hotel', icon: '🏨' },
];

const LocationServiceSection = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [allMarkers, setAllMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => localStorage.getItem('selectedMapCategory') || 'all');

  const handleMarkerClick = (marker) => {
    if (marker && marker.type && marker.id) {
      navigate(`/${marker.type}/${marker.id}`);
    }
  };

  useEffect(() => {
    const addInfoAndClickHandler = (item, type) => ({ 
      ...item, 
      type, 
      info: item.name, // Add name to info property for hover display
      onClick: () => handleMarkerClick({ ...item, type })
    });

    const groomingMarkers = groomingData.map(item => addInfoAndClickHandler(item, 'grooming'));
    const cafeMarkers = cafeData.map(item => addInfoAndClickHandler(item, 'cafe'));
    const hospitalMarkers = hospitalData.map(item => addInfoAndClickHandler(item, 'hospital'));
    const hotelMarkers = hotelData.map(item => addInfoAndClickHandler(item, 'hotel'));

    const combinedMarkers = [...groomingMarkers, ...cafeMarkers, ...hospitalMarkers, ...hotelMarkers];
    setAllMarkers(combinedMarkers);

    // Apply initial filter based on persisted category
    const initialCategory = localStorage.getItem('selectedMapCategory') || 'all';
    if (initialCategory === 'all') {
      setFilteredMarkers(combinedMarkers);
    } else {
      const filtered = combinedMarkers.filter(marker => marker.type === initialCategory);
      setFilteredMarkers(filtered);
    }

  }, [navigate]);

  useEffect(() => {
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
          setUserLocation({ lat: 37.5665, lng: 126.9780 }); // Default to Seoul
        }
      );
    } else {
      setUserLocation({ lat: 37.5665, lng: 126.9780 });
    }
  }, []);

  const handleCategoryFilter = (categoryType) => {
    setSelectedCategory(categoryType);
    localStorage.setItem('selectedMapCategory', categoryType);
    if (categoryType === 'all') {
      setFilteredMarkers(allMarkers);
    } else {
      const filtered = allMarkers.filter(marker => marker.type === categoryType);
      setFilteredMarkers(filtered);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>내 주변 서비스 찾기</h2>
          <p className={styles.subtitle}>가까운 병원, 호텔, 미용실, 카페를 찾아보세요.</p>
          <div className={styles.buttonContainer}>
            {categories.map((category) => (
              <button 
                key={category.type} 
                className={`${styles.serviceButton} ${selectedCategory === category.type ? styles.active : ''}`}
                onClick={() => handleCategoryFilter(category.type)}
              >
                <span className={styles.serviceIcon}>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.mapContainer}>
          <MapView 
            userLocation={userLocation}
            markers={filteredMarkers}
          />
        </div>
      </div>
    </section>
  );
};

export default LocationServiceSection;
