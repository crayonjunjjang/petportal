// src/components/layout/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

const Logo = ({ isScrolled }) => {
  const logoClasses = `${styles.logo} ${isScrolled ? styles.scrolled : ''}`;

  return (
    <Link to="/" className={logoClasses}>PetPotal 삐삐</Link>
  );
};

export default Logo;