// src/context/MaintenanceContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const MaintenanceContext = createContext();

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};

export const MaintenanceProvider = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    message: '시스템 점검 중입니다. 잠시 후 다시 접속해 주세요.',
    reason: '정기 점검',
    isActive: false
  });

  // 점검 상태 확인 함수
  const checkMaintenanceStatus = () => {
    const savedSettings = localStorage.getItem('maintenanceSettings');
    if (!savedSettings) return false;

    const settings = JSON.parse(savedSettings);
    if (!settings.isActive) return false;

    const now = new Date();
    const startDateTime = new Date(`${settings.startDate}T${settings.startTime}`);
    const endDateTime = new Date(`${settings.endDate}T${settings.endTime}`);

    // 점검 시간이 지났으면 자동으로 비활성화
    if (now > endDateTime) {
      const updatedSettings = { ...settings, isActive: false };
      localStorage.setItem('maintenanceSettings', JSON.stringify(updatedSettings));
      setMaintenanceSettings(updatedSettings);
      return false;
    }

    // 점검 시간 범위에 있는지 확인
    if (now >= startDateTime && now <= endDateTime) {
      setMaintenanceSettings(settings);
      return true;
    }

    return false;
  };

  // 컴포넌트 마운트 시 점검 상태 확인
  useEffect(() => {
    const isInMaintenance = checkMaintenanceStatus();
    setIsMaintenanceMode(isInMaintenance);

    // 설정 불러오기
    const savedSettings = localStorage.getItem('maintenanceSettings');
    if (savedSettings) {
      setMaintenanceSettings(JSON.parse(savedSettings));
    }
  }, []);

  // 실시간으로 점검 상태 확인 (1분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      const isInMaintenance = checkMaintenanceStatus();
      setIsMaintenanceMode(isInMaintenance);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 점검 설정 업데이트 함수
  const updateMaintenanceSettings = (newSettings) => {
    setMaintenanceSettings(newSettings);
    localStorage.setItem('maintenanceSettings', JSON.stringify(newSettings));

    // 즉시 점검 상태 확인
    const isInMaintenance = checkMaintenanceStatus();
    setIsMaintenanceMode(isInMaintenance);
  };

  // 점검 모드 강제 활성화/비활성화
  const setMaintenanceMode = (isActive) => {
    const updatedSettings = { ...maintenanceSettings, isActive };
    updateMaintenanceSettings(updatedSettings);
    setIsMaintenanceMode(isActive);
  };

  // 점검 종료 시간까지의 남은 시간 계산
  const getTimeUntilMaintenanceEnd = () => {
    if (!isMaintenanceMode || !maintenanceSettings.endDate || !maintenanceSettings.endTime) {
      return null;
    }

    const now = new Date();
    const endDateTime = new Date(`${maintenanceSettings.endDate}T${maintenanceSettings.endTime}`);
    const timeDiff = endDateTime - now;

    if (timeDiff <= 0) return null;

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, endDateTime };
  };

  const value = {
    isMaintenanceMode,
    maintenanceSettings,
    updateMaintenanceSettings,
    setMaintenanceMode,
    getTimeUntilMaintenanceEnd,
    checkMaintenanceStatus
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export default MaintenanceContext;