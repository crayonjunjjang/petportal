// src/components/service/ServicePageLayout.jsx
import React from 'react';
import GroomingMapView from './maps/GroomingMapView';
import CafeMapView from './maps/CafeMapView';
import HospitalMapView from './maps/HospitalMapView';
import HotelMapView from './maps/HotelMapView';
import BusinessCardGrid from '../common/BusinessCardGrid';
import Pagination from '../common/Pagination';
import styles from './ServicePageLayout.module.css';

const ServicePageLayout = ({
  title,
  subtitle,
  userLocation,
  markers,
  serviceType = 'grooming', // New: service type parameter
  filters = {}, // New: filters parameter
  onMarkerClick, // New: marker click handler
  children, // 필터 컴포넌트
  items,
  currentPage,
  totalPages,
  onPageChange,
  loading,
  error
}) => {
  if (loading) {
    return <div className={styles.loadingContainer}>정보를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        오류: {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}
      </div>
    );
  }

  return (
    <div className={styles.serviceContainer}>
      {/* 헤더 */}
      <header className={styles.serviceHeader}>
        <h1 className={styles.serviceTitle}>{title}</h1>
        <p className={styles.serviceSubtitle}>{subtitle}</p>
      </header>

      {/* 메인 컨텐츠 */}
      <div className={styles.mainContent}>
        {/* 왼쪽 필터 패널 */}
        <aside className={styles.filterPanel}>
          {children}
        </aside>

        {/* 오른쪽 지도 */}
        <div className={styles.mapContainer}>
          {renderServiceMap(serviceType, userLocation, markers, filters, onMarkerClick)}
        </div>
      </div>

      {/* 하단 결과 그리드 */}
      <section className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h2>검색 결과 ({items.length}개)</h2>
        </div>
        
        <div className={styles.resultsGrid}>
          <BusinessCardGrid items={items} />
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </section>
    </div>
  );
};

// Helper function to render appropriate service map
const renderServiceMap = (serviceType, userLocation, markers, filters, onMarkerClick) => {
  const commonProps = {
    userLocation,
    markers,
    filters,
    onMarkerClick
  };

  switch (serviceType) {
    case 'grooming':
      return <GroomingMapView {...commonProps} />;
    case 'cafe':
      return <CafeMapView {...commonProps} />;
    case 'hospital':
      return <HospitalMapView {...commonProps} />;
    case 'hotel':
      return <HotelMapView {...commonProps} />;
    default:
      return <GroomingMapView {...commonProps} />;
  }
};

export default ServicePageLayout;