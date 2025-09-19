import React from 'react';
import styles from './GuestPetSelector.module.css';

// 👇 maxGuests prop 추가
const GuestPetSelector = ({ guests, setGuests, pets, setPets, maxGuests }) => {
  const handleGuestChange = (amount) => {
    setGuests(prev => Math.max(1, prev + amount));
  };

  const handlePetChange = (amount) => {
    setPets(prev => Math.max(0, prev + amount));
  };

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selectorItem}>
        <span>게스트</span>
        <div className={styles.controls}>
          <button onClick={() => handleGuestChange(-1)} disabled={guests <= 1}>-</button>
          <span>{guests}</span>
          {/* 👇 최대 인원수를 초과하지 못하도록 '+' 버튼 비활성화 조건 추가 */}
          <button onClick={() => handleGuestChange(1)} disabled={guests >= maxGuests}>+</button>
        </div>
      </div>
      <div className={styles.selectorItem}>
        <span>반려동물</span>
        <div className={styles.controls}>
          <button onClick={() => handlePetChange(-1)} disabled={pets <= 0}>-</button>
          <span>{pets}</span>
          <button onClick={() => handlePetChange(1)}>+</button>
        </div>
      </div>
    </div>
  );
};

export default GuestPetSelector;