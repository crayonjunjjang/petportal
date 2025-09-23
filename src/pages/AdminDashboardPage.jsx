// src/pages/AdminDashboardPage.jsx
import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import adminStyles from '../components/admin/Admin.module.css'; // Admin specific styles
import UserManagement from '../components/admin/UserManagement';
import CommunityPostManagement from '../components/admin/CommunityPostManagement';
import CommunityCommentManagement from '../components/admin/CommunityCommentManagement';
import CafeManagement from '../components/admin/CafeManagement';
import AccommodationManagement from '../components/admin/AccommodationManagement';
import HospitalManagement from '../components/admin/HospitalManagement';
import HotelManagement from '../components/admin/HotelManagement';
import GroomingManagement from '../components/admin/GroomingManagement';
import MaintenanceManagement from '../components/admin/MaintenanceManagement';
import PetSuppliesManagement from '../components/admin/PetSuppliesManagement';
import SupportManagement from '../components/admin/SupportManagement';
import AdminNotifications from '../components/admin/AdminNotifications';

const AdminDashboardPage = () => {
  const { adminUser, isAdminLoading, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  if (isAdminLoading) {
    return <div className={adminStyles.pageContainer}>관리자 대시보드 로딩 중...</div>;
  }

  if (!adminUser) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className={adminStyles.adminDashboard}>
      <div className={adminStyles.adminSidebar}>
        <h2>관리자 메뉴</h2>
        <div className={adminStyles.sidebarHeader}>
          <AdminNotifications />
          <button onClick={handleLogout} className={adminStyles.logoutButton}>로그아웃</button>
        </div>
        <nav>
          <ul>
            <li><Link to="/admin/users" className={adminStyles.adminSidebarLink}>사용자 관리</Link></li>
            <li><Link to="/admin/pet-supplies" className={adminStyles.adminSidebarLink}>반려용품 관리</Link></li>
            <li><Link to="/admin/support" className={adminStyles.adminSidebarLink}>고객센터 관리</Link></li>
            <li><Link to="/admin/community/posts" className={adminStyles.adminSidebarLink}>커뮤니티 게시글 관리</Link></li>
            <li><Link to="/admin/community/comments" className={adminStyles.adminSidebarLink}>커뮤니티 댓글 관리</Link></li>
            <li><Link to="/admin/cafe" className={adminStyles.adminSidebarLink}>카페 관리</Link></li>
            <li><Link to="/admin/accommodation" className={adminStyles.adminSidebarLink}>숙박 관리</Link></li>
            <li><Link to="/admin/hospital" className={adminStyles.adminSidebarLink}>병원 관리</Link></li>
            <li><Link to="/admin/hotel" className={adminStyles.adminSidebarLink}>호텔 관리</Link></li>
            <li><Link to="/admin/grooming" className={adminStyles.adminSidebarLink}>미용 관리</Link></li>
            <li><Link to="/admin/maintenance" className={adminStyles.adminSidebarLink}>🔧 점검 관리</Link></li>
            {/* Add more data management links as needed */}
          </ul>
        </nav>
      </div>

      <div className={adminStyles.adminContentArea}>
        <h1 className={adminStyles.pageTitle}>관리자 대시보드</h1>
        <p>환영합니다, {adminUser.username}님!</p>

        <div className={adminStyles.adminContent}>
          <Routes>
            <Route path="users" element={<UserManagement />} />
            <Route path="pet-supplies" element={<PetSuppliesManagement />} />
            <Route path="support" element={<SupportManagement />} />
            <Route path="community/posts" element={<CommunityPostManagement />} />
            <Route path="community/comments" element={<CommunityCommentManagement />} />
            <Route path="cafe" element={<CafeManagement />} />
            <Route path="accommodation" element={<AccommodationManagement />} />
            <Route path="hospital" element={<HospitalManagement />} />
            <Route path="hotel" element={<HotelManagement />} />
            <Route path="grooming" element={<GroomingManagement />} />
            <Route path="maintenance" element={<MaintenanceManagement />} />
            <Route path="/" element={<div>관리자 대시보드에 오신 것을 환영합니다. 왼쪽 메뉴에서 관리할 항목을 선택해주세요.</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
