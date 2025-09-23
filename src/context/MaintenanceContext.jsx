// C:\Users\1\Desktop\my-app\src\context\MaintenanceContext.jsx

// --- 파일 역할: 애플리케이션의 유지보수 모드 상태 관리 ---
// 이 파일은 애플리케이션의 유지보수 모드(점검 중) 상태를 전역적으로 관리하고,
// 관련 설정 및 상태 업데이트 함수를 하위 컴포넌트들에게 제공합니다.
// localStorage를 사용하여 유지보수 설정을 영구적으로 저장하고, 주기적으로 점검 상태를 확인합니다.

// --- IMPORT ---
import React, { createContext, useContext, useState, useEffect } from 'react';

// --- CONTEXT CREATION ---
// MaintenanceContext를 생성합니다. 이 Context는 유지보수 모드 상태와 관련 함수들을 전역적으로 제공합니다.
const MaintenanceContext = createContext();

// --- CUSTOM HOOK: useMaintenance ---
/**
 * @function useMaintenance
 * @description MaintenanceContext의 값을 편리하게 사용할 수 있도록 하는 커스텀 훅입니다.
 * MaintenanceProvider 내에서 호출되지 않으면 에러를 발생시킵니다.
 * @returns {object} MaintenanceContext의 현재 값 (isMaintenanceMode, maintenanceSettings, updateMaintenanceSettings, setMaintenanceMode, getTimeUntilMaintenanceEnd, checkMaintenanceStatus)
 */
export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};

// --- MAINTENANCE PROVIDER COMPONENT ---
/**
 * @component MaintenanceProvider
 * @description 애플리케이션의 유지보수 모드 상태를 관리하고, 하위 컴포넌트들에게 제공하는 프로바이더 컴포넌트입니다.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - MaintenanceProvider의 하위 컴포넌트들.
 */
