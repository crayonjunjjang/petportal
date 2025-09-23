// src/utils/loadKakaoMap.js
export function loadKakaoMap(appKey) {
  return new Promise((resolve, reject) => {
    // API 키 확인
    if (!appKey) {
      return reject(new Error('카카오맵 API 키가 설정되지 않았습니다.'));
    }

    // 이미 로드된 경우 체크
    if (window.kakao && window.kakao.maps) {
      console.log('카카오맵이 이미 로드되어 있습니다.');
      return resolve(window.kakao.maps);
    }
    
    console.log('카카오맵 스크립트 로딩 시작...');
    
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      console.log('카카오맵 스크립트 로드 완료');
      
      // window.kakao가 로드되었는지 확인
      if (window.kakao && window.kakao.maps) {
        resolve(window.kakao.maps);
      } else {
        reject(new Error('카카오맵 객체를 찾을 수 없습니다.'));
      }
    };
    
    script.onerror = (error) => {
      console.error('스크립트 로드 실패:', error);
      reject(new Error(`카카오맵 스크립트 로드 에러: ${script.src}`));
    };
    
    document.head.appendChild(script);
  });
}
