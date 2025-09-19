// src/components/layout/Bar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Bar.module.css';

const Bar = ({ isScrolled }) => {
  const navClasses = `${styles.nav} ${isScrolled ? styles.scrolled : ''}`;
  
  return (
    <nav className={navClasses}>
      <ul>
        <li><NavLink to="/grooming" className={({ isActive }) => isActive ? styles.active : ''}>미용</NavLink></li>
        <li><NavLink to="/cafe" className={({ isActive }) => isActive ? styles.active : ''}>카페</NavLink></li>
        <li><NavLink to="/pet-supplies" className={({ isActive }) => isActive ? styles.active : ''}>용품</NavLink></li>
        <li><NavLink to="/hospital" className={({ isActive }) => isActive ? styles.active : ''}>병원</NavLink></li>
        <li><NavLink to="/hotel" className={({ isActive }) => isActive ? styles.active : ''}>호텔</NavLink></li>
        <li><NavLink to="/pet-friendly-lodging" className={({ isActive }) => isActive ? styles.active : ''}>펜션</NavLink></li>
        <li><NavLink to="/community" className={({ isActive }) => isActive ? styles.active : ''}>커뮤니티</NavLink></li>
      </ul>
    </nav>
  );
};

export default Bar;