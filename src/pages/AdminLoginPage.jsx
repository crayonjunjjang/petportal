import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import styles from './AdminLogin.module.css';
import Button from '../components/ui/Button';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!login(username, password)) {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    else {
        navigate('/admin');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>관리자 로그인</h1>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" variant="primary" fullWidth>로그인</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
