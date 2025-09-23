// C:\Users\1\Desktop\my-app\src\pages\AdminDashboardPage.jsx

// --- 파일 역할: 관리자 대시보드 페이지 ---
// 이 파일은 관리자 전용 대시보드 페이지를 렌더링합니다.
// 관리자는 이 페이지를 통해 사용자 관리, 게시글 관리, 서비스 관리 등 다양한 관리 기능에 접근할 수 있습니다.
// 사이드바 메뉴를 통해 각 관리 섹션으로 이동하며, 중첩 라우팅을 통해 해당 섹션의 컴포넌트를 표시합니다.

// --- IMPORT ---
import React, { useEffect } from 'react'; // React 훅 사용
import { useAdminAuth } from '../context/AdminAuthContext'; // 관리자 인증 컨텍스트
import { useNavigate, Routes, Route, Link } from 'react-router-dom'; // 라우팅 관련 훅 및 컴포넌트
import adminStyles from '../components/admin/Admin.module.css'; // 관리자 대시보드 전용 CSS 모듈

// --- 관리자 관리 컴포넌트들 ---
// 각 관리 기능별 컴포넌트들을 임포트합니다.
import UserManagement from '../components/admin/UserManagement';
import CommunityPostManagement from '../components/admin/CommunityPostManagement';
import CommunityCommentManagement from '../components/admin/CommunityCommentManagement';
import CafeManagement from '../components/admin/CafeManagement';
import AccommodationManagement from '../components/admin/AccommodationManagement';
import HospitalManagement from '../components/admin/HospitalManagement';
import HotelManagement from '../components/admin/HotelManagement';
import GroomingManagement from '../components/admin/GroomingManagement';
import MaintenanceManagement from '../components/admin/MaintenanceManagement';
import ProductManagement from '../components/admin/ProductManagement';
import SupportManagement from '../components/admin/SupportManagement';
import AdminNotifications from '../components/admin/AdminNotifications'; // 관리자 알림 컴포넌트

/**
 * @component AdminDashboardPage
 * @description 관리자 대시보드 페이지 컴포넌트입니다.
 * 관리자 로그인 후 접근할 수 있으며, 다양한 관리 기능을 제공하는 서브 페이지들로의 네비게이션을 포함합니다.
 */
const AdminDashboardPage = () => {
  // --- HOOKS & CONTEXT ---
  // useAdminAuth 훅을 통해 현재 로그인된 관리자 정보, 로딩 상태, 로그아웃 함수를 가져옵니다.
  const { adminUser, isAdminLoading, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // --- EFFECTS ---
  // `isAdminLoading` 상태를 확인하여 대시보드 로딩 중임을 표시합니다.
  if (isAdminLoading) {
    return <div className={adminStyles.pageContainer}>관리자 대시보드 로딩 중...</div>;
  }

  // `adminUser`가 없으면 (인증되지 않았으면) 관리자 로그인 페이지로 리디렉션합니다.
  // 이 로직은 `AdminProtectedRoute`에 의해 대부분 처리되지만, 혹시 모를 상황에 대비한 폴백입니다.
  if (!adminUser) {
    navigate('/admin/login');
    return null; // 리디렉션 후에는 더 이상 렌더링하지 않습니다.
  }

  // --- HANDLER FUNCTIONS ---
  /**
   * @function handleLogout
   * @description 관리자 로그아웃을 처리하는 함수입니다.
   * `logoutAdmin` 함수를 호출하여 인증 상태를 초기화하고, 관리자 로그인 페이지로 이동합니다.
   */
  const handleLogout = () => {
    logoutAdmin(); // 관리자 로그아웃 처리
    navigate('/admin/login'); // 관리자 로그인 페이지로 리디렉션
  };

  // --- RENDER ---
  return (
    <div className={adminStyles.adminDashboard}> {/* 관리자 대시보드 전체 레이아웃 */}
      <div className={adminStyles.adminSidebar}> {/* 관리자 사이드바 영역 */}
        <h2>관리자 메뉴</h2>
        <div className={adminStyles.sidebarHeader}> {/* 사이드바 헤더 (알림, 로그아웃 버튼) */}
          <AdminNotifications /> {/* 관리자 알림 컴포넌트 */}
          <button onClick={handleLogout} className={adminStyles.logoutButton}>로그아웃</button> {/* 로그아웃 버튼 */}
        </div>
        <nav> {/* 사이드바 네비게이션 메뉴 */}
          <ul>
            {/* 각 관리 기능별 링크. Link 컴포넌트를 사용하여 SPA 내에서 페이지 이동 */}
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
            {/* 필요에 따라 더 많은 데이터 관리 링크 추가 */}
          </ul>
        </nav>
      </div>

      <div className={adminStyles.adminContentArea}> {/* 관리자 콘텐츠 영역 */}
        <h1 className={adminStyles.pageTitle}>관리자 대시보드</h1>
        {/* 로그인된 관리자 사용자 이름 표시 */}
        <p>환영합니다, {adminUser.username}님!</p>

        <div className={adminStyles.adminContent}> {/* 각 관리 기능별 컴포넌트가 렌더링될 영역 */}
          {/* Routes: 중첩 라우팅을 사용하여 URL 서브 경로에 따라 다른 관리 컴포넌트를 렌더링합니다. */}
          <Routes>
            <Route path="users" element={<UserManagement />} />
            <Route path="product" element={<ProductManagement />} />
            <Route path="support" element={<SupportManagement />} />
            <Route path="community/posts" element={<CommunityPostManagement />} />
            <Route path="community/comments" element={<CommunityCommentManagement />} />
            <Route path="cafe" element={<CafeManagement />} />
            <Route path="accommodation" element={<AccommodationManagement />} />
            <Route path="hospital" element={<HospitalManagement />} />
            <Route path="hotel" element={<HotelManagement />} />
            <Route path="grooming" element={<GroomingManagement />} />
            <Route path="maintenance" element={<MaintenanceManagement />} />
            {/* 기본 경로 (예: /admin)에 대한 환영 메시지 */}
            <Route path="/" element={<div>관리자 대시보드에 오신 것을 환영합니다. 왼쪽 메뉴에서 관리할 항목을 선택해주세요.</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;;