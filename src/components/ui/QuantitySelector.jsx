// src/components/ui/QuantitySelector.jsx
import React from 'react';
import styles from './QuantitySelector.module.css';

const QuantitySelector = ({ quantity, onQuantityChange, onDecrement, onIncrement }) => {

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onQuantityChange(value);
    } else if (e.target.value === '') {
      onQuantityChange(1); // Or handle empty string as you see fit
    }
  };

  return (
    <div className={styles.quantitySelector}>
      <button onClick={onDecrement} className={styles.button}>-</button>
      <input type="number" value={quantity} onChange={handleChange} className={styles.input} />
      <button onClick={onIncrement} className={styles.button}>+</button>
    </div>
  );
};

export default QuantitySelector;
