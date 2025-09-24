// Button.jsx
// 이 파일은 재사용 가능한 버튼 컴포넌트를 정의합니다.
// 다양한 스타일(variant)과 동작(onClick, type, disabled)을 지원하며,
// 추가적인 CSS 클래스를 적용할 수 있습니다.

import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children, // 버튼 내부에 표시될 내용 (텍스트, 아이콘 등)
  onClick,  // 버튼 클릭 시 실행될 함수
  type = 'button', // 버튼의 타입 (submit, reset, button 등), 기본값은 'button'
  variant = 'primary', // 버튼의 시각적 스타일 (예: 'primary', 'secondary'), Button.module.css에 정의됨
  disabled = false, // 버튼 활성화/비활성화 상태, 기본값은 false (활성화)
  className = '' // 버튼에 추가될 커스텀 CSS 클래스
}) => {
  // `Button.module.css`에 정의된 스타일과 전달받은 `className`을 조합하여 최종 버튼 클래스를 생성합니다.
  const buttonClasses = `
    ${styles.button} // 기본 버튼 스타일
    ${styles[variant]} // variant prop에 따른 스타일 (예: styles.primary)
    ${className} // 외부에서 전달된 추가 클래스
  `;

  // React 버튼 요소를 렌더링합니다.
  return (
    <button
      type={type} // 버튼 타입 설정
      onClick={onClick} // 클릭 이벤트 핸들러 연결
      disabled={disabled} // 비활성화 상태 설정
      className={buttonClasses} // 최종 CSS 클래스 적용
    >
      {children} {/* 버튼 내용 표시 */}
    </button>
  );
};

export default Button; // Button 컴포넌트를 내보냅니다.