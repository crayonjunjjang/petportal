// src/context/ProfileContext.jsx

// --- 파일 역할: 사용자 프로필 및 반려동물 정보 관리 ---
// 이 파일은 사용자 프로필 정보와 사용자가 등록한 반려동물(펫) 정보를 전역적으로 관리합니다.
// 로그인된 사용자의 프로필 데이터와 펫 목록을 제공하며, 펫 추가/수정/삭제 및 선택 기능을 포함합니다.
// localStorage를 사용하여 펫 데이터를 영구적으로 저장합니다.

// --- IMPORT ---
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_PET } from '../utils/petData'; // 기본 펫 데이터 구조
import { useAuth } from './AuthContext'; // 사용자 인증 상태를 가져오기 위한 AuthContext

// --- CONTEXT CREATION ---
// ProfileContext를 생성합니다. 이 Context는 사용자 프로필 및 펫 관련 상태와 함수들을 전역적으로 제공합니다.
const ProfileContext = createContext();

// --- CUSTOM HOOK: useProfile ---
/**
 * @function useProfile
 * @description ProfileContext의 값을 편리하게 사용할 수 있도록 하는 커스텀 훅입니다.
 * ProfileProvider 내에서 호출되지 않으면 에러를 발생시킵니다.
 * @returns {object} ProfileContext의 현재 값 (userProfile, pets, selectedPet, showUserProfile, showPetProfile, showAddPetForm, isAuthenticated, updateUserProfile, setShowUserProfile, addPet, updatePet, deletePet, selectPet, setShowPetProfile, setShowAddPetForm, handleImageUpload)
 */
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// --- PROFILE PROVIDER COMPONENT ---
/**
 * @component ProfileProvider
 * @description 애플리케이션의 사용자 프로필 및 반려동물 정보를 관리하고, 하위 컴포넌트들에게 제공하는 프로바이더 컴포넌트입니다.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - ProfileProvider의 하위 컴포넌트들.
 */
