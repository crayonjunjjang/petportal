// src/components/common/MapView.jsx

// --- 파일 역할: 카카오맵 API를 사용하여 지도를 표시하는 공통 컴포넌트 ---
// 이 컴포넌트는 웹 애플리케이션에서 카카오맵을 통합하고 관리하는 핵심 역할을 수행합니다.
// 주요 기능은 다음과 같습니다:
// 1. 카카오맵 JavaScript API 스크립트를 비동기적으로 로드합니다.
// 2. 사용자 위치(userLocation)와 지도에 표시할 마커(markers) 데이터를 기반으로 지도를 렌더링합니다.
// 3. 스크립트 로딩 실패, API 키 누락 등 오류 발생 시 대체 UI(`SimpleMapView`)를 제공합니다.
// 4. 지도 인스턴스, 마커 인스턴스 등을 효율적으로 관리하여 성능을 최적화합니다.
// 5. 지도 컨트롤(줌 컨트롤), 마커 클릭 이벤트, 정보창(인포윈도우) 등을 지원합니다.

import React, { useEffect, useRef, useState } from 'react'; // React 핵심 훅 임포트
import { loadKakaoMap } from '../../utils/loadKakaoMap'; // 카카오맵 스크립트를 동적으로 로드하는 유틸리티 함수
import SimpleMapView from './SimpleMapView'; // 카카오맵 로드 실패 시 대체로 표시될 간단한 지도 컴포넌트

