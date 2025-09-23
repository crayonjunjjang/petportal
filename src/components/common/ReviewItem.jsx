import React from 'react';
import styles from './ReviewItem.module.css';

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? styles.filledStar : styles.emptyStar}>
      ★
    </span>
  ));
  return <div className={styles.starRating}>{stars}</div>;
};

const ReviewItem = ({ review }) => {
  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewAuthor}>{review.author}</span>
        <StarRating rating={review.rating} />
      </div>
      <p className={styles.reviewContent}>{review.content}</p>
    </div>
  );
};

export default ReviewItem;