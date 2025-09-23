// src/components/admin/AdminNotifications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminStyles from './Admin.module.css';

const AdminNotifications = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchPendingCount();
    }
  }, [isAdminAuthenticated]);

  const fetchPendingCount = async () => {
    try {
      setLoading(true);
      // Mocking the pending count for frontend-only mode
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      const mockPendingCount = 3; // Hardcoded mock value
      setPendingCount(mockPendingCount);
    } catch (error) {
      console.error('미답변 문의 수 조회 오류 (Mocked):', error);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={adminStyles.notificationContainer}>
      <Link
        to="/admin/support"
        className={`${adminStyles.notificationLink} ${pendingCount > 0 ? adminStyles.hasNotification : ''}`}
        title={`미답변 문의 ${pendingCount}건`}
      >
        <span className={adminStyles.notificationIcon}>🔔</span>
        <span className={adminStyles.notificationText}>문의</span>
        {pendingCount > 0 && (
          <span className={adminStyles.notificationBadge}>
            {pendingCount > 99 ? '99+' : pendingCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default AdminNotifications;