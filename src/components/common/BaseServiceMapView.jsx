// src/components/common/BaseServiceMapView.jsx

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { loadKakaoMap } from '../../utils/loadKakaoMap';
import SimpleMapView from './SimpleMapView';
import ServiceMapErrorBoundary from './ServiceMapErrorBoundary';
import { SERVICE_CONFIGS } from '../../config/serviceMapConfig';
import { generateServiceMarkers, filterServiceMarkers } from '../../utils/serviceMapUtils';
import { 
  handleKakaoMapError, 
  handleMarkerError, 
  serviceMapPerformanceMonitor 
} from '../../utils/serviceMapErrorHandler';
import '../service/maps/ServiceMapAccessibility.css';

const BaseServiceMapView = ({ 
  userLocation, 
  rawMarkers = [], 
  serviceType = 'grooming',
  filters = {},
  onMarkerClick,
  className = '',
  customConfig = {}
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstances = useRef([]);
  const infoWindows = useRef([]);
  const [kakaoMaps, setKakaoMaps] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get service configuration
  const serviceConfig = useMemo(() => ({
    ...SERVICE_CONFIGS[serviceType],
    ...customConfig
  }), [serviceType, customConfig]);

  // Process and filter markers
  const processedMarkers = useMemo(() => {
    const serviceMarkers = generateServiceMarkers(rawMarkers, serviceType);
    return filterServiceMarkers(serviceMarkers, filters, serviceType);
  }, [rawMarkers, serviceType, filters]);

  // 1) Load Kakao Map script
  useEffect(() => {
    const loadTimer = serviceMapPerformanceMonitor.startTiming('kakao_map_load', {
      serviceType,
      markersCount: rawMarkers.length
    });

    const apiKey = import.meta.env.VITE_KAKAO_JS_KEY;
    
    if (!apiKey) {
      const errorMsg = '카카오맵 API 키가 설정되지 않았습니다.';
      handleKakaoMapError(new Error(errorMsg), { serviceType });
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    loadKakaoMap(apiKey)
      .then(() => {
        window.kakao.maps.load(() => {
          setKakaoMaps(window.kakao.maps);
          setIsLoading(false);
          serviceMapPerformanceMonitor.endTiming(loadTimer);
        });
      })
      .catch(err => {
        handleKakaoMapError(err, { 
          serviceType, 
          apiKey: apiKey ? 'present' : 'missing',
          markersCount: rawMarkers.length 
        });
        setError(err.message);
        setIsLoading(false);
        serviceMapPerformanceMonitor.endTiming(loadTimer);
      });
  }, [serviceType, rawMarkers.length]);

  // 2) Create map instance
  useEffect(() => {
    if (!kakaoMaps || !mapRef.current || isLoading) return;

    try {
      const center = userLocation
        ? new kakaoMaps.LatLng(userLocation.lat, userLocation.lng)
        : new kakaoMaps.LatLng(37.5665, 126.9780);

      mapInstance.current = new kakaoMaps.Map(mapRef.current, {
        center,
        level: serviceConfig.defaultZoom || 5,
      });

      // Add zoom control
      const zoomControl = new kakaoMaps.ZoomControl();
      mapInstance.current.addControl(zoomControl, kakaoMaps.ControlPosition.RIGHT);

      // Add map type control for service maps
      const mapTypeControl = new kakaoMaps.MapTypeControl();
      mapInstance.current.addControl(mapTypeControl, kakaoMaps.ControlPosition.TOPRIGHT);

    } catch (err) {
      handleKakaoMapError(err, { 
        serviceType, 
        operation: 'map_creation',
        userLocation: userLocation ? 'available' : 'unavailable'
      });
      setError(`지도 생성에 실패했습니다: ${err.message}`);
    }
  }, [kakaoMaps, isLoading, userLocation, serviceConfig]);

  // 3) Update user location
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !kakaoMaps || isLoading) return;
    
    try {
      const center = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      mapInstance.current.panTo(center);
    } catch (err) {
      handleKakaoMapError(err, { 
        serviceType, 
        operation: 'location_update',
        userLocation 
      });
    }
  }, [userLocation, kakaoMaps, isLoading]);

  // 4) Render service-specific markers
  useEffect(() => {
    if (!mapInstance.current || !processedMarkers || !kakaoMaps || isLoading) return;

    // Clear existing markers and info windows
    markerInstances.current.forEach(marker => marker.setMap(null));
    infoWindows.current.forEach(infoWindow => infoWindow.close());
    markerInstances.current = [];
    infoWindows.current = [];

    processedMarkers.forEach((markerData, idx) => {
      try {
        if (typeof markerData.lat !== 'number' || typeof markerData.lng !== 'number') {
          console.warn(`마커 ${idx} 좌표 유효하지 않음:`, markerData);
          return;
        }

        const position = new kakaoMaps.LatLng(markerData.lat, markerData.lng);
        const marker = new kakaoMaps.Marker({ 
          position, 
          title: markerData.name 
        });

        // Set service-specific marker image
        if (markerData.displayConfig) {
          const markerSize = markerData.displayConfig.size || 32;
          const markerImage = createServiceMarkerImage(
            kakaoMaps, 
            markerData.displayConfig, 
            markerSize
          );
          if (markerImage) {
            marker.setImage(markerImage);
          }
        }

        marker.setMap(mapInstance.current);

        // Add click event
        kakaoMaps.event.addListener(marker, 'click', () => {
          // Close all other info windows
          infoWindows.current.forEach(infoWindow => infoWindow.close());

          // Create and open info window
          const infoWindow = createServiceInfoWindow(kakaoMaps, markerData, serviceConfig);
          infoWindow.open(mapInstance.current, marker);
          infoWindows.current.push(infoWindow);

          // Call custom click handler
          if (onMarkerClick) {
            onMarkerClick(markerData);
          }
        });

        markerInstances.current.push(marker);
      } catch (err) {
        handleMarkerError(err, { 
          serviceType, 
          markerIndex: idx,
          markerData: {
            id: markerData.id,
            name: markerData.name,
            hasCoordinates: !!(markerData.lat && markerData.lng)
          }
        });
      }
    });
  }, [processedMarkers, kakaoMaps, isLoading, serviceConfig, onMarkerClick]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="service-map-loading"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: serviceConfig.backgroundColor || '#f8f9fa',
          fontSize: '16px',
          '--service-bg-color': serviceConfig.backgroundColor || '#f8f9fa'
        }}
        role="status"
        aria-live="polite"
        aria-label={`${serviceConfig.name} 지도 로딩 중`}
      >
        <div style={{ textAlign: 'center', color: serviceConfig.accentColor }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }} aria-hidden="true">
            {serviceConfig.markerIcon}
          </div>
          <div>{serviceConfig.name} 지도 로딩 중...</div>
        </div>
      </div>
    );
  }

  // Error state - fallback to SimpleMapView
  if (error) {
    console.warn('카카오맵 로드 실패, 대체 지도 사용:', error);
    return (
      <SimpleMapView 
        userLocation={userLocation} 
        markers={processedMarkers}
        serviceType={serviceType}
        serviceConfig={serviceConfig}
      />
    );
  }

  // Normal rendering
  return (
    <div 
      className={`service-map-container ${serviceType}-map ${className}`} 
      style={{ position: 'relative', width: '100%', height: '100%' }}
      role="application"
      aria-label={`${serviceConfig.name} 지도`}
      tabIndex={0}
    >
      {/* Skip link for keyboard users */}
      <a href="#map-content" className="skip-to-map sr-only">
        지도로 건너뛰기
      </a>
      
      {/* Screen reader announcements */}
      <div 
        className="map-announcements" 
        aria-live="polite" 
        aria-atomic="true"
        id="map-announcements"
      >
        {processedMarkers?.length || 0}개의 {serviceConfig.name} 위치가 표시됩니다.
      </div>
      
      <div
        id="map-content"
        ref={mapRef}
        style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backgroundColor: '#f0f0f0'
        }}
        aria-label="지도 영역"
      />
      
      {/* Service-specific map info panel */}
      <div 
        className="map-info-panel"
        style={{
          padding: 12, 
          fontSize: 14, 
          position: 'absolute',
          bottom: 10, 
          right: 10, 
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 8, 
          zIndex: 1000, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderLeft: `4px solid ${serviceConfig.accentColor}`
        }}
        role="status"
        aria-label="지도 상태 정보"
      >
        <div style={{ fontWeight: 'bold', color: serviceConfig.accentColor }}>
          {serviceConfig.markerIcon} {serviceConfig.name} 지도
        </div>
        <div style={{ fontSize: 12, marginTop: 4 }}>
          상태: {kakaoMaps ? '✅ 준비 완료' : '⏳ 초기화 중...'}
        </div>
        <div style={{ fontSize: 12 }}>
          위치: {userLocation
            ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
            : '확인 중...'}
        </div>
        <div style={{ fontSize: 12 }}>
          {serviceConfig.name}: {processedMarkers?.length || 0}개
        </div>
      </div>
    </div>
  );
};

