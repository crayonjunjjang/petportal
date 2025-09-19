// src/components/modal/SignupModal.jsx
import React, { useState } from 'react';
import SocialLoginButtons from './SocialLoginButtons';
import styles from './SignupModal.module.css';

import { TERMS_CONTENT, PRIVACY_CONTENT } from '../../utils/constants';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeToAds: false // New: Optional ad agreement
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTermsModal, setShowTermsModal] = useState(false); // New state for terms modal
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // New state for privacy modal

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // 서버 API 호출
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        onSwitchToLogin();
      } else {
        alert(data.message || '회원가입에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>회원가입</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              className={errors.name ? styles.errorInput : ''}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">비밀번호 확인 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              className={errors.confirmPassword ? styles.errorInput : ''}
            />
            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone">전화번호 *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="전화번호를 입력하세요"
              className={errors.phone ? styles.errorInput : ''}
            />
            {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
              />
              <span className={styles.checkmark}></span>
              이용약관에 동의합니다 * <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className={styles.detailLink}>상세 약관 보기</a>
            </label>
            {errors.agreeTerms && <span className={styles.errorMessage}>{errors.agreeTerms}</span>}
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleInputChange}
              />
              <span className={styles.checkmark}></span>
              개인정보처리방침에 동의합니다 * <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }} className={styles.detailLink}>상세보기</a>
            </label>
            {errors.agreePrivacy && <span className={styles.errorMessage}>{errors.agreePrivacy}</span>}
          </div>

          {/* New: Optional Ad Agreement Checkbox */}
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreeToAds"
                checked={formData.agreeToAds}
                onChange={handleInputChange}
              />
              <span className={styles.checkmark}></span>
              광고수신을 동의합니다 (선택)
            </label>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>또는</span>
        </div>

        <SocialLoginButtons />

        <div className={styles.switchModal}>
          <span>계정이 없으신가요? </span>
          <button onClick={onSwitchToLogin}>로그인</button>
        </div>
      </div>

      {showTermsModal && (
        <div className={styles.detailModalOverlay} onClick={() => setShowTermsModal(false)}>
          <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailModalHeader}>
              <h3>이용약관</h3>
              <button className={styles.closeButton} onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className={styles.detailModalBody}>
              <pre>{TERMS_CONTENT}</pre>
            </div>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className={styles.detailModalOverlay} onClick={() => setShowPrivacyModal(false)}>
          <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailModalHeader}>
              <h3>개인정보처리방침</h3>
              <button className={styles.closeButton} onClick={() => setShowPrivacyModal(false)}>×</button>
            </div>
            <div className={styles.detailModalBody}>
              <pre>{PRIVACY_CONTENT}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupModal;