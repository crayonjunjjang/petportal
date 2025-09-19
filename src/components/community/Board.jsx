import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Board.module.css';

// 👇 1. props로 boardKey를 받습니다.
const Board = ({ notices, posts, boardKey }) => {
  return (
    <table className={styles.boardTable}>
      <thead>
        <tr>
          <th className={styles.thNumber}>번호</th>
          <th className={styles.thTitle}>제목</th>
          <th className={styles.thAuthor}>작성자</th>
          <th className={styles.thDate}>작성일</th>
          <th className={styles.thViews}>조회수</th>
        </tr>
      </thead>
      <tbody>
        {notices.map(post => (
          <tr key={post.id} className={styles.noticeRow}>
            <td><span className={styles.noticeBadge}>공지</span></td>
            <td className={styles.tdTitle}>
              {/* 👇 2. boardKey 없이 postId만 사용하도록 경로를 수정합니다. */}
              <Link to={`/community/posts/${post.id}`}>{post.title}</Link>
            </td>
            <td>{post.author_name || '알 수 없음'}</td>
            <td>{post.createdAt}</td>
            <td>{post.views}</td>
          </tr>
        ))}
        {posts.map(post => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td className={styles.tdTitle}>
              {/* 👇 2. boardKey 없이 postId만 사용하도록 경로를 수정합니다. */}
              <Link to={`/community/posts/${post.id}`}>{post.title}</Link>
            </td>
            <td>{post.author_name || '알 수 없음'}</td>
            <td>{post.createdAt}</td>
            <td>{post.views}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;