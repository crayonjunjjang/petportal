// src/components/profile/ProfileIcons.jsx
import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import styles from './ProfileIcons.module.css';

const ProfileIcons = () => {
  const { 
    userProfile, 
    pets, 
    selectedPet,
    isAuthenticated,
    selectPet,
    setShowUserProfile,
    setShowPetProfile,
    setShowAddPetForm
  } = useProfile();

  console.log('ProfileIcons: Auth state', { isAuthenticated, userProfile });

  // 로그인하지 않은 경우 렌더링하지 않음
  if (!isAuthenticated || !userProfile) {
    console.log('ProfileIcons: Not rendering because', { isAuthenticated, userProfile });
    return null;
  }

  const handleAddPetClick = () => {
    setShowAddPetForm(true);
  };

  const handlePetClick = (pet) => {
    selectPet(pet);
    setShowPetProfile(true);
  };

  const handleUserProfileClick = () => {
    setShowUserProfile(true);
  };

  return (
    <div className={styles.profileIcons}>
      {/* 플러스 버튼 - 반려동물 추가 */}
      <button 
        className={styles.addButton}
        onClick={handleAddPetClick}
        title="반려동물 추가"
      >
        <span className={styles.plusIcon}>+</span>
      </button>

      {/* 반려동물 프로필들 */}
      {pets.slice(0, 3).map((pet) => (
        <button
          key={pet.id}
          className={`${styles.petProfile} ${selectedPet?.id === pet.id ? styles.selected : ''}`}
          onClick={() => handlePetClick(pet)}
          title={`${pet.name}의 프로필`}
        >
          <img 
            src={pet.profileImage} 
            alt={`${pet.name} 프로필`}
            className={styles.profileImage}
            onError={(e) => {
              e.target.src = pet.type === 'cat' 
                ? '/src/assets/images/profiles/default-cat.svg'
                : '/src/assets/images/profiles/default-dog.svg';
            }}
          />
          {selectedPet?.id === pet.id && (
            <div className={styles.selectedIndicator} />
          )}
        </button>
      ))}

      {/* 반려동물이 3마리 이상인 경우 더보기 표시 */}
      {pets.length > 3 && (
        <button 
          className={styles.moreButton}
          onClick={() => setShowPetProfile(true)}
          title={`${pets.length - 3}마리 더`}
        >
          <span className={styles.moreText}>+{pets.length - 3}</span>
        </button>
      )}

      {/* 사용자 프로필 */}
      <button 
        className={styles.userProfile}
        onClick={handleUserProfileClick}
        title={`${userProfile.nickname}님의 프로필`}
      >
        <img 
          src={userProfile.profileImage} 
          alt="내 프로필"
          className={styles.profileImage}
          onError={(e) => {
            e.target.src = '/src/assets/images/profiles/default-user.svg';
          }}
        />
      </button>
    </div>
  );
};

export default ProfileIcons;