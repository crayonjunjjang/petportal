// src/components/sections/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import BackgroundSlider from '../common/BackgroundSlider';
import styles from './HeroSection.module.css';

const TAGLINES = [
  {
    title: "반려동물과 함께하는<br />모든 소중한 순간",
    subtitle: "우리 아이에게 최고의 서비스를 제공합니다."
  },
  {
    title: "사랑스러운 눈빛,<br />따뜻한 온기.",
    subtitle: "함께하는 모든 날이 행복입니다."
  },
  {
    title: "작은 발걸음이 만드는<br />큰 행복의 여정.",
    subtitle: "최고의 동반자를 위한 선택."
  },
  {
    title: "언제나 곁을 지켜주는<br />든든한 가족.",
    subtitle: "그들의 건강과 행복을 최우선으로."
  }
];

const HeroSection = () => {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [animationState, setAnimationState] = useState('entering'); // 'entering', 'active', 'leaving'

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState('leaving'); // Start leaving animation
      setTimeout(() => {
        setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % TAGLINES.length);
        setAnimationState('entering'); // Start entering animation
      }, 1000); // Duration of leaving animation
    }, 6000); // Total duration for each tagline (including animation)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (animationState === 'entering') {
      const timer = setTimeout(() => {
        setAnimationState('active'); // Transition to active state after entering
      }, 100); // Small delay to ensure entering animation starts
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  const currentTagline = TAGLINES[currentTaglineIndex];

  return (
    <section className={styles.heroSection}>
      <BackgroundSlider autoSlide={true} autoSlideInterval={3000}>
        <div className={styles.heroContent}>
          <h1
            className={`${styles.heroTitle} ${styles[animationState]}`}
            dangerouslySetInnerHTML={{ __html: currentTagline.title }}
          ></h1>
          <p
            className={`${styles.heroSubtitle} ${styles[animationState]}`}
            dangerouslySetInnerHTML={{ __html: currentTagline.subtitle }}
          ></p>
        </div>
      </BackgroundSlider>
    </section>
  );
};

export default HeroSection;
