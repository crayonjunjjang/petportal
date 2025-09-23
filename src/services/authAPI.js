// src/services/authAPI.js

// --- API 대응 준비 코드 ---
// 이 파일은 실제 백엔드 API와 연동하기 위한 함수들을 정의합니다.
// 현재는 개발 및 프론트엔드 테스트를 위해 localStorage를 활용한 목업(Mock-up) 데이터 및 로직을 사용합니다.
// 실제 백엔드 연동 시에는 아래의 mock 함수들을 실제 API 호출(예: axios.post, axios.get)로 대체해야 합니다.

// --- 인증 관련 API 함수들 ---
export const authAPI = {
  /**
   * @function login
   * @description 사용자 로그인을 처리하는 목업 함수입니다.
   * @param {object} credentials - 사용자 로그인 자격 증명 (email, password).
   * @returns {Promise<object>} 로그인 성공 여부, 사용자 정보, 토큰을 포함하는 객체.
   */
  login: async (credentials) => {
    return mockLogin(credentials);
  },

  /**
   * @function register
   * @description 사용자 회원가입을 처리하는 목업 함수입니다.
   * @param {object} userData - 회원가입에 필요한 사용자 데이터 (nickname, email, password 등).
   * @returns {Promise<object>} 회원가입 성공 여부와 새로 생성된 사용자 정보를 포함하는 객체.
   */
  register: async (userData) => {
    return mockRegister(userData);
  },

  /**
   * @function logout
   * @description 사용자 로그아웃을 처리하는 목업 함수입니다.
   * @returns {Promise<object>} 로그아웃 성공 여부를 포함하는 객체.
   */
  logout: async () => {
    return mockLogout();
  },

  /**
   * @function refreshToken
   * @description 인증 토큰 갱신을 처리하는 목업 함수입니다.
   * @returns {Promise<object>} 토큰 갱신 성공 여부와 새로운 토큰을 포함하는 객체.
   */
  refreshToken: async () => {
    return mockRefreshToken();
  },

  /**
   * @function getUserInfo
   * @description 현재 로그인된 사용자 정보를 조회하는 목업 함수입니다.
   * @returns {Promise<object>} 사용자 정보 조회 성공 여부와 사용자 데이터를 포함하는 객체.
   */
  getUserInfo: async () => {
    return mockGetUserInfo();
  }
};

// --- 소셜 로그인 API 함수들 (목업) ---
export const socialAuthAPI = {
  /**
   * @function googleLogin
   * @description 구글 로그인을 시뮬레이션하는 목업 함수입니다.
   * @returns {Promise<object>} 로그인 성공 여부, 사용자 정보, 토큰을 포함하는 객체.
   */
  googleLogin: async () => {
    return mockSocialLogin('google');
  },

  /**
   * @function naverLogin
   * @description 네이버 로그인을 시뮬레이션하는 목업 함수입니다.
   * @returns {Promise<object>} 로그인 성공 여부, 사용자 정보, 토큰을 포함하는 객체.
   */
  naverLogin: async () => {
    return mockSocialLogin('naver');
  },

  /**
   * @function kakaoLogin
   * @description 카카오 로그인을 시뮬레이션하는 목업 함수입니다.
   * @returns {Promise<object>} 로그인 성공 여부, 사용자 정보, 토큰을 포함하는 객체.
   */
  kakaoLogin: async () => {
    return mockSocialLogin('kakao');
  }
};

// --- Mock 함수들 (개발 환경에서 사용) ---

/**
 * @function mockLogin
 * @description 로그인 로직을 시뮬레이션하는 목업 함수입니다.
 * localStorage에 저장된 사용자 정보와 비밀번호를 기반으로 인증을 수행합니다.
 * 실제 백엔드 연동 시에는 서버 API 호출로 대체되어야 합니다.
 * @param {object} credentials - 로그인 자격 증명.
 * @throws {Error} 등록되지 않은 이메일이거나 비밀번호가 일치하지 않을 경우.
 */
