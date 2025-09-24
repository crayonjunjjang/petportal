// src/pages/SignupPage.jsx

// --- 파일 역할: 사용자 회원가입을 처리하는 페이지 ---
// 이 컴포넌트는 사용자로부터 닉네임, 이메일, 비밀번호 등 회원가입에 필요한 정보를 입력받고,
// 유효성 검사를 거친 후 `AuthContext`의 `signup` 함수를 호출하여 실제 회원가입 로직을 수행합니다.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 인증 관련 컨텍스트
import styles from './SignupPage.module.css';

// --- SignupPage Component ---
const SignupPage = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const [formData, setFormData] = useState({ // 폼 입력 데이터
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({}); // 유효성 검사 에러 메시지
  const [isLoading, setIsLoading] = useState(false); // 로딩(제출 중) 상태
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth(); // AuthContext에서 회원가입 함수와 인증 상태를 가져옴

  // --- EFFECTS (생명주기 관리) ---
  // 이미 로그인된 사용자가 회원가입 페이지에 접근하면 홈으로 리디렉션합니다.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // --- EVENT HANDLERS (이벤트 처리 함수) ---

  // 폼 입력값이 변경될 때마다 formData 상태를 업데이트합니다.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: inputValue });
    
    // 해당 필드의 에러 메시지를 초기화합니다.
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 폼 제출 전 유효성을 검사하는 함수
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';
    else if (formData.nickname.trim().length < 2) newErrors.nickname = '닉네임은 2글자 이상이어야 합니다.';
    
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다.';
    
    if (!formData.password.trim()) newErrors.password = '비밀번호를 입력해주세요.';
    else if (formData.password.length < 6) newErrors.password = '비밀번호는 6글자 이상이어야 합니다.';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    
    if (!formData.agreeTerms) newErrors.agreeTerms = '이용약관에 동의해주세요.';
    
    setErrors(newErrors);
    // 에러 객체가 비어있으면 true(유효), 아니면 false(유효하지 않음)를 반환합니다.
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    
    if (!validateForm()) return; // 유효성 검사 실패 시 중단
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // AuthContext의 signup 함수 호출
      const result = await signup({
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        alert('회원가입이 완료되었습니다!');
        navigate('/login', { replace: true }); // 성공 시 로그인 페이지로 이동
      } else {
        // API로부터 받은 에러 메시지를 표시
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: '회원가입 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  // --- RENDER (렌더링) ---
  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        <div className={styles.signupForm}>
          <h1 className={styles.title}>회원가입</h1>
          
          {/* API 에러 등 일반적인 에러 메시지 표시 영역 */}
          {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}
          
          <form onSubmit={handleSubmit}>
            {/* 닉네임 입력 그룹 */}
            <div className={styles.inputGroup}>
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text" id="nickname" name="nickname"
                value={formData.nickname} onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                className={errors.nickname ? styles.error : ''}
                disabled={isLoading} required
              />
              {errors.nickname && <span className={styles.fieldError}>{errors.nickname}</span>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                className={errors.email ? styles.error : ''}
                disabled={isLoading}
                required
              />
              {errors.email && (
                <span className={styles.fieldError}>{errors.email}</span>
              )}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요 (6글자 이상)"
                className={errors.password ? styles.error : ''}
                disabled={isLoading}
                required
              />
              {errors.password && (
                <span className={styles.fieldError}>{errors.password}</span>
              )}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                className={errors.confirmPassword ? styles.error : ''}
                disabled={isLoading}
                required
              />
              {errors.confirmPassword && (
                <span className={styles.fieldError}>{errors.confirmPassword}</span>
              )}
            </div>
            
            <div className={styles.checkboxGroup}>
              <label className={errors.agreeTerms ? styles.error : ''}>
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} disabled={isLoading} required />
                <span>이용약관 및 개인정보처리방침에 동의합니다</span>
              </label>
              {errors.agreeTerms && (
                <span className={styles.fieldError}>{errors.agreeTerms}</span>
              )}
            </div>
            
            <button type="submit" className={styles.signupButton} disabled={isLoading}>
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </form>
          
          <div className={styles.signupFooter}>
            <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
            <Link to="/" className={styles.homeLink}>홈으로 돌아가기</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;