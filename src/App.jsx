// C:\Users\1\Desktop\my-app\src\App.jsx

// --- 파일 역할: 애플리케이션의 메인 라우팅 및 전역 Context 설정 ---
// 이 파일은 애플리케이션의 최상위 컴포넌트인 `App`을 정의합니다.
// `react-router-dom`을 사용하여 URL 경로에 따른 페이지 렌더링을 관리하며,
// 전역적으로 사용되는 Context Provider들을 `AppContent` 컴포넌트 외부에 배치하여
// 모든 하위 컴포넌트에서 해당 Context의 값에 접근할 수 있도록 합니다.
// 또한, 성능 최적화를 위해 대부분의 페이지 컴포넌트를 `React.lazy`를 사용하여 지연 로딩합니다.

// --- IMPORT ---
import React, { Suspense, lazy } from 'react'; // React의 핵심 기능 및 코드 분할을 위한 lazy, Suspense
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // 라우팅 관련 훅 및 컴포넌트
import { ToastContainer } from 'react-toastify'; // 알림 메시지 표시를 위한 라이브러리
import 'react-toastify/dist/ReactToastify.css'; // Toastify 스타일

// --- Context Providers (AppContent 내부에서 사용될 Context들) ---
// main.jsx에서 이미 제공되는 Context들을 제외하고, AppContent 내부에서 필요한 Context들만 import 합니다.
import { CartProvider } from './contexts/CartContext'; // 장바구니 상태 관리 Context
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext'; // 유지보수 모드 관리 Context
import { SearchProvider } from './contexts/SearchContext';
import { useUI } from './contexts/UIContext'; // 검색 관련 상태 관리 Context

// --- Layout Components (레이아웃 관련 컴포넌트) ---
import Header from './components/layout/Header'; // 애플리케이션 상단 헤더
import Footer from './components/layout/Footer'; // 애플리케이션 하단 푸터

// --- Common Components (공통적으로 사용되는 컴포넌트) ---
import LoadingOverlay from './components/common/LoadingOverlay'; // 전역 로딩 오버레이
import Spinner from './components/ui/Spinner'; // 로딩 스피너 UI
import ScrollToTop from './components/common/ScrollToTop'; // 라우트 변경 시 페이지 상단으로 스크롤
import AdminProtectedRoute from './providers/AdminProtectedRoute'; // 관리자 전용 경로 보호 컴포넌트

// --- Profile Components (프로필 관련 모달 컴포넌트) ---
// 이 컴포넌트들은 모달 형태로 구현되어 전역적으로 사용될 수 있습니다.
import UserProfile from './components/profile/UserProfile'; // 사용자 프로필 모달
import PetProfile from './components/profile/PetProfile'; // 반려동물 프로필 모달
import AddPetForm from './components/profile/AddPetForm'; // 반려동물 추가 폼 모달

// --- Service Pages (서비스 페이지 - 직접 import 또는 Lazy Loading) ---
// 일부 페이지는 초기 로딩을 위해 직접 import하고, 나머지는 성능 최적화를 위해 지연 로딩합니다.
import GroomingPage from './pages/GroomingPage'; // 미용 서비스 페이지
import HospitalPage from './pages/HospitalPage.jsx'; // 병원 서비스 페이지
import HotelPage from './pages/HotelPage'; // 호텔 서비스 페이지
import CafePage from './pages/CafePage'; // 카페 서비스 페이지