// --- MapView Component ---
// props:
//   - userLocation: { lat: number, lng: number } 형태의 객체. 지도의 중심을 설정할 사용자(또는 현재 위치)의 위도와 경도.
//   - markers: Array<{ lat: number, lng: number, title?: string, info?: string, onClick?: Function }> 형태의 객체 배열. 
//              지도에 표시될 마커들의 정보. 각 마커는 위도, 경도, 제목, 정보창 내용, 클릭 이벤트 핸들러 등을 포함할 수 있습니다.
const MapView = ({ userLocation, markers }) => {
  // --- REFS & STATE (참조 및 상태 관리) ---
  // mapRef: 카카오맵이 렌더링될 DOM 엘리먼트(div)에 대한 참조. `useRef`를 사용하여 DOM에 직접 접근합니다.
  const mapRef = useRef(null);
  // mapInstance: 카카오맵 API에 의해 생성된 지도 인스턴스 객체에 대한 참조. `useRef`를 사용하여 리렌더링 시에도 인스턴스를 유지합니다.
  const mapInstance = useRef(null);
  // markerInstances: 현재 지도에 표시된 모든 마커 인스턴스들을 저장하는 배열에 대한 참조. 마커 관리(추가/제거)에 사용됩니다.
  const markerInstances = useRef([]);
  // kakaoMaps: 카카오맵 JavaScript API가 로드된 후 전역 `window.kakao.maps` 객체를 저장하는 상태.
  //            이 객체를 통해 지도 및 마커 관련 API 함수들을 호출할 수 있습니다.
  const [kakaoMaps, setKakaoMaps] = useState(null);
  // error: 카카오맵 로딩 또는 초기화 중 발생한 오류 메시지를 저장하는 상태. 오류 발생 시 대체 UI를 표시하는 데 사용됩니다.
  const [error, setError] = useState(null);
  // isLoading: 카카오맵 스크립트 로딩 및 초기화가 진행 중인지 여부를 나타내는 상태. 로딩 스피너 등을 표시하는 데 사용됩니다.
  const [isLoading, setIsLoading] = useState(true);

  // --- EFFECTS (생명주기 관리 및 비동기 작업 처리) ---

  // 1. 카카오맵 JavaScript API 스크립트 로드 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    // Vite 환경 변수에서 카카오맵 JavaScript API 키를 가져옵니다.
    const apiKey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!apiKey) {
      // API 키가 설정되지 않았을 경우 오류 상태를 설정하고 로딩을 종료합니다.
      setError('카카오맵 API 키가 설정되지 않았습니다. .env 파일에 VITE_KAKAO_JS_KEY를 설정해주세요.');
      setIsLoading(false);
      return;
    }

    // `loadKakaoMap` 유틸리티 함수를 호출하여 스크립트를 비동기적으로 로드합니다.
    loadKakaoMap(apiKey)
      .then(maps => {
        // `autoload=false` 옵션으로 스크립트를 로드했으므로, `window.kakao.maps.load` 함수를 호출하여
        // API 라이브러리(지도, 마커 등)를 수동으로 초기화합니다.
        window.kakao.maps.load(() => {
          setKakaoMaps(window.kakao.maps); // 로드된 카카오맵 API 객체를 상태에 저장
          setIsLoading(false); // 로딩 완료
        });
      })
      .catch(err => {
        // 스크립트 로드 실패 시 콘솔에 에러를 기록하고 오류 상태를 설정합니다.
        console.error('카카오맵 스크립트 로드 실패:', err);
        setError(`카카오맵 스크립트 로드 중 오류 발생: ${err.message}`);
        setIsLoading(false); // 로딩 완료 (오류로 인한 종료)
      });
  }, []); // 빈 의존성 배열: 컴포넌트가 처음 마운트될 때만 이 효과를 실행합니다.

  // 2. 지도 인스턴스 생성 및 초기 설정 (카카오맵 객체 로드 및 로딩 상태 변경 시 실행)
  useEffect(() => {
    // 카카오맵 API 객체가 로드되지 않았거나, 지도를 담을 DOM 엘리먼트가 없거나, 아직 로딩 중이면 실행하지 않습니다.
    if (!kakaoMaps || !mapRef.current || isLoading) return;

    try {
      // 지도의 초기 중심 좌표를 설정합니다.
      // `userLocation` prop이 제공되면 해당 위치를 사용하고, 없으면 서울 시청의 기본 좌표를 사용합니다.
      const center = userLocation
        ? new kakaoMaps.LatLng(userLocation.lat, userLocation.lng)
        : new kakaoMaps.LatLng(37.5665, 126.9780); // 서울 시청 좌표

      // 새로운 지도 인스턴스를 생성하고 `mapRef.current` DOM 엘리먼트에 연결합니다.
      // 생성된 인스턴스는 `mapInstance.current`에 저장됩니다.
      mapInstance.current = new kakaoMaps.Map(mapRef.current, {
        center, // 지도 중심 좌표
        level: 5, // 지도의 확대 레벨 (숫자가 작을수록 확대)
      });

      // 지도에 줌 컨트롤(확대/축소 버튼)을 추가합니다.
      const zoomControl = new kakaoMaps.ZoomControl();
      mapInstance.current.addControl(zoomControl, kakaoMaps.ControlPosition.RIGHT); // 지도 우측에 배치
    } catch (err) {
      // 지도 생성 중 오류 발생 시 콘솔에 에러를 기록하고 오류 상태를 설정합니다.
      console.error('지도 생성 실패:', err);
      setError(`지도 생성에 실패했습니다: ${err.message}`);
    }
  }, [kakaoMaps, isLoading, userLocation]); // `kakaoMaps` 객체, `isLoading` 상태, `userLocation` prop이 변경될 때마다 다시 실행됩니다.

  // 3. 사용자 위치 변경 시 지도 중심 이동 (userLocation prop 변경 시 실행)
  useEffect(() => {
    // 지도 인스턴스가 없거나, 사용자 위치가 없거나, 카카오맵 객체가 없거나, 아직 로딩 중이면 실행하지 않습니다.
    if (!mapInstance.current || !userLocation || !kakaoMaps || isLoading) return;
    try {
      // 새로운 사용자 위치로 `LatLng` 객체를 생성합니다.
      const center = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      // 지도의 중심을 새로운 위치로 부드럽게 이동시킵니다.
      mapInstance.current.panTo(center);
    } catch (err) {
      // 위치 이동 중 오류 발생 시 콘솔에 에러를 기록합니다.
      console.error('지도 중심 이동 실패:', err);
    }
  }, [userLocation, kakaoMaps, isLoading]); // `userLocation` prop, `kakaoMaps` 객체, `isLoading` 상태가 변경될 때마다 실행됩니다.

  // 4. 마커 렌더링 및 관리 (markers prop 또는 kakaoMaps 객체 변경 시 실행)
  useEffect(() => {
    // 지도 인스턴스가 없거나, 마커 데이터가 없거나, 카카오맵 객체가 없거나, 아직 로딩 중이면 실행하지 않습니다.
    if (!mapInstance.current || !markers || !kakaoMaps || isLoading) return;

    // 기존에 지도에 추가되었던 모든 마커들을 지도에서 제거합니다.
    markerInstances.current.forEach(marker => marker.setMap(null));
    // 마커 인스턴스 배열을 초기화합니다.
    markerInstances.current = [];

    // `markers` prop으로 전달받은 데이터 배열을 순회하며 새로운 마커들을 지도에 추가합니다.
    markers.forEach((data, idx) => {
      try {
        // 마커 데이터에 유효한 위도(lat)와 경도(lng)가 있는지 확인합니다.
        if (typeof data.lat !== 'number' || typeof data.lng !== 'number') {
          console.warn(`마커 ${idx}의 좌표가 유효하지 않습니다. 마커를 건너뜁니다:`, data);
          return; // 유효하지 않은 좌표는 건너뜁니다.
        }
        // 마커의 위치를 나타내는 `LatLng` 객체를 생성합니다.
        const position = new kakaoMaps.LatLng(data.lat, data.lng);
        // 새로운 마커 인스턴스를 생성합니다. `title`은 마우스 오버 시 툴팁으로 표시될 수 있습니다.
        const marker = new kakaoMaps.Marker({ position, title: data.title });
        // 생성된 마커를 현재 지도에 추가합니다.
        marker.setMap(mapInstance.current);

        // 마커 클릭 이벤트 리스너를 추가합니다. `data.onClick` 함수가 제공된 경우에만 연결합니다.
        if (data.onClick) {
          kakaoMaps.event.addListener(marker, 'click', () => data.onClick(data));
        }

        // 마우스 오버/아웃 시 정보창(인포윈도우)을 표시/숨김 처리합니다. `data.info`가 제공된 경우에만 작동합니다.
        if (data.info) {
          const infoWindow = new kakaoMaps.InfoWindow({
            content: `<div style="padding:10px;font-size:12px;">${data.info}</div>`, // 정보창에 표시될 HTML 콘텐츠
            removable: true, // 정보창을 닫을 수 있는 X 버튼 표시 여부
          });
          // 마우스 오버 시 정보창 열기
          kakaoMaps.event.addListener(marker, 'mouseover', () => infoWindow.open(mapInstance.current, marker));
          // 마우스 아웃 시 정보창 닫기
          kakaoMaps.event.addListener(marker, 'mouseout', () => infoWindow.close());
        }

        // 성공적으로 생성된 마커 인스턴스를 `markerInstances.current` 배열에 추가합니다.
        markerInstances.current.push(marker);
      } catch (err) {
        // 마커 생성 중 오류 발생 시 콘솔에 에러를 기록합니다.
        console.error(`마커 ${idx} 생성 실패:`, err);
      }
    });
  }, [markers, kakaoMaps, isLoading]); // `markers` prop, `kakaoMaps` 객체, `isLoading` 상태가 변경될 때마다 실행됩니다.

  // --- RENDER (렌더링) ---

  // 카카오맵 스크립트 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🗺️</div>
          <div>카카오맵 로딩 중...</div>
        </div>
      </section>
    );
  }

  // 카카오맵 로드 또는 초기화 중 에러 발생 시 대체 지도 UI를 표시합니다.
  if (error) {
    console.warn('카카오맵 로드 실패, 대체 지도 사용:', error);
    // `SimpleMapView` 컴포넌트에 `userLocation`과 `markers`를 전달하여 기본적인 지도 기능을 제공합니다.
    return <SimpleMapView userLocation={userLocation} markers={markers} />;
  }

  // 카카오맵이 정상적으로 로드되고 초기화되었을 때의 UI
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 실제 카카오맵이 그려질 DOM 엘리먼트. `mapRef`를 통해 참조됩니다. */}
      <div ref={mapRef} style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
      
      {/* 디버깅 및 현재 지도 상태를 표시하는 오버레이 (개발 편의용) */}
      <div style={{
        padding: 12, fontSize: 14, position: 'absolute',
        bottom: 10, right: 10, background: 'rgba(255,255,255,0.95)',
        borderRadius: 8, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontWeight: 'bold' }}>🗺️ 카카오맵</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>상태: {kakaoMaps ? '✅ 준비 완료' : '⏳ 초기화 중...'}</div>
        <div style={{ fontSize: 12 }}>위치: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : '확인 중...'}</div>
        <div style={{ fontSize: 12 }}>마커: {markers?.length || 0}개</div>
      </div>
    </div>
  );
};

export default MapView; // MapView 컴포넌트를 내보냅니다.