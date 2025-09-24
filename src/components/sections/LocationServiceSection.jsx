// src/components/sections/LocationServiceSection.jsx

// --- 파일 역할: 메인 페이지에 표시되는 '내 주변 서비스 찾기' 섹션 ---
// 이 컴포넌트는 사용자의 현재 위치를 기반으로 주변의 다양한 서비스(미용, 카페, 병원, 호텔)를
// 지도 위에 표시해주는 기능을 제공합니다. 사용자는 카테고리 버튼을 클릭하여 원하는 서비스 유형만
// 필터링하여 지도에서 볼 수 있으며, 각 마커 클릭 시 해당 서비스의 상세 페이지로 이동합니다.

import React, { useState, useEffect } from 'react'; // React 및 상태 관리를 위한 useState, 부수 효과를 위한 useEffect 훅 임포트
import { useNavigate } from 'react-router-dom'; // React Router를 사용하여 페이지 이동을 위한 useNavigate 훅 임포트
import MapView from '../common/MapView'; // 카카오맵을 렌더링하는 공통 지도 뷰 컴포넌트 임포트
import styles from './LocationServiceSection.module.css'; // 섹션 전용 스타일을 위한 CSS 모듈 임포트

// 각 서비스 유형별 목(mock) 데이터 임포트
import groomingData from '../../data/grooming.json'; // 미용실 데이터
import cafeData from '../../data/cafe.json'; // 카페 데이터
import hospitalData from '../../data/hospital.json'; // 병원 데이터
import hotelData from '../../data/hotel.json'; // 호텔 데이터

// 지도 위에 표시할 카테고리 목록 정의
// 각 객체는 카테고리 이름, 유형(type), 아이콘(icon) 정보를 포함합니다.
const categories = [
  { name: '전체', type: 'all', icon: '🗺️' },
  { name: '미용', type: 'grooming', icon: '✂️' },
  { name: '카페', type: 'cafe', icon: '☕' },
  { name: '병원', type: 'hospital', icon: '🏥' },
  { name: '호텔', type: 'hotel', icon: '🏨' },
];

