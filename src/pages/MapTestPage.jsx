// src/pages/MapTestPage.jsx
import React, { useState, useEffect } from 'react';
import MapView from '../components/common/MapView';

const MapTestPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Simulate user location (fixed for static site)
  useEffect(() => {
    console.log('사용자 위치 가져오기 시뮬레이션');
    const defaultLocation = { lat: 37.5665, lng: 126.9780 }; // 서울 시청
    setUserLocation(defaultLocation);
    console.log('기본 위치 설정 (시뮬레이션):', defaultLocation);
  }, []);

  // 테스트용 마커 데이터
  useEffect(() => {
    const testMarkers = [
      {
        lat: 37.5665,
        lng: 126.9780,
        title: '서울시청',
        info: '<strong>서울특별시청</strong><br>서울특별시 중구 태평로1가',
        onClick: (marker) => {
          console.log('서울시청 마커 클릭:', marker);
          alert(`${marker.title} 클릭됨!`);
        },
      },
      {
        lat: 37.5651,
        lng: 126.9895,
        title: '명동성당',
        info: '<strong>명동성당</strong><br>서울 중구 명동길',
        icon: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
      },
      {
        lat: 37.5658,
        lng: 126.9723,
        title: '덕수궁',
        info: '<strong>덕수궁</strong><br>조선시대 궁궐',
        icon: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
      },
    ];
    
    console.log('테스트 마커 설정:', testMarkers);
    setMarkers(testMarkers);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>카카오맵 테스트 페이지</h1>
      <div style={{ 
        width: '100%', 
        height: '500px', 
        border: '2px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        marginTop: '20px'
      }}>
        <MapView userLocation={userLocation} markers={markers} />
      </div>
      
      {/* 디버그 정보 */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>디버그 정보</h3>
        <p><strong>사용자 위치:</strong> {userLocation ? `${userLocation.lat}, ${userLocation.lng}` : '로딩 중...'}</p>
        <p><strong>마커 개수:</strong> {markers.length}개</p>
        <p><strong>API 키:</strong> {import.meta.env.VITE_KAKAO_JS_KEY ? '설정됨' : '❌ 설정되지 않음'}</p>
      </div>
    </div>
  );
};

export default MapTestPage;
