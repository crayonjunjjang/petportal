// src/components/common/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBar = ({ isScrolled }) => {
  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <Link to="/grooming">미용</Link>
      <Link to="/cafe">카페</Link>
      <Link to="/pet-friendly-lodging">동반숙소</Link>
      <Link to="/hospital">병원</Link>
      <Link to="/hotel">호텔</Link>
      <Link to="/pet-supplies">반려용품</Link>
      <Link to="/community">커뮤니티</Link>
      <Link to="/support">고객센터</Link>
    </nav>
  );
};

export default NavBar;