export const ProfileProvider = ({ children }) => {
  // --- HOOKS & CONTEXT ---
  // AuthContext에서 현재 로그인된 사용자 정보와 인증 상태를 가져옵니다.
  const { user, isAuthenticated } = useAuth();

  // --- STATE MANAGEMENT ---
  const [userProfile, setUserProfile] = useState(null); // 현재 로그인된 사용자의 프로필 정보
  const [pets, setPets] = useState([]); // 사용자가 등록한 반려동물 목록
  const [selectedPet, setSelectedPet] = useState(null); // 현재 선택된 반려동물
  // UI 관련 상태 (모달/폼 표시 여부)
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showPetProfile, setShowPetProfile] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);

  // --- HELPER FUNCTIONS ---
  /**
   * @function saveUserData
   * @description 특정 사용자의 펫 데이터와 선택된 펫 정보를 localStorage에 저장합니다.
   * @param {string} userId - 데이터를 저장할 사용자의 ID.
   * @param {Array<object>} petsData - 저장할 펫 목록.
   * @param {object} selectedPetData - 저장할 선택된 펫 정보.
   */
  const saveUserData = useCallback((userId, petsData, selectedPetData) => {
    console.log('ProfileContext: Saving user data for user', userId, { petsData, selectedPetData });
    if (!userId) {
      console.log('ProfileContext: No userId provided for saving data.');
      return; // userId가 없으면 저장하지 않음
    }
    try {
      const allProfileData = JSON.parse(localStorage.getItem('allProfileData') || '{}');
      allProfileData[userId] = {
        pets: petsData,
        selectedPet: selectedPetData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('allProfileData', JSON.stringify(allProfileData));
      console.log('ProfileContext: Successfully saved allProfileData.');
    } catch (error) {
      console.error('ProfileContext: Failed to save user data:', error);
    }
  }, []); // useCallback 의존성 배열 비어있음

  /**
   * @function loadUserPets
   * @description 특정 사용자의 반려동물 정보를 localStorage에서 불러옵니다.
   * 만약 펫 정보가 없으면 기본 펫을 생성하여 저장합니다.
   * @param {string} userId - 펫 정보를 불러올 사용자의 ID.
   */
  const loadUserPets = useCallback((userId) => {
    console.log('ProfileContext: Loading pets for user', userId);
    if (!userId) {
      console.log('ProfileContext: No userId provided for loading pets.');
      return; // userId가 없으면 로드하지 않음
    }
    try {
      // localStorage에서 모든 사용자 프로필 데이터를 가져옵니다.
      const allProfileData = JSON.parse(localStorage.getItem('allProfileData') || '{}');
      const userData = allProfileData[userId]; // 현재 사용자의 데이터
      
      if (userData && userData.pets) {
        // 펫 정보가 있으면 상태에 설정합니다.
        setPets(userData.pets);
        setSelectedPet(userData.selectedPet || userData.pets[0] || null);
        console.log('ProfileContext: Loaded pets', userData.pets);
      } else {
        // 펫 정보가 없으면 기본 펫을 생성하여 설정하고 저장합니다.
        console.log('ProfileContext: No pets found for user, creating default pet.');
        const defaultPet = { ...DEFAULT_PET, id: Date.now() }; // 고유 ID 부여
        setPets([defaultPet]);
        setSelectedPet(defaultPet);
        saveUserData(userId, [defaultPet], defaultPet);
        console.log('ProfileContext: Created and saved default pet.');
      }
    } catch (error) {
      console.error('ProfileContext: Failed to load user pets:', error);
      // 에러 발생 시에도 기본 펫을 설정합니다.
      const defaultPet = { ...DEFAULT_PET, id: Date.now() };
      setPets([defaultPet]);
      setSelectedPet(defaultPet);
    }
  }, [saveUserData]); // saveUserData 함수가 변경될 때마다 함수 재생성

  // --- EFFECTS ---
  /**
   * @useEffect
   * `user` 객체가 변경될 때마다 사용자 프로필을 설정하고 펫 정보를 로드합니다.
   * `AuthContext`의 `user` 상태와 연동됩니다.
   */
  useEffect(() => {
    console.log('ProfileContext: User state changed', user);
    if (user) {
      setUserProfile(user); // AuthContext의 user 정보를 userProfile로 설정
      loadUserPets(user.id); // 해당 사용자의 펫 정보 로드
      console.log('ProfileContext: User logged in, setting profile and loading pets.');
    } else {
      // 사용자가 로그아웃하면 프로필 및 펫 정보 초기화
      setUserProfile(null);
      setPets([]);
      setSelectedPet(null);
      console.log('ProfileContext: User logged out, clearing profile and pets.');
    }
  }, [user, loadUserPets]); // user 또는 loadUserPets 함수가 변경될 때마다 실행

  /**
   * @useEffect
   * `pets`, `selectedPet`, `user` 상태가 변경될 때마다 localStorage에 사용자 데이터를 저장합니다.
   */
  useEffect(() => {
    console.log('ProfileContext: Pets, selectedPet, or user changed. Checking if data needs saving.', { user, pets, selectedPet });
    if (user && pets.length > 0) {
      saveUserData(user.id, pets, selectedPet);
      console.log('ProfileContext: Saving pet data due to state change.');
    } else if (user && pets.length === 0) {
      // If user is logged in but pets array is empty, ensure allProfileData is cleared for this user
      // This might happen if a user logs in and has no pets, and we don't want to keep old pet data
      const allProfileData = JSON.parse(localStorage.getItem('allProfileData') || '{}');
      if (allProfileData[user.id]) {
        delete allProfileData[user.id];
        localStorage.setItem('allProfileData', JSON.stringify(allProfileData));
        console.log('ProfileContext: Cleared pet data for user as pets array is empty.');
      }
    }
  }, [pets, selectedPet, user, saveUserData]); // pets, selectedPet, user, saveUserData 함수가 변경될 때마다 실행

  // --- CONTEXT FUNCTIONS ---
  /**
   * @function updateUserProfile
   * @description 사용자 프로필 정보를 업데이트합니다.
   * @param {object} newProfile - 업데이트할 프로필 정보.
   */
  const updateUserProfile = useCallback((newProfile) => {
    const updatedProfile = { ...userProfile, ...newProfile };
    setUserProfile(updatedProfile);
  }, [userProfile]); // userProfile이 변경될 때마다 함수 재생성

  /**
   * @function addPet
   * @description 새로운 반려동물을 목록에 추가합니다.
   * @param {object} newPet - 추가할 반려동물 정보.
   * @returns {object} ID가 부여된 새로 추가된 반려동물 객체.
   */
  const addPet = useCallback((newPet) => {
    const petWithId = { ...newPet, id: Date.now() }; // 고유 ID 부여
    setPets(prev => [...prev, petWithId]);
    return petWithId;
  }, []); // useCallback 의존성 배열 비어있음

  /**
   * @function updatePet
   * @description 특정 반려동물의 정보를 업데이트합니다.
   * @param {number} petId - 업데이트할 반려동물의 ID.
   * @param {object} updatedPet - 업데이트할 반려동물 정보.
   */
  const updatePet = useCallback((petId, updatedPet) => {
    setPets(prev => 
      prev.map(pet => 
        pet.id === petId ? { ...pet, ...updatedPet } : pet // 해당 ID의 펫 정보 업데이트
      )
    );
    // 선택된 펫이 업데이트된 펫과 동일하면 선택된 펫 정보도 업데이트합니다.
    if (selectedPet?.id === petId) {
      setSelectedPet(prev => ({ ...prev, ...updatedPet }));
    }
  }, [selectedPet]); // selectedPet이 변경될 때마다 함수 재생성

  /**
   * @function deletePet
   * @description 특정 반려동물을 목록에서 삭제합니다.
   * 최소 하나의 반려동물은 유지되도록 합니다.
   * @param {number} petId - 삭제할 반려동물의 ID.
   */
  const deletePet = useCallback((petId) => {
    if (pets.length <= 1) {
      alert('최소 하나의 반려동물 프로필은 유지되어야 합니다.');
      return;
    }
    setPets(prev => prev.filter(pet => pet.id !== petId)); // 해당 ID의 펫 제거
    // 삭제된 펫이 선택된 펫이었다면, 남은 펫 중 첫 번째를 선택하거나 null로 설정합니다.
    if (selectedPet?.id === petId) {
      const remainingPets = pets.filter(pet => pet.id !== petId);
      setSelectedPet(remainingPets[0] || null);
    }
  }, [pets, selectedPet]); // pets 또는 selectedPet이 변경될 때마다 함수 재생성

  /**
   * @function selectPet
   * @description 현재 선택된 반려동물을 설정합니다.
   * @param {object} pet - 선택할 반려동물 객체.
   */
  const selectPet = useCallback((pet) => {
    setSelectedPet(pet);
  }, []); // useCallback 의존성 배열 비어있음

  /**
   * @function handleImageUpload
   * @description 이미지 파일을 Data URL로 변환하여 프로필 이미지로 업데이트합니다.
   * (현재는 프론트엔드에서만 처리하며, 실제 환경에서는 서버에 업로드해야 합니다.)
   * @param {File} file - 업로드할 이미지 파일 객체.
   * @param {string} type - 'user' 또는 'pet' (어떤 프로필 이미지를 업데이트할지).
   * @param {number} [targetId=null] - 'pet' 타입일 경우, 업데이트할 반려동물의 ID.
   * @returns {Promise<string>} Data URL로 변환된 이미지 문자열.
   */
  const handleImageUpload = useCallback((file, type, targetId = null) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        if (type === 'user') {
          updateUserProfile({ profileImage: imageDataUrl });
        } else if (type === 'pet' && targetId) {
          updatePet(targetId, { profileImage: imageDataUrl });
        }
        resolve(imageDataUrl);
      };
      reader.readAsDataURL(file);
    });
  }, [updateUserProfile, updatePet]); // updateUserProfile, updatePet 함수가 변경될 때마다 함수 재생성

  // --- CONTEXT VALUE ---
  // Context Provider를 통해 제공될 값들을 useMemo로 최적화합니다.
  const value = useMemo(() => ({
    userProfile,
    pets,
    selectedPet,
    showUserProfile,
    showPetProfile,
    showAddPetForm,
    isAuthenticated, // AuthContext에서 가져온 인증 상태
    updateUserProfile,
    setShowUserProfile,
    addPet,
    updatePet,
    deletePet,
    selectPet,
    setShowPetProfile,
    setShowAddPetForm,
    handleImageUpload
  }), [
    userProfile, pets, selectedPet, showUserProfile, showPetProfile, showAddPetForm,
    isAuthenticated, updateUserProfile, addPet, updatePet, deletePet, selectPet, handleImageUpload
  ]);

  // ProfileContext.Provider를 통해 value를 하위 컴포넌트들에게 제공합니다.
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};