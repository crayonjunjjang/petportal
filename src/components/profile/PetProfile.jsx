// src/components/profile/PetProfile.jsx
import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { PET_TYPES, GENDERS, calculateAge } from '../../utils/petData';
import styles from './PetProfile.module.css';

const PetProfile = () => {
  const { 
    selectedPet, 
    updatePet, 
    deletePet,
    handleImageUpload,
    showPetProfile, 
    setShowPetProfile 
  } = useProfile();

  const [formData, setFormData] = useState({
    name: selectedPet?.name || '',
    type: selectedPet?.type || 'dog',
    breed: selectedPet?.breed || '',
    gender: selectedPet?.gender || 'male',
    birthDate: selectedPet?.birthDate || '',
    weight: selectedPet?.weight || ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  // 선택된 반려동물이 변경될 때 폼 데이터 업데이트
  React.useEffect(() => {
    if (selectedPet) {
      setFormData({
        name: selectedPet.name || '',
        type: selectedPet.type || 'dog',
        breed: selectedPet.breed || '',
        gender: selectedPet.gender || 'male',
        birthDate: selectedPet.birthDate || '',
        weight: selectedPet.weight || ''
      });
    }
  }, [selectedPet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // 몸무게는 숫자만 허용
    if (name === 'weight') {
      processedValue = value.replace(/[^0-9.]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // 타입이 변경되면 품종 초기화
    if (name === 'type') {
      const selectedType = PET_TYPES.find(t => t.value === value);
      setFormData(prev => ({
        ...prev,
        breed: selectedType?.breeds[0] || ''
      }));
    }
    
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
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.trim().length < 1) {
      newErrors.name = '이름은 1글자 이상이어야 합니다.';
    }
    
    if (!formData.breed.trim()) {
      newErrors.breed = '품종을 선택해주세요.';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요.';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthDate = '생년월일은 오늘 이전이어야 합니다.';
      }
    }
    
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = '올바른 몸무게를 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updatedData = {
      ...formData,
      weight: parseFloat(formData.weight)
    };
    
    updatePet(selectedPet.id, updatedData);
    setIsEditing(false);
    alert('반려동물 정보가 수정되었습니다.');
  };

  const handleCancel = () => {
    setFormData({
      name: selectedPet?.name || '',
      type: selectedPet?.type || 'dog',
      breed: selectedPet?.breed || '',
      gender: selectedPet?.gender || 'male',
      birthDate: selectedPet?.birthDate || '',
      weight: selectedPet?.weight || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      try {
        await handleImageUpload(file, 'pet', selectedPet.id);
        alert('프로필 사진이 변경되었습니다.');
      } catch (error) {
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 반려동물 프로필을 삭제하시겠습니까?')) {
      deletePet(selectedPet.id);
      setShowPetProfile(false);
      alert('반려동물 프로필이 삭제되었습니다.');
    }
  };

  if (!showPetProfile || !selectedPet) return null;

  const selectedType = PET_TYPES.find(type => type.value === formData.type);
  const age = calculateAge(selectedPet.birthDate);

  return (
    <div className={styles.modalOverlay} onClick={() => setShowPetProfile(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{selectedPet.name}의 프로필</h2>
          <button 
            className={styles.closeButton}
            onClick={() => setShowPetProfile(false)}
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.profileImageSection}>
            <div className={styles.imageContainer}>
              <img 
                src={selectedPet.profileImage} 
                alt={`${selectedPet.name} 프로필 사진`}
                className={styles.profileImage}
                onError={(e) => {
                  e.target.src = selectedPet.type === 'cat' 
                    ? '/src/assets/images/profiles/default-cat.svg'
                    : '/src/assets/images/profiles/default-dog.svg';
                }}
              />
              {isEditing && (
                <>
                  <label className={styles.imageUploadButton} htmlFor="petImageUpload">
                    📷
                  </label>
                  <input
                    id="petImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.hiddenInput}
                  />
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">이름</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                  placeholder="반려동물 이름"
                />
                {errors.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="type">종류</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={styles.select}
                >
                  {PET_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="breed">품종</label>
                <select
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${styles.select} ${errors.breed ? styles.error : ''}`}
                >
                  <option value="">품종 선택</option>
                  {selectedType?.breeds.map(breed => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
                {errors.breed && (
                  <span className={styles.errorMessage}>{errors.breed}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gender">성별</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={styles.select}
                >
                  {GENDERS.map(gender => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="birthDate">생년월일</label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${styles.input} ${errors.birthDate ? styles.error : ''}`}
                />
                {errors.birthDate && (
                  <span className={styles.errorMessage}>{errors.birthDate}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>나이</label>
                <input
                  type="text"
                  value={`${age}세`}
                  disabled
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="weight">몸무게 (kg)</label>
              <input
                id="weight"
                name="weight"
                type="text"
                value={formData.weight}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${errors.weight ? styles.error : ''}`}
                placeholder="몸무게 (예: 3.2)"
              />
              {errors.weight && (
                <span className={styles.errorMessage}>{errors.weight}</span>
              )}
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
                <>
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    className={styles.deleteButton}
                  >
                    삭제
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                  >
                    수정
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;