// src/pages/MaintenancePage.jsx
import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import styles from './MaintenancePage.module.css';

const MaintenancePage = () => {
  const { maintenanceSettings, getTimeUntilMaintenanceEnd } = useMaintenance();
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 시간 업데이트 (매초)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const timeUntilEnd = getTimeUntilMaintenanceEnd();
      setTimeLeft(timeUntilEnd);
    }, 1000);

    return () => clearInterval(timer);
  }, [getTimeUntilMaintenanceEnd]);

  const formatEndTime = () => {
    if (!maintenanceSettings || !maintenanceSettings.endDate || !maintenanceSettings.endTime) {
      return '점검 종료 시간이 설정되지 않았습니다.';
    }

    const endDateTime = new Date(`${maintenanceSettings.endDate}T${maintenanceSettings.endTime}`);
    return endDateTime.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    });
  };

  const getProgressPercentage = () => {
    if (!maintenanceSettings || !maintenanceSettings.startDate || !maintenanceSettings.startTime ||
        !maintenanceSettings.endDate || !maintenanceSettings.endTime) {
      return 0;
    }

    const startDateTime = new Date(`${maintenanceSettings.startDate}T${maintenanceSettings.startTime}`);
    const endDateTime = new Date(`${maintenanceSettings.endDate}T${maintenanceSettings.endTime}`);
    const now = new Date();

    const totalDuration = endDateTime - startDateTime;
    const elapsed = now - startDateTime;

    if (totalDuration <= 0) return 0;

    const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    return Math.round(percentage);
  };

  return (
    <div className={styles.maintenancePage}>
      <div className={styles.maintenanceContainer}>
        {/* 아이콘 */}
        <div className={styles.iconContainer}>
          <div className={styles.maintenanceIcon}>🛠️</div>
          <div className={styles.sparkles}>
            <span>✨</span>
            <span>✨</span>
            <span>✨</span>
            <span>✨</span>
            <span>✨</span>
            <span>✨</span>
          </div>
        </div>

        {/* 제목 */}
        <h1 className={styles.mainTitle}>점검 안내</h1>

        {/* 점검 사유 */}
        <div className={styles.reasonBadge}>
          {maintenanceSettings && maintenanceSettings.reason ? maintenanceSettings.reason : '점검 사유가 등록되어 있지 않습니다.'}
        </div>

        {/* 메인 메시지 */}
        <div className={styles.messageContainer}>
          <p className={styles.mainMessage}>
            {maintenanceSettings && maintenanceSettings.message ? maintenanceSettings.message : '서비스 점검이 진행 중입니다. 불편을 드려 죄송합니다. 잠시 후 다시 이용해 주세요.'}
          </p>
        </div>

        {/* 진행률 */}
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>진행률</div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <div className={styles.progressText}>{getProgressPercentage()}% 진행</div>
        </div>

        {/* 시간 정보 */}
        <div className={styles.timeInfo}>
          <div className={styles.timeCard}>
            <div className={styles.timeLabel}>현재 시각</div>
            <div className={styles.timeValue}>
              {currentTime.toLocaleString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>

          <div className={styles.timeCard}>
            <div className={styles.timeLabel}>종료 예정</div>
            <div className={styles.timeValue}>{formatEndTime()}</div>
          </div>

          {timeLeft && (
            <div className={styles.timeCard}>
              <div className={styles.timeLabel}>남은 시간</div>
              <div className={styles.countdownValue}>
                {timeLeft.hours > 0 && `${timeLeft.hours}시간 `}
                {timeLeft.minutes}분
              </div>
            </div>
          )}
        </div>

        {/* 정보 카드 */}
        <div className={styles.infoContainer}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}></div>
            <div className={styles.infoText}>
              <strong>점검 범위</strong>
              <p>점검 시간 동안 일부 서비스 기능 이용이 제한될 수 있습니다.</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🕒</div>
            <div className={styles.infoText}>
              <strong>점검 일정</strong>
              <p>예정된 시간에 점검이 진행됩니다. 이용에 참고해 주세요.</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📞</div>
            <div className={styles.infoText}>
              <strong>문의</strong>
              <p>긴급 문의는 고객센터로 연락 바랍니다.</p>
            </div>
          </div>
        </div>

        {/* 브랜드 */}
        <div className={styles.brandingContainer}>
          <div className={styles.logo}>PetCare</div>
          <p className={styles.brandText}>PetCare 서비스를 이용해 주셔서 감사합니다.</p>
        </div>
      </div>

      {/* 배경 애니메이션 */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingElement} style={{ '--delay': '0s', '--duration': '20s' }}>⭐</div>
        <div className={styles.floatingElement} style={{ '--delay': '2s', '--duration': '25s' }}>✨</div>
        <div className={styles.floatingElement} style={{ '--delay': '4s', '--duration': '18s' }}>🛠️</div>
        <div className={styles.floatingElement} style={{ '--delay': '6s', '--duration': '22s' }}>⚙️</div>
        <div className={styles.floatingElement} style={{ '--delay': '8s', '--duration': '26s' }}>💤</div>
      </div>
    </div>
  );
};

export default MaintenancePage;