// src/components/pension/GuestPetSelector.jsx

// --- IMPORT ---
import React from 'react';
import styles from './GuestPetSelector.module.css'; // 컴포넌트 전용 CSS 모듈

/**
 * @component GuestPetSelector
 * @description 게스트 수와 반려동물 수를 조절할 수 있는 선택기 컴포넌트입니다.
 * `PensionPage.jsx`와 `PensionDetailPage.jsx`에서 인원/반려동물 선택 드롭다운 내부에 사용됩니다.
 *
 * @param {object} props - 컴포넌트에 전달되는 속성(props).
 * @param {number} props.guests - 현재 선택된 게스트 수.
 * @param {function(number): void} props.setGuests - 게스트 수를 업데이트하는 함수 (useState의 setter).
 * @param {number} props.pets - 현재 선택된 반려동물 수.
 * @param {function(number): void} props.setPets - 반려동물 수를 업데이트하는 함수 (useState의 setter).
 * @param {number} props.maxGuests - 최대 게스트 수. 게스트 수가 이 값을 초과할 수 없습니다.
 */
const GuestPetSelector = ({ guests, setGuests, pets, setPets, maxGuests }) => {
  // 게스트 수를 변경하는 핸들러 함수입니다.
  // `amount`는 증가(+1) 또는 감소(-1) 값을 나타냅니다.
  // `Math.max(1, ...)`을 사용하여 게스트 수가 최소 1명 미만이 되지 않도록 합니다.
  const handleGuestChange = (amount) => {
    setGuests(prev => Math.max(1, prev + amount));
  };

  // 반려동물 수를 변경하는 핸들러 함수입니다.
  // `amount`는 증가(+1) 또는 감소(-1) 값을 나타냅니다.
  // `Math.max(0, ...)`을 사용하여 반려동물 수가 최소 0마리 미만이 되지 않도록 합니다.
  const handlePetChange = (amount) => {
    setPets(prev => Math.max(0, prev + amount));
  };

  return (
    <div className={styles.selectorContainer}> {/* 전체 선택기 컨테이너 */}
      <div className={styles.selectorItem}> {/* 게스트 선택 항목 */}
        <span>게스트</span>
        <div className={styles.controls}> {/* 게스트 수 조절 컨트롤 */}
          {/* 게스트 감소 버튼: 현재 게스트 수가 1명 이하면 비활성화 */}
          <button onClick={() => handleGuestChange(-1)} disabled={guests <= 1}>-</button>
          <span>{guests}</span> {/* 현재 게스트 수 표시 */}
          {/* 게스트 증가 버튼: 현재 게스트 수가 `maxGuests` 이상이면 비활성화 */}
          <button onClick={() => handleGuestChange(1)} disabled={guests >= maxGuests}>+</button>
        </div>
      </div>
      <div className={styles.selectorItem}> {/* 반려동물 선택 항목 */}
        <span>반려동물</span>
        <div className={styles.controls}> {/* 반려동물 수 조절 컨트롤 */}
          {/* 반려동물 감소 버튼: 현재 반려동물 수가 0마리 이하면 비활성화 */}
          <button onClick={() => handlePetChange(-1)} disabled={pets <= 0}>-</button>
          <span>{pets}</span> {/* 현재 반려동물 수 표시 */}
          {/* 반려동물 증가 버튼 */}
          <button onClick={() => handlePetChange(1)}>+</button>
        </div>
      </div>
    </div>
  );
};

export default GuestPetSelector;