// Helper function to create service-specific marker image
const createServiceMarkerImage = (kakaoMaps, displayConfig, size) => {
  try {
    // For now, we'll use the default marker with custom color
    // In a real implementation, you might want to create custom marker images
    return null; // Use default marker for now
  } catch (err) {
    console.error('마커 이미지 생성 실패:', err);
    return null;
  }
};

// Helper function to create service-specific info window
const createServiceInfoWindow = (kakaoMaps, markerData, serviceConfig) => {
  const popupContent = markerData.popupContent || { title: markerData.name, content: [] };
  
  const contentHTML = `
    <div style="
      padding: 15px; 
      min-width: 200px; 
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${serviceConfig.backgroundColor || '#fff'};
      border-left: 4px solid ${serviceConfig.accentColor};
    ">
      <div style="
        font-weight: bold; 
        font-size: 16px; 
        margin-bottom: 8px;
        color: ${serviceConfig.accentColor};
      ">
        ${popupContent.title}
      </div>
      ${popupContent.subtitle ? `
        <div style="
          font-size: 14px; 
          color: #666; 
          margin-bottom: 10px;
        ">
          ${popupContent.subtitle}
        </div>
      ` : ''}
      ${popupContent.content.map(item => `
        <div style="
          font-size: 13px; 
          margin-bottom: 4px;
          color: #333;
        ">
          ${item}
        </div>
      `).join('')}
    </div>
  `;

  return new kakaoMaps.InfoWindow({
    content: contentHTML,
    removable: true,
  });
};

export default BaseServiceMapView;