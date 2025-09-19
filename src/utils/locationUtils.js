// src/utils/locationUtils.js

/**
 * 두 지점 간의 거리를 계산하는 함수 (하버사인 공식 사용)
 * @param {number} lat1 - 첫 번째 지점의 위도
 * @param {number} lng1 - 첫 번째 지점의 경도
 * @param {number} lat2 - 두 번째 지점의 위도
 * @param {number} lng2 - 두 번째 지점의 경도
 * @returns {number} 두 지점 간의 거리 (km)
 */
export const getDistance = (lat1, lng1, lat2, lng2) => {
  // 입력값 검증
  if (typeof lat1 !== 'number' || typeof lng1 !== 'number' ||
      typeof lat2 !== 'number' || typeof lng2 !== 'number') {
    return Infinity;
  }

  const R = 6371; // 지구의 반지름 (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 거리 (km)

  return distance;
};

/**
 * 도를 라디안으로 변환하는 함수
 * @param {number} deg - 도 단위 각도
 * @returns {number} 라디안 단위 각도
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * 거리를 사람이 읽기 쉬운 형태로 포맷하는 함수
 * @param {number} distance - 거리 (km)
 * @returns {string} 포맷된 거리 문자열
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
};

/**
 * 현재 위치를 가져오는 함수
 * @returns {Promise<{lat: number, lng: number}>} 현재 위치 좌표
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        // 기본 위치 (서울 시청)
        resolve({
          lat: 37.5665,
          lng: 126.9780
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분
      }
    );
  });
};