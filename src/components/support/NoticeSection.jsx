// src/components/support/NoticeSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NoticeSection.module.css';

const NoticeSection = () => {
  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  const fetchNotices = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/support/notices?page=${page}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setNotices(data.data.notices);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('공지사항 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeClick = (noticeId) => {
    navigate(`/support/notices/${noticeId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const renderPagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    // 이전 페이지
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className={styles.pageButton}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          이전
        </button>
      );
    }

    // 페이지 번호
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    // 다음 페이지
    if (currentPage < pagination.totalPages) {
      pages.push(
        <button
          key="next"
          className={styles.pageButton}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          다음
        </button>
      );
    }

    return <div className={styles.pagination}>{pages}</div>;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>공지사항을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>공지사항</h2>
        <p className={styles.description}>
          중요한 업데이트와 새로운 소식을 확인하세요.
        </p>
      </div>

      <div className={styles.noticeList}>
        {notices.length === 0 ? (
          <div className={styles.empty}>
            <p>등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className={`${styles.noticeItem} ${notice.isImportant ? styles.important : ''}`}
              onClick={() => handleNoticeClick(notice.id)}
            >
              <div className={styles.noticeHeader}>
                <div className={styles.noticeTitle}>
                  {notice.isImportant && (
                    <span className={styles.importantBadge}>중요</span>
                  )}
                  <span className={styles.titleText}>{notice.title}</span>
                </div>
                <div className={styles.noticeInfo}>
                  <span className={styles.author}>{notice.author?.username || '관리자'}</span>
                  <span className={styles.divider}>•</span>
                  <span className={styles.date}>{formatDate(notice.createdAt)}</span>
                  <span className={styles.divider}>•</span>
                  <span className={styles.views}>조회 {notice.views}</span>
                </div>
              </div>
              <div className={styles.noticePreview}>
                {notice.content.length > 100
                  ? `${notice.content.substring(0, 100)}...`
                  : notice.content
                }
              </div>
            </div>
          ))
        )}
      </div>

      {renderPagination()}
    </div>
  );
};

export default NoticeSection;