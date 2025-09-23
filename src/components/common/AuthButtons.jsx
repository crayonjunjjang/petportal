// src/components/common/AuthButtons.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../modal/LoginModal';
import SignupModal from '../modal/SignupModal';
import styles from './AuthButtons.module.css';

const AuthButtons = ({ isScrolled }) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setSignupModalOpen(false);
  };

  const openSignupModal = () => {
    setSignupModalOpen(true);
    setLoginModalOpen(false);
  };

  const closeModals = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(false);
  };

  const switchToSignup = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  const switchToLogin = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated && user) {
    return null; // 인증된 경우 AuthButtons는 아무것도 렌더링하지 않습니다.
  }

  return (
    <>
      <div className={`${styles.authContainer} ${isScrolled ? styles.scrolled : ''}`}>
        <button 
          onClick={openLoginModal}
          className={`${styles.loginLink} ${isScrolled ? styles.scrolled : ''}`}
        >
          로그인
        </button>
        <button 
          onClick={openSignupModal}
          className={`${styles.signupButton} ${isScrolled ? styles.scrolled : ''}`}
        >
          회원가입
        </button>
      </div>

      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={closeModals}
        onSwitchToSignup={switchToSignup}
      />

      {/* 회원가입 모달 */}
      <SignupModal 
        isOpen={signupModalOpen}
        onClose={closeModals}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

export default AuthButtons;