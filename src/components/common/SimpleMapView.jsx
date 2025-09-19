// src/components/common/SimpleMapView.jsx
import React, { useEffect, useRef } from 'react';

const SimpleMapView = ({ userLocation, markers = [], serviceType = 'grooming', serviceConfig = {} }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.log('카카오맵 API가 로드되지 않았습니다.');
      return;
    }

    if (!userLocation || !mapRef.current) return;

    // 카카오맵 초기화
    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 5
    };

    mapInstance.current = new window.kakao.maps.Map(container, options);

    // 사용자 위치 마커 추가
    const userMarkerPosition = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
    const userMarker = new window.kakao.maps.Marker({
      position: userMarkerPosition,
      map: mapInstance.current
    });

    // 사용자 위치 인포윈도우
    const userInfoWindow = new window.kakao.maps.InfoWindow({
      content: '<div style="padding:5px;">현재 위치</div>'
    });
    userInfoWindow.open(mapInstance.current, userMarker);

    // 마커들 추가
    markers.forEach((marker, index) => {
      if (marker.lat && marker.lng) {
        const markerPosition = new window.kakao.maps.LatLng(marker.lat, marker.lng);
        const kakaoMarker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: mapInstance.current
        });

        // 마커 클릭 이벤트
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px; min-width:150px;">
            <strong>${marker.title || marker.name || '장소'}</strong><br/>
            ${marker.info || ''}
          </div>`
        });

        window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
          infoWindow.open(mapInstance.current, kakaoMarker);
        });
      }
    });

  }, [userLocation, markers]);

  // 카카오맵 API가 로드되지 않은 경우 대체 화면
  if (!window.kakao || !window.kakao.maps) {
    const accentColor = serviceConfig.accentColor || '#667eea';
    const serviceName = serviceConfig.name || '서비스';
    const serviceIcon = serviceConfig.markerIcon || '🗺️';

    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${accentColor}20 0%, ${accentColor}40 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: accentColor,
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>{serviceIcon}</div>
        <h3 style={{ margin: '0 0 10px 0' }}>카카오맵 로딩 중...</h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
          지도를 불러오는 중입니다.<br />
          잠시만 기다려주세요.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    />
  );
};

export default SimpleMapView;