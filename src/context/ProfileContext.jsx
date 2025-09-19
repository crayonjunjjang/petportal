// src/context/ProfileContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PET } from '../utils/petData';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// Mock user for client-only version
const mockUser = {
  id: 'mock_user_01',
  name: '반려인',
  email: 'user@example.com',
  profileImage: 'https://images.unsplash.com/photo-1598133894022-348207a727a3?w=400',
};

export const ProfileProvider = ({ children }) => {
  const isAuthenticated = true; // Always authenticated in client-only mode
  const user = mockUser;

  const [userProfile, setUserProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showPetProfile, setShowPetProfile] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);

  useEffect(() => {
    if (user) {
      setUserProfile(user);
      loadUserPets(user.id);
    } else {
      setUserProfile(null);
      setPets([]);
      setSelectedPet(null);
    }
  }, [user]);

  const loadUserPets = (userId) => {
    try {
      const allProfileData = JSON.parse(localStorage.getItem('allProfileData') || '{}');
      const userData = allProfileData[userId];
      
      if (userData && userData.pets) {
        setPets(userData.pets);
        setSelectedPet(userData.selectedPet || userData.pets[0] || null);
      } else {
        const defaultPet = { ...DEFAULT_PET, id: Date.now() };
        setPets([defaultPet]);
        setSelectedPet(defaultPet);
        saveUserData(userId, [defaultPet], defaultPet);
      }
    } catch (error) {
      console.error('Failed to load user pets:', error);
      const defaultPet = { ...DEFAULT_PET, id: Date.now() };
      setPets([defaultPet]);
      setSelectedPet(defaultPet);
    }
  };

  const saveUserData = (userId, petsData, selectedPetData) => {
    try {
      const allProfileData = JSON.parse(localStorage.getItem('allProfileData') || '{}');
      allProfileData[userId] = {
        pets: petsData,
        selectedPet: selectedPetData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('allProfileData', JSON.stringify(allProfileData));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  useEffect(() => {
    if (user && pets.length > 0) {
      saveUserData(user.id, pets, selectedPet);
    }
  }, [pets, selectedPet, user]);

  const updateUserProfile = (newProfile) => {
    const updatedProfile = { ...userProfile, ...newProfile };
    setUserProfile(updatedProfile);
  };

  const addPet = (newPet) => {
    const petWithId = { ...newPet, id: Date.now() };
    setPets(prev => [...prev, petWithId]);
    return petWithId;
  };

  const updatePet = (petId, updatedPet) => {
    setPets(prev => 
      prev.map(pet => 
        pet.id === petId ? { ...pet, ...updatedPet } : pet
      )
    );
    if (selectedPet?.id === petId) {
      setSelectedPet(prev => ({ ...prev, ...updatedPet }));
    }
  };

  const deletePet = (petId) => {
    if (pets.length <= 1) {
      alert('최소 하나의 반려동물 프로필은 유지되어야 합니다.');
      return;
    }
    setPets(prev => prev.filter(pet => pet.id !== petId));
    if (selectedPet?.id === petId) {
      const remainingPets = pets.filter(pet => pet.id !== petId);
      setSelectedPet(remainingPets[0] || null);
    }
  };

  const selectPet = (pet) => {
    setSelectedPet(pet);
  };

  const handleImageUpload = (file, type, targetId = null) => {
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
  };

  const value = {
    userProfile,
    pets,
    selectedPet,
    showUserProfile,
    showPetProfile,
    showAddPetForm,
    isAuthenticated,
    updateUserProfile,
    setShowUserProfile,
    addPet,
    updatePet,
    deletePet,
    selectPet,
    setShowPetProfile,
    setShowAddPetForm,
    handleImageUpload
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
