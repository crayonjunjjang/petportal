import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 보여줄 페이지가 1페이지 이하면 아무것도 렌더링하지 않습니다.
  if (totalPages <= 1) {
    return null;
  }

  // 페이지 번호들을 배열로 만듭니다. (예: [1, 2, 3])
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={styles.pagination}>
      <ul>
        {/* 이전 페이지 버튼 */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.navButton}
          >
            &laquo;
          </button>
        </li>

        {/* 페이지 번호 버튼들 */}
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={currentPage === number ? styles.active : ''}
            >
              {number}
            </button>
          </li>
        ))}

        {/* 다음 페이지 버튼 */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.navButton}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;