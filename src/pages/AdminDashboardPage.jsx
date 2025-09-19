import React from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboardPage.module.css';
import Button from '../components/ui/Button';

const AdminDashboardPage = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!adminUser) {
    return null; // Should be handled by AdminProtectedRoute
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>관리자 대시보드</h1>
        <Button onClick={handleLogout} variant="secondary">로그아웃</Button>
      </header>
      <p className={styles.welcomeMessage}>환영합니다, {adminUser.username}님!</p>
      <p>이곳은 관리자 전용 페이지입니다. 현재는 시뮬레이션 상태입니다.</p>
    </div>
  );
};

export default AdminDashboardPage;