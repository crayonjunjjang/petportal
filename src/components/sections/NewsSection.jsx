// src/components/sections/NewsSection.jsx
import React from 'react';
import styles from './NewsSection.module.css';

const announcements = [
  { text: '추석 연휴 응급병원 운영 안내', date: '2025.09.08' },
  { text: '새로운 파트너 펜션 추가 (강남/서초)', date: '2025.09.05' },
  { text: '겨울철 특별 건강검진 이벤트', date: '2025.09.01' },
];

const newFeatures = [
  { text: '실시간 채팅 상담 기능이 추가되었습니다.' },
  { text: '모바일 앱이 새롭게 업데이트 되었습니다.' },
];

const NewsSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left Column: Announcements */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>공지사항</h3>
          <ul className={styles.list}>
            {announcements.map((item, index) => (
              <li key={index} className={styles.item}>
                <a href="#" className={styles.link}>{item.text}</a>
                <span className={styles.date}>{item.date}</span>
              </li>
            ))}
          </ul>
          <a href="#" className={styles.viewMore}>더보기 +</a>
        </div>

        {/* Right Column: New Features */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>새로운 기능</h3>
          <ul className={styles.list}>
            {newFeatures.map((item, index) => (
              <li key={index} className={styles.item}>
                <a href="#" className={styles.link}>{item.text}</a>
              </li>
            ))}
          </ul>
          <a href="#" className={styles.viewMore}>자세히 보기</a>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;