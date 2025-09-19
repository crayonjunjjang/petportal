// src/components/profile/AddPetForm.jsx
import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { PET_TYPES, GENDERS } from '../../utils/petData';
import styles from './AddPetForm.module.css';
import defaultCat from '../../assets/images/profiles/default-cat.svg';
import defaultDog from '../../assets/images/profiles/default-dog.svg';

const AddPetForm = () => {
  const { 
    addPet,
    handleImageUpload,
    showAddPetForm, 
    setShowAddPetForm 
  } = useProfile();

  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    gender: 'male',
    birthDate: '',
    weight: '',
    profileImage: ''
  });
  
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const petData = {
      ...formData,
      weight: parseFloat(formData.weight),
      profileImage: previewImage || getDefaultImage(formData.type)
    };
    
    const newPet = addPet(petData);
    
    // 폼 초기화
    setFormData({
      name: '',
      type: 'dog',
      breed: '',
      gender: 'male',
      birthDate: '',
      weight: '',
      profileImage: ''
    });
    setPreviewImage('');
    setErrors({});
    setShowAddPetForm(false);
    
    alert(`${newPet.name}이(가) 등록되었습니다!`);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      type: 'dog',
      breed: '',
      gender: 'male',
      birthDate: '',
      weight: '',
      profileImage: ''
    });
    setPreviewImage('');
    setErrors({});
    setShowAddPetForm(false);
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
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  const getDefaultImage = (type) => {
    switch (type) {
      case 'cat':
        return defaultCat;
      case 'dog':
        return defaultDog;
      default:
        return defaultDog;
    }
  };

  if (!showAddPetForm) return null;

  const selectedType = PET_TYPES.find(type => type.value === formData.type);
  const displayImage = previewImage || getDefaultImage(formData.type);

  return (
    <div className={styles.modalOverlay} onClick={() => setShowAddPetForm(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>새 반려동물 등록</h2>
          <button 
            className={styles.closeButton}
            onClick={() => setShowAddPetForm(false)}
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.profileImageSection}>
            <div className={styles.imageContainer}>
              <img 
                src={displayImage} 
                alt="반려동물 프로필 미리보기"
                className={styles.profileImage}
              />
              <label className={styles.imageUploadButton} htmlFor="addPetImageUpload">
                📷
              </label>
              <input
                id="addPetImageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.hiddenInput}
              />
            </div>
            <p className={styles.imageHint}>프로필 사진을 선택해주세요 (선택사항)</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">이름 *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                  placeholder="반려동물 이름을 입력해주세요"
                />
                {errors.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="type">종류 *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
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
                <label htmlFor="breed">품종 *</label>
                <select
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className={`${styles.select} ${errors.breed ? styles.error : ''}`}
                >
                  <option value="">품종을 선택해주세요</option>
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
                <label htmlFor="gender">성별 *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
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
                <label htmlFor="birthDate">생년월일 *</label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.birthDate ? styles.error : ''}`}
                />
                {errors.birthDate && (
                  <span className={styles.errorMessage}>{errors.birthDate}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="weight">몸무게 (kg) *</label>
                <input
                  id="weight"
                  name="weight"
                  type="text"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.weight ? styles.error : ''}`}
                  placeholder="예: 3.2"
                />
                {errors.weight && (
                  <span className={styles.errorMessage}>{errors.weight}</span>
                )}
              </div>
            </div>

            <div className={styles.requiredNote}>
              * 필수 입력 항목
            </div>

            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                취소
              </button>
              <button 
                type="submit"
                className={styles.submitButton}
              >
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPetForm;