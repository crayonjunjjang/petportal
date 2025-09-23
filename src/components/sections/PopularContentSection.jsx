// src/components/sections/PopularContentSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PopularContentSection.module.css';

// Import all data sources
import groomingData from '../../data/grooming.json';
import cafeData from '../../data/cafe.json';
import { mockPensionData as accommodationData } from '../../data/mockPensionData.js';
import hospitalData from '../../data/hospital.json';
import hotelData from '../../data/hotel.json';

const PopularContentSection = () => {
  const [popularContent, setPopularContent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Normalize and combine data from all sources
    const grooming = groomingData.map(item => ({ ...item, type: 'grooming', category: '추천 미용실', image: item.imageUrl, location: item.address.split(' ').slice(0, 2).join(' ') }));
    const cafe = cafeData.map(item => ({ ...item, type: 'cafe', category: '인기 카페', image: item.images[0], location: item.address.split(' ').slice(0, 2).join(' ') }));
    const accommodation = accommodationData.map(item => ({ ...item, type: 'pet-friendly-lodging', category: '추천 동반숙소', image: item.images[0] }));
    const hospital = hospitalData.map(item => ({ ...item, type: 'hospital', category: '추천 동물병원', image: item.imageUrl, location: item.address.split(' ').slice(0, 2).join(' ') }));
    const hotel = hotelData.map(item => ({ ...item, type: 'hotel', category: '추천 펫호텔', image: item.imageUrl, location: item.address.split(' ').slice(0, 2).join(' ') }));

    const combinedData = [...grooming, ...cafe, ...accommodation, ...hospital, ...hotel];

    // 2. Shuffle the array to get random items
    for (let i = combinedData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedData[i], combinedData[j]] = [combinedData[j], combinedData[i]];
    }

    // 3. Slice to get a fixed number of items and duplicate for the animation
    const selectedItems = combinedData.slice(0, 10);
    setPopularContent([...selectedItems, ...selectedItems]);

  }, []);

  const handleCardClick = (item) => {
    navigate(`/${item.type}/${item.id}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>이달의 인기 콘텐츠</h2>
        <p className={styles.subtitle}>삐삐 유저들이 가장 많이 찾은 인기 장소를 만나보세요.</p>
        <div className={styles.scrollingWrapper}>
          <div className={styles.grid}>
            {popularContent.map((item, index) => (
              <div key={index} className={styles.card} onClick={() => handleCardClick(item)}>
                <div className={styles.imageWrapper}>
                    <img src={item.image} alt={item.name} className={styles.image} />
                </div>
                <div className={styles.cardBody}>
                    <p className={styles.category}>{item.category}</p>
                    <h3 className={styles.name}>{item.name}</h3>
                    <p className={styles.location}>{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularContentSection;
