// src/pages/AdminLoginPage.jsx

// --- IMPORT ---
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅
import { useAdminAuth } from '../context/AdminAuthContext'; // 관리자 인증 컨텍스트
import styles from './AdminLogin.module.css'; // 컴포넌트 전용 CSS 모듈

/**
 * @component AdminLoginPage
 * @description 관리자 로그인 페이지 컴포넌트입니다.
 * 관리자 아이디와 비밀번호를 입력받아 로그인을 처리하고, 성공 시 관리자 대시보드로 리디렉션합니다.
 * 이미 로그인된 관리자는 로그인 페이지에 접근할 수 없도록 합니다.
 */
const AdminLoginPage = () => {
  // --- STATE MANAGEMENT ---
  const [username, setUsername] = useState(''); // 아이디 입력 필드 상태
  const [password, setPassword] = useState(''); // 비밀번호 입력 필드 상태
  const [error, setError] = useState(''); // 로그인 오류 메시지 상태

  // --- HOOKS & CONTEXT ---
  // useAdminAuth 훅을 통해 관리자 로그인 함수와 로딩 상태, 인증 여부를 가져옵니다.
  const { loginAdmin, isAdminLoading, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // --- EFFECTS ---
  /**
   * @useEffect
   * 컴포넌트 마운트 시 또는 isAdminAuthenticated 상태가 변경될 때 실행됩니다.
   * 이미 관리자로 인증된 경우, 관리자 대시보드 페이지로 리디렉션하여 로그인 페이지 접근을 막습니다.
   */
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true }); // 관리자 대시보드로 이동 (뒤로가기 방지)
    }
  }, [isAdminAuthenticated, navigate]); // isAdminAuthenticated 또는 navigate가 변경될 때마다 실행

  // --- HANDLER FUNCTIONS ---
  /**
   * @function handleSubmit
   * @description 로그인 폼 제출 시 호출되는 핸들러 함수입니다.
   * 아이디와 비밀번호 유효성을 검사하고, loginAdmin 함수를 호출하여 로그인을 시도합니다.
   * @param {Event} e - 폼 제출 이벤트 객체.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    setError(''); // 이전 오류 메시지 초기화

    // 클라이언트 측 유효성 검사: 아이디 또는 비밀번호가 비어있는지 확인
    if (!username || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // loginAdmin 함수를 호출하여 로그인 시도
    const result = await loginAdmin(username, password);
    if (result.success) {
      // 로그인 성공 시 관리자 대시보드로 이동
      navigate('/admin'); 
    } else {
      // 로그인 실패 시 오류 메시지 설정
      setError(result.error || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  // --- RENDER ---
  return (
    <div className={styles.adminLoginPage}> {/* 관리자 로그인 페이지 전체 컨테이너 */}
      <div className={styles.adminLoginContainer}> {/* 로그인 폼 컨테이너 */}
        <h2>관리자 로그인</h2>
        <form onSubmit={handleSubmit} className={styles.adminLoginForm}> {/* 로그인 폼 */}
          {/* 오류 메시지가 있을 경우 표시 */}
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          <div className={styles.inputGroup}> {/* 아이디 입력 그룹 */}
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isAdminLoading} // 로그인 중에는 입력 비활성화
            />
          </div>
          
          <div className={styles.inputGroup}> {/* 비밀번호 입력 그룹 */}
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isAdminLoading} // 로그인 중에는 입력 비활성화
            />
          </div>
          
          {/* 로그인 버튼 */}
          <button type="submit" className={styles.loginButton} disabled={isAdminLoading}> {/* 로그인 중에는 버튼 비활성화 */}
            {isAdminLoading ? ( // 로딩 중일 때 스피너와 텍스트 표시
              <><span className={styles.loadingSpinner}></span>로그인 중...</>
            ) : '로그인'} {/* 로딩 중이 아닐 때 '로그인' 텍스트 표시 */}
          </button>
        </form>
        
        {/* 데모 관리자 계정 정보 (개발/테스트용) */}
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