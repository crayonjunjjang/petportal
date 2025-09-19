
// src/components/sections/ServicesSection.jsx
import React from 'react';
import styles from './ServicesSection.module.css';

const services = [
  {
    icon: '🚑',
    title: '24시간 응급케어',
    description: '신뢰할 수 있는 전문 수의사와 연결',
    link: '/emergency',
  },
  {
    icon: '🏨',
    title: '펜션/호텔 예약',
    description: '안전한 숙박과 휴식 공간',
    link: '/hotel',
  },
  {
    icon: '📖',
    title: '전문가 가이드',
    description: '초보 집사를 위한 실용적인 팁',
    link: '/guide',
  },
  {
    icon: '💬',
    title: '커뮤니티',
    description: '같은 고민을 하는 반려인들과 소통',
    link: '/community',
  },
];

const ServicesSection = () => {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>주요 서비스</h2>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <a href={service.link} key={index} className={styles.serviceCard}>
              <div className={styles.icon}>{service.icon}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
