// src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: inputValue
    });
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.trim().length < 2) {
      newErrors.nickname = '닉네임은 2글자 이상이어야 합니다.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6글자 이상이어야 합니다.';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await signup({
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        alert('회원가입이 완료되었습니다!');
        navigate('/login', { replace: true }); // 로그인 페이지로 이동
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: '회원가입 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        <div className={styles.signupForm}>
          <h1 className={styles.title}>회원가입</h1>
          
          {errors.general && (
            <div className={styles.errorMessage}>
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                className={errors.nickname ? styles.error : ''}
                disabled={isLoading}
                required
              />
              {errors.nickname && (
                <span className={styles.fieldError}>{errors.nickname}</span>
              )}
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
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <span>이용약관 및 개인정보처리방침에 동의합니다</span>
              </label>
              {errors.agreeTerms && (
                <span className={styles.fieldError}>{errors.agreeTerms}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className={styles.signupButton}
              disabled={isLoading}
            >
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
