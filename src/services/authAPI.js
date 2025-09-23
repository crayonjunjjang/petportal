// src/services/authAPI.js
// API 대응 준비 코드 - 실제 API와 연동 시 사용할 함수들

// 인증 관련 API 함수들
export const authAPI = {
  // 일반 로그인
  login: async (credentials) => {
    return mockLogin(credentials);
  },

  // 회원가입
  register: async (userData) => {
    return mockRegister(userData);
  },

  // 로그아웃
  logout: async () => {
    return mockLogout();
  },

  // 토큰 갱신
  refreshToken: async () => {
    return mockRefreshToken();
  },

  // 사용자 정보 조회
  getUserInfo: async () => {
    return mockGetUserInfo();
  }
};

// 소셜 로그인 API 함수들
export const socialAuthAPI = {
  // 구글 로그인
  googleLogin: async () => {
    return mockSocialLogin('google');
  },

  // 네이버 로그인
  naverLogin: async () => {
    return mockSocialLogin('naver');
  },

  // 카카오 로그인
  kakaoLogin: async () => {
    return mockSocialLogin('kakao');
  }
};

// Mock 함수들 (개발 환경에서 사용)
const mockLogin = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 등록된 사용자 확인
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
  
  const user = registeredUsers.find(u => u.email === credentials.email);
  const storedPassword = userPasswords[credentials.email];
  
  if (!user || !storedPassword) {
    throw new Error('등록되지 않은 이메일입니다.');
  }
  
  if (atob(storedPassword) !== credentials.password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }
  
  // 성공 응답
  const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
  localStorage.setItem('authToken', token);
  
  return {
    success: true,
    user,
    token
  };
};

const mockRegister = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  
  if (existingUsers.some(user => user.email === userData.email)) {
    throw new Error('이미 가입된 이메일입니다.');
  }
  
  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    agreeToAds: userData.agreeToAds, // Added agreeToAds
    joinDate: new Date().toISOString(),
    loginType: 'email'
  };
  
  existingUsers.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
  
  const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
  userPasswords[userData.email] = btoa(userData.password);
  localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
  
  console.log('New user registered with ad agreement:', newUser.agreeToAds); // Log for verification
  
  return {
    success: true,
    user: newUser
  };
};

const mockLogout = async () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userInfo');
  return { success: true };
};

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

const mockSocialLogin = async (provider) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
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