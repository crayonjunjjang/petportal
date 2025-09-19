import React from 'react';
import styles from './HeroSection.module.css';
import Button from '../ui/Button';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={`${styles.heroContent} container`}>
        <h1 className={styles.heroTitle}>반려동물과 함께하는<br />모든 소중한 순간</h1>
        <p className={styles.heroSubtitle}>지역과 서비스를 검색하여 최고의 전문가를 만나보세요.</p>
        <div className={styles.searchBar}>
          <input type="text" placeholder="어떤 도움이 필요하신가요? (예: 강남 펫시터)" className={styles.searchInput} />
          <Button variant="primary" size="large" className={styles.searchButton}>검색</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;