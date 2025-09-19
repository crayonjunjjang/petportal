// src/components/support/MyInquiriesSection.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './MyInquiriesSection.module.css';

const MyInquiriesSection = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyInquiries(currentPage);
    }
  }, [user, currentPage]);

  const fetchMyInquiries = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/support/my-inquiries?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          localStorage.removeItem('authToken');
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setInquiries(data.data.inquiries);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('내 문의 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (inquiryId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(inquiryId)) {
      newExpanded.delete(inquiryId);
    } else {
      newExpanded.add(inquiryId);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: '답변대기', className: 'pending' },
      answered: { text: '답변완료', className: 'answered' },
      closed: { text: '문의종료', className: 'closed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`${styles.statusBadge} ${styles[config.className]}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

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

  if (!user) {
    return (
      <div className={styles.loginRequired}>
        <div className={styles.loginIcon}>🔒</div>
        <h3>로그인이 필요합니다</h3>
        <p>문의내역을 확인하려면 먼저 로그인해주세요.</p>
        <button
          className={styles.loginButton}
          onClick={() => window.location.href = '/login'}
        >
          로그인하기
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>문의내역을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>내 문의내역</h2>
        <p className={styles.description}>
          등록한 문의사항과 답변을 확인할 수 있습니다.
        </p>
      </div>

      <div className={styles.inquiryList}>
        {inquiries.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>등록된 문의가 없습니다</h3>
            <p>궁금한 점이 있으시면 1:1 문의를 이용해보세요.</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className={styles.inquiryItem}>
              <div
                className={styles.inquiryHeader}
                onClick={() => toggleExpand(inquiry.id)}
              >
                <div className={styles.inquiryTitle}>
                  <span className={styles.category}>{inquiry.category}</span>
                  <h3 className={styles.titleText}>{inquiry.title}</h3>
                  {getStatusBadge(inquiry.status)}
                </div>
                <div className={styles.inquiryInfo}>
                  <span className={styles.date}>등록일: {formatDate(inquiry.createdAt)}</span>
                  {inquiry.respondedAt && (
                    <span className={styles.responseDate}>
                      답변일: {formatDate(inquiry.respondedAt)}
                    </span>
                  )}
                </div>
                <span className={`${styles.expandIcon} ${
                  expandedItems.has(inquiry.id) ? styles.expanded : ''
                }`}>
                  ▼
                </span>
              </div>

              {expandedItems.has(inquiry.id) && (
                <div className={styles.inquiryDetails}>
                  <div className={styles.inquiryContent}>
                    <h4 className={styles.contentTitle}>문의 내용</h4>
                    <div className={styles.contentText}>
                      {inquiry.content.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>

                  {inquiry.adminResponse && (
                    <div className={styles.adminResponse}>
                      <h4 className={styles.responseTitle}>
                        📞 관리자 답변
                        {inquiry.responder && (
                          <span className={styles.responder}>
                            - {inquiry.responder.username}
                          </span>
                        )}
                      </h4>
                      <div className={styles.responseText}>
                        {inquiry.adminResponse.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {inquiry.status === 'pending' && (
                    <div className={styles.pendingNotice}>
                      <p>답변을 준비 중입니다. 조금만 기다려주세요.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {renderPagination()}
    </div>
  );
};

export default MyInquiriesSection;