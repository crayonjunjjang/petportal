// src/components/profile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    handleImageUpload,
    showUserProfile, 
    setShowUserProfile 
  } = useProfile();

  const [formData, setFormData] = useState({
    nickname: userProfile?.nickname || '',
    email: userProfile?.email || ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  // userProfile이 변경될 때마다 formData 업데이트
  useEffect(() => {
    if (userProfile) {
      setFormData({
        nickname: userProfile.nickname || '',
        email: userProfile.email || ''
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.trim().length < 2) {
      newErrors.nickname = '닉네임은 2글자 이상이어야 합니다.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    updateUserProfile(formData);
    setIsEditing(false);
    alert('프로필이 수정되었습니다.');
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        nickname: userProfile.nickname,
        email: userProfile.email
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      try {
        await handleImageUpload(file, 'user');
        alert('프로필 사진이 변경되었습니다.');
      } catch (error) {
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  if (!showUserProfile || !userProfile) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => setShowUserProfile(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>내 프로필</h2>
          <button 
            className={styles.closeButton}
            onClick={() => setShowUserProfile(false)}
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.profileImageSection}>
            <div className={styles.imageContainer}>
              <img 
                src={userProfile.profileImage} 
                alt="프로필 사진"
                className={styles.profileImage}
                onError={(e) => {
                  e.target.src = '/src/assets/images/profiles/default-user.svg';
                }}
              />
              <label className={styles.imageUploadButton} htmlFor="userImageUpload">
                📷
              </label>
              <input
                id="userImageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.hiddenInput}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label htmlFor="nickname">닉네임</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${errors.nickname ? styles.error : ''}`}
                placeholder="닉네임을 입력해주세요"
              />
              {errors.nickname && (
                <span className={styles.errorMessage}>{errors.nickname}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                placeholder="이메일을 입력해주세요"
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>가입일</label>
              <input
                type="text"
                value={userProfile.joinDate}
                disabled
                className={styles.input}
              />
            </div>

            <div className={styles.buttonGroup}>
              {isEditing ? (
                <>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className={styles.cancelButton}
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className={styles.saveButton}
                  >
                    저장
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  className={styles.editButton}
                >
                  수정
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;