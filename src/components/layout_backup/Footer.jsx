// src/components/layout/Footer.jsx
import React from 'react';
import styles from './Footer.module.css'; // CSS 파일을 여기서 불러옵니다.

const Footer = () => (
  <footer className={styles.footer}>
    <div className={`${styles.footerContent} container`}>
      <div className={styles.footerBrand}>
        <div className={styles.logo}>PETMILY</div>
        <p>반려동물과 함께하는 행복한 삶을 응원합니다.</p>
        <div className={styles.socialLinks}>
          {/* 실제 아이콘 경로는 public 폴더 기준으로 설정하거나 import 해서 사용해야 합니다. */}
          {/* <a href="#"><img src="/facebook-icon.png" alt="Facebook" /></a> */}
          {/* <a href="#"><img src="/instagram-icon.png" alt="Instagram" /></a> */}
        </div>
      </div>
      <div className={styles.footerNav}>
        <h4>서비스</h4>
        <ul>
          <li><a href="#">돌봄/산책</a></li>
          <li><a href="#">훈련</a></li>
          <li><a href="#">미용</a></li>
          <li><a href="#">병원</a></li>
          <li><a href="#">커뮤니티</a></li>
        </ul>
      </div>
      <div className={styles.footerNav}>
        <h4>회사</h4>
        <ul>
          <li><a href="#">회사 소개</a></li>
          <li><a href="#">채용 정보</a></li>
          <li><a href="#">공지사항</a></li>
          <li><a href="#">문의하기</a></li>
        </ul>
      </div>
      <div className={styles.footerNav}>
        <h4>고객센터</h4>
        <p>1588-XXXX</p>
        <p>평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
      </div>
    </div>
    <div className={styles.copyright}>
      <div className="container">
        <p>Copyright © 2025 PETMILY All rights reserved.</p>
        <div className={styles.legalLinks}>
          <a href="#">개인정보처리방침</a>
          <a href="#">이용약관</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;