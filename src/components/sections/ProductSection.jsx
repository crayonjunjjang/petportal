// src/components/sections/ProductSection.jsx
import React from 'react';
import styles from './ProductSection.module.css';

const ProductSection = () => {
  return (
    <section className={styles.productSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>SERVICE</h2>
          <h3 className={styles.sectionSubtitle}>반려동물 서비스에 진심을 담다</h3>
          <p className={styles.sectionDescription}>
            전문가 상담부터 일상 관리까지 신뢰할 수 있는 다양한 서비스를 제공하고 있습니다.
          </p>
        </div>
        
        <div className={styles.serviceGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}></div>
            <h4 className={styles.serviceTitle}>전문 병원 연결</h4>
            <p className={styles.serviceDescription}>
              24시간 응급상황 대응 가능한 전문 수의사와 연결해드립니다.
            </p>
          </div>
          
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}></div>
            <h4 className={styles.serviceTitle}>펫 호텔 예약</h4>
            <p className={styles.serviceDescription}>
              안전하고 쾌적한 환경의 펫 호텔 예약 서비스를 제공합니다.
            </p>
          </div>
          
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}></div>
            <h4 className={styles.serviceTitle}>육아 가이드</h4>
            <p className={styles.serviceDescription}>
              초보 집사를 위한 전문적이고 실용적인 육아 가이드를 제공합니다.
            </p>
          </div>
          
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}></div>
            <h4 className={styles.serviceTitle}>커뮤니티</h4>
            <p className={styles.serviceDescription}>
              같은 관심사를 가진 반려인들과 정보를 공유하고 소통할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