const mockLogin = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연 시뮬레이션
  
  // localStorage에서 등록된 사용자 목록과 비밀번호를 가져옵니다.
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
  
  // 이메일로 사용자 찾기
  const user = registeredUsers.find(u => u.email === credentials.email);
  const storedPassword = userPasswords[credentials.email];
  
  // 사용자 존재 여부 및 비밀번호 일치 여부 확인
  if (!user || !storedPassword) {
    throw new Error('등록되지 않은 이메일입니다.');
  }
  
  // 경고: 실제 애플리케이션에서는 비밀번호를 Base64 인코딩하여 저장하는 것은 안전하지 않습니다.
  // 서버 측에서 강력한 해싱 및 솔팅을 사용해야 합니다.
  if (atob(storedPassword) !== credentials.password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }
  
  // 로그인 성공 시, 모의 토큰 생성 및 localStorage에 저장
  // 경고: 실제 JWT는 서버에서 서명되어야 하며, 클라이언트에서 단순히 Base64 인코딩하는 것은 보안상 취약합니다.
  const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
  localStorage.setItem('authToken', token);
  
  return {
    success: true,
    user,
    token
  };
};

/**
 * @function mockRegister
 * @description 회원가입 로직을 시뮬레이션하는 목업 함수입니다.
 * localStorage에 새 사용자를 추가하고 비밀번호를 저장합니다.
 * 실제 백엔드 연동 시에는 서버 API 호출로 대체되어야 합니다.
 * @param {object} userData - 회원가입 데이터.
 * @throws {Error} 이미 가입된 이메일일 경우.
 */
const mockRegister = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5초 지연 시뮬레이션
  
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  
  // 이메일 중복 확인
  if (existingUsers.some(user => user.email === userData.email)) {
    throw new Error('이미 가입된 이메일입니다.');
  }
  
  // 새 사용자 객체 생성
  const newUser = {
    id: Date.now(), // 고유 ID 생성
    name: userData.nickname, // 닉네임을 이름으로 사용
    email: userData.email,
    // phone: userData.phone, // 현재 userData에 phone이 없으므로 주석 처리
    // agreeToAds: userData.agreeToAds, // 현재 userData에 agreeToAds가 없으므로 주석 처리
    joinDate: new Date().toISOString(),
    loginType: 'email'
  };
  
  existingUsers.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
  
  // 비밀번호 저장 (경고: 실제 애플리케이션에서는 안전하지 않습니다.)
  const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
  userPasswords[userData.email] = btoa(userData.password); // Base64 인코딩하여 저장
  localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
  
  // console.log('New user registered with ad agreement:', newUser.agreeToAds); // 디버깅용
  
  return {
    success: true,
    user: newUser
  };
};

/**
 * @function mockLogout
 * @description 로그아웃 로직을 시뮬레이션하는 목업 함수입니다.
 * localStorage에서 인증 관련 데이터를 제거합니다.
 */
const mockLogout = async () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userInfo');
  return { success: true };
};

/**
 * @function mockRefreshToken
 * @description 토큰 갱신 로직을 시뮬레이션하는 목업 함수입니다.
 * @throws {Error} 인증 토큰이 없을 경우.
 */
const mockRefreshToken = async () => {
  const currentToken = localStorage.getItem('authToken');
  if (!currentToken) {
    throw new Error('인증 토큰이 없습니다.');
  }
  
  // 새 토큰 생성 (임시)
  const newToken = currentToken + '_refreshed';
  localStorage.setItem('authToken', newToken);
  
  return {
    success: true,
    token: newToken
  };
};

/**
 * @function mockGetUserInfo
 * @description 사용자 정보 조회 로직을 시뮬레이션하는 목업 함수입니다.
 * @throws {Error} 로그인이 필요할 경우.
 */
const mockGetUserInfo = async () => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) {
    throw new Error('로그인이 필요합니다.');
  }
  
  return {
    success: true,
    user: JSON.parse(userInfo)
  };
};

/**
 * @function mockSocialLogin
 * @description 소셜 로그인 로직을 시뮬레이션하는 목업 함수입니다.
 * @param {string} provider - 소셜 로그인 제공자 (예: 'google', 'naver', 'kakao').
 */
const mockSocialLogin = async (provider) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5초 지연 시뮬레이션
  
  const userData = {
    id: Date.now(),
    email: `user@${provider}.com`,
    name: `${provider} 사용자`,
    loginType: provider,
    joinDate: new Date().toISOString()
  };
  
  const token = btoa(JSON.stringify({ userId: userData.id, email: userData.email }));
  
  localStorage.setItem('authToken', token);
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userInfo', JSON.stringify(userData));
  
  return {
    success: true,
    user: userData,
    token
  };
};

export default authAPI;
