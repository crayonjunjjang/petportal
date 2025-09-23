// src/components/common/Pagination.jsx

// --- IMPORT ---
import React from 'react';
import styles from './Pagination.module.css'; // 컴포넌트 전용 CSS 모듈

/**
 * @component Pagination
 * @description 페이지네이션 컨트롤을 렌더링하는 컴포넌트입니다.
 * `PensionPage.jsx`와 같이 목록을 여러 페이지로 나누어 보여줄 때 사용됩니다.
 *
 * @param {object} props - 컴포넌트에 전달되는 속성(props).
 * @param {number} props.currentPage - 현재 활성화된 페이지 번호.
 * @param {number} props.totalPages - 전체 페이지 수.
 * @param {function(number): void} props.onPageChange - 페이지 번호 클릭 시 호출될 콜백 함수.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 전체 페이지 수가 1페이지 이하면 페이지네이션 컴포넌트를 렌더링할 필요가 없으므로 null을 반환합니다.
  if (totalPages <= 1) {
    return null;
  }

  // 1부터 `totalPages`까지의 페이지 번호를 담은 배열을 생성합니다. (예: [1, 2, 3, ...])
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={styles.pagination}> {/* 페이지네이션 전체를 감싸는 nav 태그 */}
      <ul>
        {/* 이전 페이지로 이동하는 버튼 */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)} // 클릭 시 `onPageChange` 함수에 현재 페이지 - 1 전달
            disabled={currentPage === 1} // 현재 페이지가 1이면 버튼 비활성화
            className={styles.navButton}
          >
            &laquo; {/* 이중 꺾쇠 (왼쪽 화살표) */}
          </button>
        </li>

        {/* 각 페이지 번호 버튼들을 렌더링 */}
        {pageNumbers.map(number => (
          <li key={number}> {/* 각 페이지 번호에 고유 key 부여 */}
            <button
              onClick={() => onPageChange(number)} // 클릭 시 `onPageChange` 함수에 해당 페이지 번호 전달
              // 현재 페이지와 일치하면 `active` 스타일 적용
              className={currentPage === number ? styles.active : ''}
            >
              {number}
            </button>
          </li>
        ))}

        {/* 다음 페이지로 이동하는 버튼 */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)} // 클릭 시 `onPageChange` 함수에 현재 페이지 + 1 전달
            disabled={currentPage === totalPages} // 현재 페이지가 마지막 페이지이면 버튼 비활성화
            className={styles.navButton}
          >
            &raquo; {/* 이중 꺾쇠 (오른쪽 화살표) */}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
