// src/components/admin/AdminNotifications.jsx
// src/components/admin/AdminNotifications.jsx
// 이 파일은 관리자 대시보드에서 미답변 문의 수를 표시하고, 해당 문의 페이지로 이동하는 링크를 제공하는 컴포넌트입니다.
// 관리자에게 처리해야 할 알림(예: 새로운 문의)이 있음을 시각적으로 알려줍니다.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminStyles from './Admin.module.css';

const AdminNotifications = () => { // 관리자 알림 컴포넌트 정의
  const { isAdminAuthenticated } = useAdminAuth(); // 관리자 인증 상태를 가져옵니다.
  const [pendingCount, setPendingCount] = useState(0); // 미답변 문의 수를 저장하는 상태
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태

  useEffect(() => { // 컴포넌트 마운트 시 또는 관리자 인증 상태 변경 시 미답변 문의 수를 가져옵니다.
    if (isAdminAuthenticated) {
      fetchPendingCount();
    }
  }, [isAdminAuthenticated]); // isAdminAuthenticated가 변경될 때마다 실행됩니다.

  const fetchPendingCount = async () => { // 미답변 문의 수를 비동기적으로 가져오는 함수
    try {
      setLoading(true); // 로딩 상태 시작
      // Mocking the pending count for frontend-only mode
      await new Promise(resolve => setTimeout(resolve, 500)); // API 지연 시뮬레이션
      const mockPendingCount = 3; // 하드코딩된 목업 값
      setPendingCount(mockPendingCount); // 미답변 문의 수 상태 업데이트
    } catch (error) {
      console.error('미답변 문의 수 조회 오류 (Mocked):', error);
      setPendingCount(0); // 에러 발생 시 0으로 설정
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return ( // 알림 컴포넌트의 UI 렌더링
    <div className={adminStyles.notificationContainer}>
      <Link // 문의 페이지로 이동하는 링크
        to="/admin/support"
        className={`${adminStyles.notificationLink} ${pendingCount > 0 ? adminStyles.hasNotification : ''}`} // 미답변 문의가 있을 경우 알림 스타일 적용
        title={`미답변 문의 ${pendingCount}건`} // 툴팁으로 미답변 문의 수 표시
      >
        <span className={adminStyles.notificationIcon}>🔔</span> {/* 알림 아이콘 */}
        <span className={adminStyles.notificationText}>문의</span> {/* 텍스트 */}
        {pendingCount > 0 && ( // 미답변 문의가 0보다 클 경우에만 뱃지 표시
          <span className={adminStyles.notificationBadge}>
            {pendingCount > 99 ? '99+' : pendingCount} {/* 99개 초과 시 99+로 표시 */}
          </span>
        )}
      </Link>
    </div>
  );
};

export default AdminNotifications; // AdminNotifications 컴포넌트 내보내기