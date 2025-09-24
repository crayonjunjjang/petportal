// src/pages/MaintenancePage.jsx

// --- 파일 역할: 서비스 점검 중일 때 사용자에게 보여주는 안내 페이지 ---
// 이 컴포넌트는 `MaintenanceContext`로부터 점검 관련 설정(시작/종료 시간, 사유, 메시지 등)을 받아와
// 사용자에게 점검 진행 상황을 시각적으로 안내합니다.
// 주요 기능으로는 점검 종료까지 남은 시간 표시, 진행률 바, 점검 관련 정보 안내 등이 있습니다.

import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext'; // 점검 상태 관리를 위한 컨텍스트
import styles from './MaintenancePage.module.css'; // 점검 페이지 전용 스타일

// --- MaintenancePage Component ---
const MaintenancePage = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const { maintenanceSettings, getTimeUntilMaintenanceEnd } = useMaintenance(); // 컨텍스트에서 점검 설정과 남은 시간 계산 함수를 가져옴
  const [timeLeft, setTimeLeft] = useState(null); // 점검 종료까지 남은 시간
  const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시각

  // --- EFFECTS (시간 업데이트) ---
  // 1초마다 현재 시간과 점검 종료까지 남은 시간을 업데이트합니다.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const timeUntilEnd = getTimeUntilMaintenanceEnd();
      setTimeLeft(timeUntilEnd);
    }, 1000);

    // 컴포넌트가 언마운트될 때 타이머를 정리합니다. (메모리 누수 방지)
    return () => clearInterval(timer);
  }, [getTimeUntilMaintenanceEnd]);

  // --- HELPER FUNCTIONS (도우미 함수) ---

  // 점검 종료 시각을 'ko-KR' 형식의 문자열로 변환하는 함수
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

  // 점검 진행률을 백분율로 계산하는 함수
  const getProgressPercentage = () => {
    if (!maintenanceSettings || !maintenanceSettings.startDate || !maintenanceSettings.startTime ||
        !maintenanceSettings.endDate || !maintenanceSettings.endTime) {
      return 0;
    }

    const startDateTime = new Date(`${maintenanceSettings.startDate}T${maintenanceSettings.startTime}`);
    const endDateTime = new Date(`${maintenanceSettings.endDate}T${maintenanceSettings.endTime}`);
    const now = new Date();

    const totalDuration = endDateTime - startDateTime; // 총 점검 시간
    const elapsed = now - startDateTime; // 경과 시간

    if (totalDuration <= 0) return 0;

    // 진행률을 0%와 100% 사이의 값으로 보정하여 반환
    const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    return Math.round(percentage);
  };

  // --- RENDER (렌더링) ---
  return (
    <div className={styles.maintenancePage}>
      <div className={styles.maintenanceContainer}>
        {/* 아이콘 섹션 */}
        <div className={styles.iconContainer}>
          <div className={styles.maintenanceIcon}>🛠️</div>
          <div className={styles.sparkles}>
            {/* 반짝이는 효과를 위한 span 요소들 */}
            <span>✨</span><span>✨</span><span>✨</span><span>✨</span><span>✨</span><span>✨</span>
          </div>
        </div>

        {/* 제목 */}
        <h1 className={styles.mainTitle}>점검 안내</h1>

        {/* 점검 사유 */}
        <div className={styles.reasonBadge}>
          {maintenanceSettings?.reason || '점검 사유가 등록되어 있지 않습니다.'}
        </div>

        {/* 메인 안내 메시지 */}
        <div className={styles.messageContainer}>
          <p className={styles.mainMessage}>
            {maintenanceSettings?.message || '서비스 점검이 진행 중입니다. 불편을 드려 죄송합니다. 잠시 후 다시 이용해 주세요.'}
          </p>
        </div>

        {/* 진행률 표시 섹션 */}
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>진행률</div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${getProgressPercentage()}%` }} // 진행률에 따라 너비 변경
            ></div>
          </div>
          <div className={styles.progressText}>{getProgressPercentage()}% 진행</div>
        </div>

        {/* 시간 정보 섹션 */}
        <div className={styles.timeInfo}>
          <div className={styles.timeCard}>
            <div className={styles.timeLabel}>현재 시각</div>
            <div className={styles.timeValue}>
              {currentTime.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          <div className={styles.timeCard}>
            <div className={styles.timeLabel}>종료 예정</div>
            <div className={styles.timeValue}>{formatEndTime()}</div>
          </div>

          {/* 남은 시간이 있을 경우에만 표시 */}
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

        {/* 추가 정보 안내 카드 섹션 */}
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

        {/* 브랜딩 섹션 */}
        <div className={styles.brandingContainer}>
          <div className={styles.logo}>PetPortal</div>
          <p className={styles.brandText}>PetPortal 서비스를 이용해 주셔서 감사합니다.</p>
        </div>
      </div>

      {/* 배경 애니메이션 요소 */}
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
