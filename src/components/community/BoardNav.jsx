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
        {/* 지도 테스트 페이지로 가는 임시 링크 */}
        <li style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
          <Link to="/map-test" className={activeBoard === 'map-test' ? styles.active : ''}>
            🗺️ 지도 테스트
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default BoardNav;