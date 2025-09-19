// src/components/layout/Login.jsx
import React from 'react';
import styles from './Login.module.css';

const Login = ({ isScrolled }) => {
  // isScrolled 상태에 따라 클래스를 동적으로 추가
  const loginActionsClasses = `${styles.loginActions} ${isScrolled ? styles.scrolled : ''}`;

  return (
    <div className={loginActionsClasses}>
      <a href="#" className={styles.loginLink}>로그인</a>
      <a href="#" className={styles.signupButton}>회원가입</a>
    </div>
  );
};

export default Login;