// src/components/sections/ESGSection.jsx
import React from 'react';
import styles from './ESGSection.module.css';

const ESGSection = () => {
  return (
    <section className={styles.esgSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>MISSION</h2>
          <h3 className={styles.sectionSubtitle}>반려동물과 보호자에게 행복을 전하는 PetPotal</h3>
          <p className={styles.sectionDescription}>
            PetPotal은 지속가능한 반려동물 문화를 만들어가며<br />
            모든 생명이 존중받는 사회를 위해 노력하고 있습니다.
          </p>
        </div>
        
        <div className={styles.missionGrid}>
          <div className={styles.missionCard}>
            <h4 className={styles.missionTitle}> 생명 존중 경영 선포</h4>
            <p className={styles.missionDescription}>
              PetPotal은 모든 생명을 존중하는 경영을 실천하고 있습니다.
            </p>
          </div>
          
          <div className={styles.missionCard}>
            <h4 className={styles.missionTitle}> 동반성장을 위한 상생</h4>
            <p className={styles.missionDescription}>
              지역 동물병원, 펫샵과의 협력을 통한 상생 생태계를 구축합니다.
            </p>
          </div>
          
          <div className={styles.missionCard}>
            <h4 className={styles.missionTitle}> 체계적이고 투명한 운영</h4>
            <p className={styles.missionDescription}>
              투명하고 신뢰할 수 있는 플랫폼 운영 시스템을 구축합니다.
            </p>
          </div>
          
          <div className={styles.missionCard}>
            <h4 className={styles.missionTitle}> 동물복지를 위한 투자</h4>
            <p className={styles.missionDescription}>
              유기동물 보호 및 동물복지 향상을 위한 지속적인 투자를 진행합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ESGSection;