export const MaintenanceProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  // 현재 애플리케이션이 유지보수 모드인지 여부를 나타내는 상태입니다.
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  // 유지보수 모드에 대한 상세 설정을 저장하는 상태입니다.
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    startDate: '', // 점검 시작 날짜 (YYYY-MM-DD)
    startTime: '',
    endDate: '',   // 점검 종료 날짜 (YYYY-MM-DD)
    endTime: '',
    message: '시스템 점검 중입니다. 잠시 후 다시 접속해 주세요.', // 사용자에게 표시될 메시지
    reason: '정기 점검', // 점검 사유
    isActive: false // 유지보수 모드 활성화 여부 (수동 제어)
  });

  // --- HELPER FUNCTIONS ---
  /**
   * @function checkMaintenanceStatus
   * @description localStorage에 저장된 설정과 현재 시간을 비교하여 유지보수 모드 활성화 여부를 판단합니다.
   * 점검 시간이 지나면 자동으로 isActive 상태를 비활성화합니다.
   * @returns {boolean} 현재 유지보수 모드인지 여부.
   */
  const checkMaintenanceStatus = () => {
    const savedSettings = localStorage.getItem('maintenanceSettings');
    if (!savedSettings) return false; // 저장된 설정이 없으면 유지보수 모드 아님

    const settings = JSON.parse(savedSettings);
    if (!settings.isActive) return false; // isActive가 false면 유지보수 모드 아님

    const now = new Date(); // 현재 시간
    // 시작 및 종료 DateTime 객체 생성 (ISO 8601 형식으로 파싱)
    const startDateTime = new Date(`${settings.startDate}T${settings.startTime}`);
    const endDateTime = new Date(`${settings.endDate}T${settings.endTime}`);

    // 점검 종료 시간이 현재 시간보다 지났으면, 유지보수 모드를 자동으로 비활성화합니다.
    if (now > endDateTime) {
      const updatedSettings = { ...settings, isActive: false };
      localStorage.setItem('maintenanceSettings', JSON.stringify(updatedSettings));
      setMaintenanceSettings(updatedSettings);
      return false;
    }

    // 현재 시간이 점검 시작 시간과 종료 시간 사이에 있는지 확인합니다.
    if (now >= startDateTime && now <= endDateTime) {
      setMaintenanceSettings(settings); // 현재 설정으로 상태 업데이트
      return true;
    }

    return false;
  };

  // --- EFFECTS ---
  /**
   * @useEffect
   * 컴포넌트 마운트 시 초기 유지보수 상태를 확인하고, localStorage에서 설정을 불러옵니다.
   */
  useEffect(() => {
    const isInMaintenance = checkMaintenanceStatus();
    setIsMaintenanceMode(isInMaintenance);

    const savedSettings = localStorage.getItem('maintenanceSettings');
    if (savedSettings) {
      setMaintenanceSettings(JSON.parse(savedSettings));
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  /**
   * @useEffect
   * 1분(60000ms)마다 주기적으로 유지보수 상태를 확인합니다.
   * `setInterval`을 사용하여 주기적으로 `checkMaintenanceStatus`를 호출하고,
   * 컴포넌트 언마운트 시 `clearInterval`로 타이머를 정리합니다.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const isInMaintenance = checkMaintenanceStatus();
      setIsMaintenanceMode(isInMaintenance);
    }, 60000); // 1분마다 실행

    // 클린업 함수: 컴포넌트 언마운트 시 인터벌을 정리하여 메모리 누수를 방지합니다.
    return () => clearInterval(interval);
  }, []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 설정되고 언마운트 시 정리됩니다.

  // --- CONTEXT FUNCTIONS ---
  /**
   * @function updateMaintenanceSettings
   * @description 유지보수 설정을 업데이트하고 localStorage에 저장합니다.
   * 설정 업데이트 후 즉시 유지보수 상태를 다시 확인합니다.
   * @param {object} newSettings - 새로 적용할 유지보수 설정 객체.
   */
  const updateMaintenanceSettings = (newSettings) => {
    setMaintenanceSettings(newSettings);
    localStorage.setItem('maintenanceSettings', JSON.stringify(newSettings));

    const isInMaintenance = checkMaintenanceStatus();
    setIsMaintenanceMode(isInMaintenance);
  };

  /**
   * @function setMaintenanceMode
   * @description 유지보수 모드를 강제로 활성화하거나 비활성화합니다.
   * `maintenanceSettings`의 `isActive` 속성을 직접 변경하고 업데이트 함수를 호출합니다.
   * @param {boolean} isActive - 유지보수 모드를 활성화할지 비활성화할지 여부.
   */
  const setMaintenanceMode = (isActive) => {
    const updatedSettings = { ...maintenanceSettings, isActive };
    updateMaintenanceSettings(updatedSettings);
    setIsMaintenanceMode(isActive);
  };

  /**
   * @function getTimeUntilMaintenanceEnd
   * @description 유지보수 종료까지 남은 시간을 계산합니다.
   * @returns {object | null} 남은 시간(시간, 분)과 종료 DateTime 객체를 포함하는 객체 또는 null.
   */
  const getTimeUntilMaintenanceEnd = () => {
    if (!isMaintenanceMode || !maintenanceSettings.endDate || !maintenanceSettings.endTime) {
      return null;
    }

    const now = new Date();
    const endDateTime = new Date(`${maintenanceSettings.endDate}T${maintenanceSettings.endTime}`);
    const timeDiff = endDateTime - now; // 남은 시간 (밀리초)

    if (timeDiff <= 0) return null; // 이미 종료되었으면 null 반환

    const hours = Math.floor(timeDiff / (1000 * 60 * 60)); // 남은 시간 (시)
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // 남은 시간 (분)

    return { hours, minutes, endDateTime };
  };

  // --- CONTEXT VALUE ---
  // Context Provider를 통해 제공될 값들을 정의합니다.
  const value = {
    isMaintenanceMode,
    maintenanceSettings,
    updateMaintenanceSettings,
    setMaintenanceMode,
    getTimeUntilMaintenanceEnd,
    checkMaintenanceStatus
  };

  // MaintenanceContext.Provider를 통해 value를 하위 컴포넌트들에게 제공합니다.
  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};
