// src/components/admin/MaintenanceManagement.jsx
import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../../context/MaintenanceContext';
import styles from './Admin.module.css';

const MaintenanceManagement = () => {
  const { 
    maintenanceSettings, 
    updateMaintenanceSettings, 
    setMaintenanceMode,
    isMaintenanceMode 
  } = useMaintenance();

  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    message: '시스템 점검 중입니다. 잠시 후 다시 접속해주세요.',
    reason: '정기 점검',
    isActive: false
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (maintenanceSettings) {
      setFormData(maintenanceSettings);
    }
  }, [maintenanceSettings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      // 시간 검사
      if (formData.isActive) {
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
        
        if (endDateTime <= startDateTime) {
          alert('종료 시간은 시작 시간보다 빨라야 합니다.');
          setLoading(false);
          return;
        }
      }

      updateMaintenanceSettings(formData);
      setSuccessMessage('점검 설정이 성공적으로 저장되었습니다.');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('점검 설정 저장 실패:', error);
      alert('점검 설정 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickToggle = () => {
    const newActiveState = !isMaintenanceMode;
    setMaintenanceMode(newActiveState);
    setFormData(prev => ({ ...prev, isActive: newActiveState }));
    setSuccessMessage(`점검 모드가 ${newActiveState ? '활성화' : '비활성화'}되었습니다.`);
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const getCurrentStatus = () => {
    if (!maintenanceSettings || !maintenanceSettings.isActive) {
      return { status: '비활성', color: '#38a169' };
    }

    const now = new Date();
    const startDateTime = new Date(`${maintenanceSettings.startDate}T${maintenanceSettings.startTime}`);
    const endDateTime = new Date(`${maintenanceSettings.endDate}T${maintenanceSettings.endTime}`);

    if (now < startDateTime) {
      return { status: '예약됨', color: '#3182ce' };
    } else if (now >= startDateTime && now <= endDateTime) {
      return { status: '진행 중', color: '#e53e3e' };
    } else {
      return { status: '종료됨', color: '#718096' };
    }
  };

  const statusInfo = getCurrentStatus();

  return (
    <div className={styles.userManagementContainer}>
      <h3>점검 관리</h3>
      
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      {/* 현재 상태 */}
      <div className={styles.pageSection}>
        <h4>현재 점검 상태</h4>
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255, 255, 255, 0.8)', 
          borderRadius: '15px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              color: statusInfo.color 
            }}>
              상태: {statusInfo.status}
            </span>
            {isMaintenanceMode && (
              <div style={{ marginTop: '10px', color: '#718096' }}>
                점검이 활성화되어 있습니다. 사용자들은 점검 페이지를 보게 됩니다.
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleQuickToggle}
            className={styles.userFormButton}
            style={{
              background: isMaintenanceMode 
                ? 'linear-gradient(135deg, #f56565, #e53e3e)' 
                : 'linear-gradient(135deg, #48bb78, #38a169)',
              minWidth: '120px'
            }}
          >
            {isMaintenanceMode ? '점검 종료' : '점검 시작'}
          </button>
        </div>
      </div>

      {/* 점검 설정 */}
      <form onSubmit={handleSubmit} className={styles.userForm}>
        <div>
          <label>점검 사유</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="예: 정기 점검, 시스템 업데이트"
            required
          />
        </div>

        <div>
          <label>점검 메시지</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="사용자에게 표시될 점검 메시지"
            rows="3"
            required
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
        </div>

        <div>
          <label>시작 날짜</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>시작 시간</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>종료 날짜</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>종료 시간</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
          />
          <label htmlFor="isActive" style={{ margin: 0 }}>점검 활성화</label>
        </div>

        <button
          type="submit"
          className={styles.userFormButton}
          disabled={loading}
        >
          {loading ? '저장 중...' : '설정 저장'}
        </button>
      </form>

      {/* 점검 예약 정보 */}
      {formData.isActive && formData.startDate && formData.endDate && (
        <div className={styles.pageSection}>
          <h4>점검 예약 정보</h4>
          <div style={{ 
            padding: '20px', 
            background: 'rgba(255, 255, 255, 0.8)', 
            borderRadius: '15px' 
          }}>
            <p><strong>점검 사유:</strong> {formData.reason}</p>
            <p><strong>시작:</strong> {new Date(`${formData.startDate}T${formData.startTime}`).toLocaleString('ko-KR')}</p>
            <p><strong>종료:</strong> {new Date(`${formData.endDate}T${formData.endTime}`).toLocaleString('ko-KR')}</p>
            <p><strong>메시지:</strong> {formData.message}</p>
          </div>
        </div>
      )}

      {/* 사용 안내 */}
      <div className={styles.pageSection}>
        <h4>사용 안내</h4>
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255, 255, 255, 0.8)', 
          borderRadius: '15px',
          color: '#718096'
        }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>점검이 활성화되면 관리자 페이지를 제외한 모든 페이지에서 점검 페이지가 표시됩니다.</li>
            <li>점검 시간이 지나면 자동으로 점검 모드가 해제됩니다.</li>
            <li>긴급 상황 시 "점검 시작/종료" 버튼으로 즉시 점검 모드를 변경할 수 있습니다.</li>
            <li>점검 설정은 브라우저 로컬 스토리지에 저장됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;