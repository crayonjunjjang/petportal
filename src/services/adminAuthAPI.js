// src/services/adminAuthAPI.js

// --- API 대응 준비 코드 ---
// 이 파일은 실제 백엔드 API와 연동하기 위한 관리자 인증 함수들을 정의합니다.
// 현재는 개발 및 프론트엔드 테스트를 위해 하드코딩된 값과 localStorage를 활용한 목업(Mock-up) 로직을 사용합니다.
// 실제 백엔드 연동 시에는 아래의 mock 함수들을 실제 API 호출(예: axios.post, axios.get)로 대체해야 합니다.

// 정상적인 JWT 목업 토큰 (헤더, 페이로드, 서명 형식)
// 페이로드: { "id": 1, "username": "admin", "role": "admin", "exp": <먼 미래의 타임스탬프> }
const MOCK_ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTg5MzQ1NjAwMH0.signature';

/**
 * @function adminLogin
 * @description 관리자 로그인을 시뮬레이션하는 목업 함수입니다.
 * 현재는 어떤 아이디/비밀번호를 입력해도 성공으로 처리하고 하드코딩된 토큰을 반환합니다.
 * 실제 백엔드 연동 시에는 서버에 관리자 자격 증명을 전송하고 유효한 JWT를 받아와야 합니다.
 * @param {string} username - 관리자 아이디.
 * @param {string} password - 관리자 비밀번호.
 * @returns {Promise<object>} 로그인 성공 시 모의 토큰과 관리자 정보를 포함하는 객체.
 */
const adminLogin = async (username, password) => {
  console.warn('Frontend-only mode: Admin login is mocked. Any username/password will result in a successful login.');
  // 실제 백엔드 연동 시에는 여기에 axios.post 등으로 서버에 로그인 요청을 보내야 합니다.
  // 예: const response = await axios.post('/api/admin/login', { username, password });
  //     return { token: response.data.token, user: response.data.user };

  // 목업 로직: 하드코딩된 토큰과 사용자 정보 반환
  // 실제 환경에서는 서버에서 받은 토큰을 localStorage에 저장해야 합니다.
  localStorage.setItem('adminToken', MOCK_ADMIN_TOKEN); // adminLogout과 일관성을 위해 추가
  return {
    token: MOCK_ADMIN_TOKEN,
    user: { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' }
  };
};

/**
 * @function adminLogout
 * @description 관리자 로그아웃을 처리하는 목업 함수입니다.
 * localStorage에서 관리자 토큰을 제거합니다.
 * 실제 백엔드 연동 시에는 서버에 로그아웃 요청을 보내 세션을 무효화할 수 있습니다.
 */
const adminLogout = () => {
  localStorage.removeItem('adminToken'); // localStorage에서 관리자 토큰 제거
  console.warn('Frontend-only mode: Admin logout is mocked.');
};

/**
 * @function getAdminToken
 * @description localStorage에서 관리자 토큰을 가져오는 목업 함수입니다.
 * 현재는 항상 하드코딩된 모의 토큰을 반환합니다.
 * 실제 백엔드 연동 시에는 localStorage.getItem('adminToken')을 직접 반환해야 합니다.
 * @returns {string | null} 관리자 토큰 또는 null.
 */
const getAdminToken = () => {
  // 실제 환경에서는 localStorage.getItem('adminToken')을 반환해야 합니다.
  // 현재는 목업이므로 하드코딩된 토큰을 반환합니다.
  return localStorage.getItem('adminToken');
};

/**
 * @function getAdminAuthHeader
 * @description 관리자 인증을 위한 HTTP 헤더를 반환하는 목업 함수입니다.
 * 현재는 빈 객체를 반환합니다. 실제 백엔드 연동 시에는 'Authorization': `Bearer ${token}` 형태의 헤더를 반환해야 합니다.
 * @returns {object} 인증 헤더 객체.
 */
const getAdminAuthHeader = () => {
  console.warn('Frontend-only mode: getAdminAuthHeader is mocked. Returning empty object.');
  // 실제 환경에서는 다음과 같이 토큰을 포함한 헤더를 반환해야 합니다.
  // const token = getAdminToken();
  // return token ? { 'Authorization': `Bearer ${token}` } : {};
  return {};
};

export { adminLogin, adminLogout, getAdminToken, getAdminAuthHeader };
