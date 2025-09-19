// src/components/common/BackgroundSlider.jsx
import React, { useState, useEffect } from 'react';
import styles from './BackgroundSlider.module.css';

const BackgroundSlider = ({ children, autoSlide = true, autoSlideInterval = 5000 }) => {
  const slides = [
    '/grooming_images/grooming1.jpg',
    '/grooming_images/grooming2.jpg',
    '/grooming_images/grooming3.jpg',
    '/grooming_images/grooming4.png',
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // 특정 슬라이드로 이동
  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // 자동 슬라이드
  useEffect(() => {
    if (!autoSlide) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length); // Use functional update
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, slides.length]); // Removed currentSlide from dependencies

  // 터치 스와이프 처리
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // 키보드 이벤트 핸들링
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div 
      className={styles.sliderContainer}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 배경 슬라이드들 */}
      <div className={styles.slidesWrapper}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentSlide ? styles.active : ''
            } ${
              index === (currentSlide - 1 + slides.length) % slides.length 
                ? styles.prev : ''
            } ${
              index === (currentSlide + 1) % slides.length 
                ? styles.next : ''
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide})`
            }}
          />
        ))}
      </div>

      {/* 왼쪽 화살표 */}
      <button 
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={prevSlide}
        disabled={isAnimating}
        aria-label="이전 슬라이드"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M15 18L9 12L15 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 오른쪽 화살표 */}
      <button 
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={nextSlide}
        disabled={isAnimating}
        aria-label="다음 슬라이드"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M9 18L15 12L9 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 하단 도트 네비게이션 */}
      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>

      {/* 슬라이드 위에 표시될 컨텐츠 */}
      <div className={styles.content}>
        {children}
      </div>

      {/* 슬라이드 진행 표시기 (선택사항) */}
      {autoSlide && (
        <div className={styles.progressBar}>
          <div 
            className={styles.progress}
            style={{
              animationDuration: `${autoSlideInterval}ms`,
              animationPlayState: 'running' // Always running, no pause on animation
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundSlider;