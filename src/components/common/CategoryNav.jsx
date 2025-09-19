import React from 'react';
import styles from './CategoryNav.module.css';

const categories = [
  { id: 1, name: '돌봄/산책', icon: '🐾' },
  { id: 2, name: '훈련', icon: '🎓' },
  { id: 3, name: '미용', icon: '✂️' },
  { id: 4, name: '병원', icon: '🏥' },
  { id: 5, name: '호텔', icon: '🏨' },
];

const CategoryNav = () => {
  return (
    <section className={`${styles.categoryNav} container`}>
      {categories.map(category => (
        <div key={category.id} className={styles.categoryItem}>
          <span className={styles.categoryIcon}>{category.icon}</span>
          <span className={styles.categoryName}>{category.name}</span>
        </div>
      ))}
    </section>
  );
};

export default CategoryNav;