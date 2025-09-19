// src/components/support/SupportBoardNav.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './SupportBoardNav.module.css';

const SupportBoardNav = ({ boards, activeBoard, onBoardChange }) => {
  const { user } = useAuth();

  const boardIcons = {
    'notices': '📢',
    'faq': '❓',
    'inquiry': '✉️',
    'my-inquiries': '📋'
  };

  const getVisibleBoards = () => {
    const visibleBoards = ['notices', 'faq'];

    if (user) {
      visibleBoards.push('inquiry', 'my-inquiries');
    }

    return visibleBoards;
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {getVisibleBoards().map((boardKey) => (
          <li key={boardKey} className={styles.navItem}>
            <button
              className={`${styles.navButton} ${
                activeBoard === boardKey ? styles.active : ''
              }`}
              onClick={() => onBoardChange(boardKey)}
            >
              <span className={styles.navIcon}>
                {boardIcons[boardKey]}
              </span>
              <span className={styles.navText}>
                {boards[boardKey]?.name}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {!user && (
        <div className={styles.loginPrompt}>
          <p className={styles.promptText}>
            1:1 문의를 이용하려면<br />
            로그인이 필요합니다.
          </p>
          <button
            className={styles.loginButton}
            onClick={() => window.location.href = '/login'}
          >
            로그인하기
          </button>
        </div>
      )}
    </nav>
  );
};

export default SupportBoardNav;