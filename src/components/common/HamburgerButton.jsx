// src/components/common/HamburgerButton.jsx
import React from 'react';
import styles from './HamburgerButton.module.css';

const HamburgerButton = ({ isOpen, onClick, isScrolled }) => {
  return (
    <button 
      className={`${styles.hamburgerButton} ${isScrolled ? styles.scrolled : ''} ${isOpen ? styles.open : ''}`}
      onClick={onClick}
      aria-label="메뉴 열기/닫기"
    >
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
    </button>
  );
};

export default HamburgerButton;