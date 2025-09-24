import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BoardNav.module.css';

// CommunityPage에서 받을 게시판 목록 데이터
const BoardNav = ({ boards, activeBoard }) => {
  return (
    <aside className={styles.boardNav}>
      <h2>커뮤니티</h2>
      <ul>
        {Object.entries(boards).map(([key, board]) => (
          <li key={key}>
            <Link
              to={`/community/${key}`}
              className={activeBoard === key ? styles.active : ''}
            >
              {board.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default BoardNav;