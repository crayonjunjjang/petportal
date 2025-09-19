// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { ProfileProvider } from './context/ProfileContext';
import { UIProvider, useUI } from './contexts/UIContext.jsx';
import { CartProvider } from './contexts/CartContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext';
import { SearchProvider } from './contexts/SearchContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Common Components
import LoadingOverlay from './components/common/LoadingOverlay';
import Spinner from './components/ui/Spinner';
import ScrollToTop from './components/common/ScrollToTop';
import AdminProtectedRoute from './providers/AdminProtectedRoute';

// Profile Components (모달)
import UserProfile from './components/profile/UserProfile';
import PetProfile from './components/profile/PetProfile';
import AddPetForm from './components/profile/AddPetForm';

// Service Pages (직접 import)
import GroomingPage from './pages/GroomingPage';
import HospitalPage from './pages/HospitalPage';
import HotelPage from './pages/HotelPage';
import CafePage from './pages/CafePage';

// --- Lazy Loaded Page Components ---
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const CustomerServicePage = lazy(() => import('./pages/CustomerServicePage.jsx'));
import CommunityPage from './pages/CommunityPage.jsx'; // Direct import for debugging
const PostEditor = lazy(() => import('./pages/PostEditor.jsx'));
const PostDetail = lazy(() => import('./pages/PostDetail.jsx'));
const SupportPage = lazy(() => import('./pages/SupportPage.jsx')); // 고객센터 페이지
const PensionPage = lazy(() => import('./pages/PensionPage.jsx'));
const PensionDetailPage = lazy(() => import('./pages/PensionDetailPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const CafeDetailPageComponent = lazy(() => import('./pages/CafeDetailPage.jsx'));
const PetSuppliesPage = lazy(() => import('./pages/PetSuppliesPage.jsx'));
const PetSupplyDetailPage = lazy(() => import('./pages/PetSupplyDetailPage.jsx'));
const HotelDetailPage = lazy(() => import('./pages/HotelDetailPage.jsx')); // Added
const GroomingDetailPage = lazy(() => import('./pages/GroomingDetailPage.jsx')); // Added
const HospitalDetailPage = lazy(() => import('./pages/HospitalDetailPage.jsx')); // Added
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'));

// Maintenance Page
const MaintenancePage = lazy(() => import('./pages/MaintenancePage.jsx'));

// App Content Component (useLocation을 사용하기 위해 Router 내부에 있어야 함)
function AppContent() {
  const location = useLocation();
  const { isLoading } = useUI();
  const { isMaintenanceMode } = useMaintenance();

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isMaintenanceMode && !isAdminRoute) {
    return (
      <div className="App main-app-container">
        <Suspense fallback={<div className="suspense-fallback"><Spinner /></div>}>
          <MaintenancePage />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="App main-app-container">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <LoadingOverlay isLoading={isLoading} />
      <Header />
      
      <main>
        <ScrollToTop />
        <Suspense fallback={<div className="suspense-fallback"><Spinner /></div>}>
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<HomePage />} />

            {/* 관리자 페이지 */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminDashboardPage />
                </AdminProtectedRoute>
              }
            />
            
            {/* 서비스 페이지들 */}
            <Route path="/grooming" element={<GroomingPage />} />
            <Route path="/grooming/:groomingId" element={<GroomingDetailPage />} />
            <Route path="/hospital" element={<HospitalPage />} />
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/hotel/:hotelId" element={<HotelDetailPage />} />
            <Route path="/cafe" element={<CafePage />} />
            <Route path="/cafe/:cafeId" element={<CafeDetailPageComponent />} />
            
            {/* 고객센터 페이지 */}
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
            <Route path="/community/:boardKey/new" element={<PostEditor />} />
            <Route path="/community/edit/:postId" element={<PostEditor />} />
            <Route path="/community/posts/:postId" element={<PostDetail />} />
            <Route path="/community/:boardKey" element={<CommunityPage />} />

            {/* 고객센터 페이지 */}
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/:boardKey" element={<SupportPage />} />

            {/* 펜션/숙박 페이지 */}
            <Route path="/pet-friendly-lodging" element={<PensionPage />} />
            <Route path="/pet-friendly-lodging/:pensionId" element={<PensionDetailPage />} />
            
            <Route path="/cart" element={<CartPage />} />
            
            {/* 반려용품 페이지 */}
            <Route path="/pet-supplies" element={<PetSuppliesPage />} />
            <Route path="/pet-supplies/category/:category" element={<PetSuppliesPage />} />
            <Route path="/pet-supplies/:id" element={<PetSupplyDetailPage />} />
            
            {/* 기타 페이지들 */}
            <Route path="/care" element={<Navigate to="/grooming" replace />} />
            <Route path="/bulletin" element={<Navigate to="/pet-friendly-lodging" replace />} />
            
            {/* 404 처리 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
      
      {/* 프로필 관련 모달들 */}
      <UserProfile />
      <PetProfile />
      <AddPetForm />
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AdminAuthProvider>
      <ProfileProvider>
        <UIProvider>
          <CartProvider>
            <CommunityProvider>
              <MaintenanceProvider>
                <SearchProvider>
                  <AppContent />
                </SearchProvider>
              </MaintenanceProvider>
            </CommunityProvider>
          </CartProvider>
        </UIProvider>
      </ProfileProvider>
    </AdminAuthProvider>
  );
}

export default App;