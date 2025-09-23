// src/utils/axiosConfig.js
import axios from 'axios';

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 자동 로그아웃
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.setItem('isLoggedIn', 'false');
      
      // 로그인 페이지로 리다이렉트 (필요한 경우)
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;