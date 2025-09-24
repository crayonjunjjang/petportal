import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Board.module.css';

const Board = ({ notices, posts, boardKey, totalPosts, currentPage, postsPerPage }) => {
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
              <Link to={`/community/${boardKey}/posts/${post.id}`}>{post.title}</Link>
            </td>
            <td>{post.author || '알 수 없음'}</td>
            <td>{post.createdAt}</td>
            <td>{post.views}</td>
          </tr>
        ))}
        {posts.map((post, index) => (
          <tr key={post.id}>
            <td>{totalPosts - ((currentPage - 1) * postsPerPage) - index}</td>
            <td className={styles.tdTitle}>
              <Link to={`/community/${boardKey}/posts/${post.id}`}>{post.title}</Link>
            </td>
            <td>{post.author || '알 수 없음'}</td>
            <td>{post.createdAt}</td>
            <td>{post.views}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;