// --- LocationServiceSection Component ---
// 메인 페이지의 '내 주변 서비스 찾기' 섹션을 렌더링하는 함수형 컴포넌트
const LocationServiceSection = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const navigate = useNavigate(); // 페이지 이동을 위한 React Router 훅
  const [userLocation, setUserLocation] = useState(null); // 사용자의 현재 위도, 경도 정보를 저장하는 상태
  const [allMarkers, setAllMarkers] = useState([]); // 모든 서비스(미용, 카페, 병원, 호텔)의 마커 데이터를 통합하여 저장하는 상태
  const [filteredMarkers, setFilteredMarkers] = useState([]); // 현재 선택된 카테고리에 따라 필터링된 마커 데이터를 저장하는 상태
  // selectedCategory: 현재 선택된 카테고리 유형을 저장하는 상태.
  // localStorage에서 이전에 선택한 값을 가져와 초기값으로 설정하고, 없으면 'all'을 기본값으로 합니다.
  const [selectedCategory, setSelectedCategory] = useState(() => localStorage.getItem('selectedMapCategory') || 'all');

  // --- EVENT HANDLERS (이벤트 처리 함수) ---

  // 지도 마커 클릭 시 해당 서비스의 상세 페이지로 이동하는 함수
  // marker 객체는 type과 id를 포함해야 합니다.
  const handleMarkerClick = (marker) => {
    if (marker && marker.type && marker.id) {
      // 예: /grooming/1, /cafe/5 등으로 이동
      navigate(`/${marker.type}/${marker.id}`);
    }
  };

  // 카테고리 버튼 클릭 시 마커를 필터링하는 함수
  // categoryType: 선택된 카테고리의 'type' 값 (예: 'all', 'grooming')
  const handleCategoryFilter = (categoryType) => {
    setSelectedCategory(categoryType); // 선택된 카테고리 상태 업데이트
    localStorage.setItem('selectedMapCategory', categoryType); // 사용자의 선택을 localStorage에 저장하여 새로고침 시 유지

    if (categoryType === 'all') {
      // '전체' 카테고리 선택 시 모든 마커를 표시
      setFilteredMarkers(allMarkers);
    } else {
      // 특정 카테고리 선택 시 해당 type의 마커만 필터링하여 표시
      const filtered = allMarkers.filter(marker => marker.type === categoryType);
      setFilteredMarkers(filtered);
    }
  };

  // --- EFFECTS (데이터 로딩 및 초기화) ---

  // 1. 컴포넌트 마운트 시 모든 서비스 데이터를 통합하여 마커 데이터를 생성하고 초기 필터링을 적용합니다.
  useEffect(() => {
    // 각 서비스 데이터 아이템에 타입 정보와 마커 클릭 핸들러를 추가하는 헬퍼 함수
    const addInfoAndClickHandler = (item, type) => ({ 
      ...item, // 기존 아이템 데이터
      type, // 서비스 유형 (예: 'grooming', 'cafe')
      info: item.name, // 마우스 호버 시 지도 정보창에 표시될 내용 (주로 서비스 이름)
      onClick: () => handleMarkerClick({ ...item, type }) // 마커 클릭 시 상세 페이지로 이동하는 함수 연결
    });

    // 각 서비스 데이터(JSON)를 순회하며 마커 데이터 형식으로 변환
    const groomingMarkers = groomingData.map(item => addInfoAndClickHandler(item, 'grooming'));
    const cafeMarkers = cafeData.map(item => addInfoAndClickHandler(item, 'cafe'));
    const hospitalMarkers = hospitalData.map(item => addInfoAndClickHandler(item, 'hospital'));
    const hotelMarkers = hotelData.map(item => addInfoAndClickHandler(item, 'hotel'));

    // 모든 서비스의 마커 데이터를 하나의 배열로 통합하여 `allMarkers` 상태에 저장
    const combinedMarkers = [...groomingMarkers, ...cafeMarkers, ...hospitalMarkers, ...hotelMarkers];
    setAllMarkers(combinedMarkers);

    // localStorage에 저장된 카테고리 값으로 초기 필터링을 적용합니다.
    const initialCategory = localStorage.getItem('selectedMapCategory') || 'all';
    if (initialCategory === 'all') {
      setFilteredMarkers(combinedMarkers); // '전체'이면 모든 마커 표시
    } else {
      // 특정 카테고리이면 해당 카테고리의 마커만 필터링하여 표시
      const filtered = combinedMarkers.filter(marker => marker.type === initialCategory);
      setFilteredMarkers(filtered);
    }
  }, [navigate]); // `navigate` 함수는 변경되지 않으므로, 이 효과는 컴포넌트 마운트 시 한 번만 실행됩니다.

  // 2. 컴포넌트 마운트 시 사용자의 현재 위치를 가져옵니다.
  useEffect(() => {
    // Geolocation API 지원 여부 확인
    if (navigator.geolocation) {
      // 현재 위치 가져오기 성공 시
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude, // 위도
            lng: position.coords.longitude // 경도
          });
        },
        // 현재 위치 가져오기 실패 시
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          // 실패 시 기본 위치(서울 시청)로 설정하여 지도 표시
          setUserLocation({ lat: 37.5665, lng: 126.9780 });
        }
      );
    } else {
      // Geolocation API를 지원하지 않는 브라우저인 경우
      console.warn('Geolocation API를 지원하지 않는 브라우저입니다. 기본 위치를 사용합니다.');
      setUserLocation({ lat: 37.5665, lng: 126.9780 }); // 기본 위치(서울 시청)로 설정
    }
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행됩니다.

  // --- RENDER (렌더링) ---
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 왼쪽 콘텐츠 영역: 섹션 제목, 설명, 카테고리 필터 버튼 */}
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>내 주변 서비스 찾기</h2>
          <p className={styles.subtitle}>가까운 병원, 호텔, 미용실, 카페를 찾아보세요.</p>
          <div className={styles.buttonContainer}>
            {/* `categories` 배열을 순회하며 각 카테고리 버튼을 렌더링 */}
            {categories.map((category) => (
              <button 
                key={category.type} // 각 버튼의 고유 key
                // 현재 선택된 카테고리에 따라 'active' 클래스를 추가하여 스타일을 변경
                className={`${styles.serviceButton} ${selectedCategory === category.type ? styles.active : ''}`}
                onClick={() => handleCategoryFilter(category.type)} // 버튼 클릭 시 필터링 함수 호출
              >
                <span className={styles.serviceIcon}>{category.icon}</span> {/* 카테고리 아이콘 */}
                {category.name} {/* 카테고리 이름 */}
              </button>
            ))}
          </div>
        </div>
        {/* 오른쪽 지도 영역 */}
        <div className={styles.mapContainer}>
          {/* MapView 컴포넌트에 사용자 위치와 필터링된 마커 데이터를 전달하여 지도 렌더링 */}
          <MapView 
            userLocation={userLocation} // 지도의 중심이 될 사용자 위치
            markers={filteredMarkers} // 지도에 표시될 마커들
          />
        </div>
      </div>
    </section>
  );
};

export default LocationServiceSection; // LocationServiceSection 컴포넌트를 내보냅니다.