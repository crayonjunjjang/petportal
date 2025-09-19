import React from 'react';
import styles from './LoadingOverlay.module.css';
import Spinner from '../ui/Spinner';

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <Spinner />
    </div>
  );
};

export default LoadingOverlay;