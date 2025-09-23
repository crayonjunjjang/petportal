// src/components/modal/LoginModal.jsx
import React, { useState } from 'react';
import SocialLoginButtons from './SocialLoginButtons';
import styles from './LoginModal.module.css';
import { useAuth } from '../../context/AuthContext'; // useAuth 임포트

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false); // New state for rememberMe
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // useAuth 훅에서 login 함수 가져오기

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
        alert('로그인 성공!');
        onClose();
        // AuthContext에서 user 상태가 업데이트되므로, 여기서는 새로고침이 필요 없을 수 있습니다.
        // 필요하다면 window.location.reload(); 를 사용하세요.
      } else {
        alert(response.error || '로그인에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} 소셜 로그인 시도`);
    // 소셜 로그인 API 호출 준비
    // 실제 구현 시 각 소셜 로그인 SDK 사용
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>로그인</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className={styles.checkmark}></span>
              아이디 저장
            </label>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>또는</span>
        </div>

        <SocialLoginButtons onSocialLogin={handleSocialLogin} />

        <div className={styles.switchModal}>
          <span>계정이 없으신가요? </span>
          <button onClick={onSwitchToSignup}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;