// --- Lazy Loaded Page Components (지연 로딩되는 페이지 컴포넌트) ---
// `React.lazy`를 사용하여 컴포넌트가 실제로 렌더링될 때까지 코드 로딩을 지연시킵니다.
// 이는 초기 번들 크기를 줄여 애플리케이션 로딩 속도를 향상시킵니다.
const HomePage = lazy(() => import('./pages/HomePage.jsx')); // 홈 페이지
const CustomerServicePage = lazy(() => import('./pages/CustomerServicePage.jsx')); // 고객센터 페이지
const CommunityPage = lazy(() => import('./pages/CommunityPage.jsx')); // 커뮤니티 페이지
const PostEditor = lazy(() => import('./pages/PostEditor.jsx')); // 게시글 작성/수정 페이지
const PostDetail = lazy(() => import('./pages/PostDetail.jsx')); // 게시글 상세 페이지
const SupportPage = lazy(() => import('./pages/SupportPage.jsx')); // 고객지원 페이지
const PensionPage = lazy(() => import('./pages/PensionPage.jsx')); // 펜션/숙박 목록 페이지
const PensionDetailPage = lazy(() => import('./pages/PensionDetailPage.jsx')); // 펜션/숙박 상세 페이지
const CartPage = lazy(() => import('./pages/CartPage.jsx')); // 장바구니 페이지
const CafeDetailPage = lazy(() => import('./pages/CafeDetailPage.jsx')); // 카페 상세 페이지
const ProductPage = lazy(() => import('./pages/ProductPage.jsx')); // 반려동물 용품 목록 페이지
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx')); // 반려동물 용품 상세 페이지
const HotelDetailPage = lazy(() => import('./pages/HotelDetailPage.jsx')); // 호텔 상세 페이지
const GroomingDetailPage = lazy(() => import('./pages/GroomingDetailPage.jsx')); // 미용 상세 페이지
const HospitalDetailPage = lazy(() => import('./pages/HospitalDetailPage.jsx')); // 병원 상세 페이지
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx')); // 관리자 로그인 페이지
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx')); // 관리자 대시보드 페이지

// Maintenance Page (유지보수 페이지)
const MaintenancePage = lazy(() => import('./pages/MaintenancePage.jsx')); // 유지보수 중임을 알리는 페이지

// --- AppContent Component ---
// `useLocation` 훅을 사용하기 위해 `BrowserRouter` (main.jsx) 내부에 위치해야 합니다.
// 이 컴포넌트는 실제 라우팅 로직과 페이지 렌더링을 담당합니다.
function AppContent() {
  const location = useLocation(); // 현재 URL 경로 정보를 가져옵니다.
  const { isLoading } = useUI(); // 전역 UI 로딩 상태를 가져옵니다.
  const { isMaintenanceMode } = useMaintenance(); // 유지보수 모드 상태를 가져옵니다.

  // 현재 경로가 관리자 경로인지 확인합니다.
  const isAdminRoute = location.pathname.startsWith('/admin');

  // 유지보수 모드이고 현재 경로가 관리자 경로가 아니라면 유지보수 페이지를 렌더링합니다.
  if (isMaintenanceMode && !isAdminRoute) {
    return (
      <div className="App main-app-container"> {/* 앱의 메인 컨테이너 */}
        {/* Suspense: 지연 로딩되는 컴포넌트가 로딩될 때까지 fallback UI를 보여줍니다. */}
        <Suspense fallback={<div className="suspense-fallback"><Spinner /></div>}>
          <MaintenancePage />
        </Suspense>
      </div>
    );
  }

  // 일반적인 애플리케이션 콘텐츠 렌더링
  return (
    <div className="App main-app-container"> {/* 앱의 메인 컨테이너 */}
      {/* ToastContainer: 전역 알림 메시지를 표시합니다. */}
      <ToastContainer position="bottom-right" autoClose={3000} />
      {/* LoadingOverlay: 전역 로딩 상태일 때 오버레이를 표시합니다. */}
      <LoadingOverlay isLoading={isLoading} />
      {/* Header: 애플리케이션 상단 헤더 */}
      <Header />
      
      <main> {/* 메인 콘텐츠 영역 */}
        {/* ScrollToTop: 라우트 변경 시 페이지 상단으로 스크롤합니다. */}
        <ScrollToTop />
        {/* Suspense: 지연 로딩되는 페이지 컴포넌트가 로딩될 때까지 fallback UI를 보여줍니다. */}
        <Suspense fallback={<div className="suspense-fallback"><Spinner /></div>}>
          {/* Routes: URL 경로에 따라 적절한 컴포넌트를 렌더링합니다. */}
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<HomePage />} />

            {/* 관리자 페이지 */}
            <Route path="/admin/login" element={<AdminLoginPage />} /> {/* 관리자 로그인 페이지 */}
            <Route
              path="/admin/*" // /admin으로 시작하는 모든 경로
              element={
                // AdminProtectedRoute: 관리자만 접근할 수 있도록 경로를 보호합니다.
                <AdminProtectedRoute>
                  <AdminDashboardPage /> {/* 관리자 대시보드 페이지 */}
                </AdminProtectedRoute>
              }
            />
            
            {/* 서비스 페이지들 */}
            <Route path="/grooming" element={<GroomingPage />} />
            <Route path="/grooming/:groomingId" element={<GroomingDetailPage />} />
            <Route path="/hospital" element={<HospitalPage />} />
            <Route path="/hospital/:hospitalId" element={<HospitalDetailPage />} />
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/hotel/:hotelId" element={<HotelDetailPage />} />
            <Route path="/cafe" element={<CafePage />} />
            <Route path="/cafe/:cafeId" element={<CafeDetailPage />} />
            
            {/* 고객센터 페이지 (다양한 서브 경로를 CustomerServicePage로 라우팅) */}
            <Route path="/customerservice" element={<CustomerServicePage />} />
            <Route path="/about" element={<CustomerServicePage />} />
            <Route path="/notice" element={<CustomerServicePage />} />
            <Route path="/faq" element={<CustomerServicePage />} />
            <Route path="/support" element={<CustomerServicePage />} />
            <Route path="/inquiry" element={<CustomerServicePage />} />
            <Route path="/terms" element={<CustomerServicePage />} />
            <Route path="/privacy" element={<CustomerServicePage />} />
            <Route path="/youth" element={<CustomerServicePage />} />
            <Route path="/policy" element={<CustomerServicePage />} />
            
            {/* 커뮤니티 페이지 */}
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:boardKey/new" element={<PostEditor />} /> {/* 새 게시글 작성 */}
            <Route path="/community/edit/:postId" element={<PostEditor />} /> {/* 게시글 수정 */}
            <Route path="/community/:boardKey/posts/:postId" element={<PostDetail />} /> {/* 게시글 상세 보기 */}
            <Route path="/community/:boardKey" element={<CommunityPage />} /> {/* 특정 게시판 목록 */}

            {/* 고객지원 페이지 (SupportPage로 라우팅) */}
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/:boardKey" element={<SupportPage />} />

            {/* 펜션/숙박 페이지 */}
            <Route path="/pet-friendly-lodging" element={<PensionPage />} />
            <Route path="/pet-friendly-lodging/:pensionId" element={<PensionDetailPage />} />
            
            {/* 장바구니 페이지 */}
            <Route path="/cart" element={<CartPage />} />
            
            {/* 반려동물 용품 페이지 */}
            <Route path="/product" element={<ProductPage />} />
            <Route path="/product/category/:category" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            
            {/* 기타 페이지들 (리디렉션) */}
            <Route path="/care" element={<Navigate to="/grooming" replace />} />
            <Route path="/bulletin" element={<Navigate to="/pet-friendly-lodging" replace />} />
            
            {/* 404 처리: 정의되지 않은 모든 경로를 홈 페이지로 리디렉션 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer /> {/* 애플리케이션 하단 푸터 */}
      
      {/* 프로필 관련 모달들 (전역적으로 렌더링되어 필요 시 표시) */}
      <AddPetForm />
      <PetProfile />
      <UserProfile />
    </div>
  );
}

// --- Main App Component ---
// 이 컴포넌트는 `main.jsx`에서 렌더링되며, `AppContent`를 필요한 Context Provider로 래핑합니다.
// `main.jsx`에서 이미 `AuthProvider`, `AdminAuthProvider`, `ProfileProvider`, `UIProvider`, `CommunityProvider`를 제공하고 있으므로,
// 여기서는 `CartProvider`, `MaintenanceProvider`, `SearchProvider`만 추가합니다.
function App() {
  return (
    <CartProvider>
      <MaintenanceProvider>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </MaintenanceProvider>
    </CartProvider>
  );
}

export default App;
