// src/components/sections/QuickCategorySection.jsx
import React from 'react';
import styles from './QuickCategorySection.module.css';

const categories = [
  {
    title: 'DOG',
    description: '강아지를 위한 모든 것',
    link: '/dog',
    backgroundImage: '/grooming_images/grooming1.jpg',
  },
  {
    title: 'CAT',
    description: '고양이를 위한 모든 것',
    link: '/cat',
    backgroundImage: '/grooming_images/grooming2.jpg',
  },
];

const QuickCategorySection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {categories.map((category, index) => (
            <a href={category.link} key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={category.backgroundImage} alt={category.title} className={styles.image}/>
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{category.title}</h3>
                <p className={styles.description}>{category.description}</p>
                <span className={styles.link}>바로가기 &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickCategorySection;