// src/components/sections/TrustSection.jsx
import React from 'react';
import styles from './TrustSection.module.css';

const trustData = [
  {
    number: '99.8%',
    title: '수의사 검증 완료',
    description: '모든 정보는 전문 수의사가 직접 검토하여 신뢰할 수 있습니다.',
  },
  {
    number: '10,000+',
    title: '누적 만족 고객',
    description: '이미 만 명이 넘는 고객들이 서비스를 이용하고 만족했습니다.',
  },
  {
    number: '24/7',
    title: '항시 고객지원',
    description: '언제 어디서든 도움이 필요할 때 즉시 지원을 받을 수 있습니다.',
  },
  {
    number: '500+',
    title: '전국 파트너',
    description: '엄격한 기준으로 검증된 병원, 펜션과 함께합니다.',
  },
];

const TrustSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {trustData.map((item, index) => (
            <div key={index} className={styles.item}>
              <p className={styles.number}>{item.number}</p>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;