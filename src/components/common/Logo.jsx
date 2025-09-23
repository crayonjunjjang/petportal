// src/components/common/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';
import logoImage from '../../assets/image/logo3.png';

const Logo = ({ isScrolled }) => {
  return (
    <Link to="/" className={`${styles.logoContainer} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.logoImage}>
        <img src={logoImage} alt="삐삐 PetPortal Logo" className={styles.logoImg} />
      </div>
      <span className={styles.logoText}>삐삐 PetPortal</span>
    </Link>
  );
};

export default Logo;