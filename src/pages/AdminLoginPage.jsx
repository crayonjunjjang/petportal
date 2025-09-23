// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import styles from './AdminLogin.module.css';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin, isAdminLoading } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    const result = await loginAdmin(username, password);
    if (result.success) {
      navigate('/admin'); // Redirect to admin dashboard on success
    } else {
      setError(result.error || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className={styles.adminLoginPage}>
      <div className={styles.adminLoginContainer}>
        <h2>관리자 로그인</h2>
        <form onSubmit={handleSubmit} className={styles.adminLoginForm}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isAdminLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isAdminLoading}
            />
          </div>
          <button type="submit" className={styles.loginButton} disabled={isAdminLoading}>
            {isAdminLoading ? (
              <><span className={styles.loadingSpinner}></span>로그인 중...</>
            ) : '로그인'}
          </button>
        </form>
        
        <div className={styles.adminInfo}>
          <h4>데모 관리자 계정</h4>
          <p>아이디: <code>admin</code></p>
          <p>비밀번호: <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
