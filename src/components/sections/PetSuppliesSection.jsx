
// src/components/sections/PetSuppliesSection.jsx
import React from 'react';
import styles from './PetSuppliesSection.module.css';

const categories = ['사료', '간식', '장난감', '미용/목욕', '의류/악세서리'];

const PetSuppliesSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>다양한 반려용품을 만나보세요</h2>
        <p className={styles.subtitle}>필수품부터 특별한 선물까지, 삐삐 PetPotal이 엄선한 상품들</p>
        <div className={styles.categoryList}>
          {categories.map((category, index) => (
            <a href={`/pet-supplies/category/${category}`} key={index} className={styles.categoryLink}>
              {category}
            </a>
          ))}
        </div>
        <a href="/pet-supplies" className={styles.viewMoreButton}>전체 상품 보기</a>
      </div>
    </section>
  );
};

export default PetSuppliesSection;
