// src/components/admin/AccommodationManagement.jsx
// 이 파일은 관리자가 숙박 시설 정보를 관리(추가, 수정, 삭제)할 수 있는 컴포넌트입니다.
// 숙박 시설 목록을 표시하고, 새로운 숙박 시설을 추가하거나 기존 숙박 시설의 정보를 수정 및 삭제하는 기능을 제공합니다.

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminStyles from './Admin.module.css';
import { mockDataService } from '../../utils/mockDataService';

// Initial mock data for accommodations
const initialAccommodationData = [
  {
    id: 1,
    name: '아늑한 숲속 펜션',
    type: '펜션',
    location: '경기 가평군',
    price: 150000,
    rating: 4.7,
    images: ['https://picsum.photos/id/237/200/300', 'https://picsum.photos/id/238/200/300'],
    tags: ['#독채', '#바베큐', '#수영장'],
    maxGuests: 4,
    petsAllowed: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    description: '숲속에서 편안한 휴식을 즐길 수 있는 아늑한 펜션입니다.',
  },
  {
    id: 2,
    name: '도심 속 힐링 호텔',
    type: '호텔',
    location: '서울 강남구',
    price: 200000,
    rating: 4.9,
    images: ['https://picsum.photos/id/239/200/300', 'https://picsum.photos/id/240/200/300'],
    tags: ['#조식포함', '#루프탑', '#비즈니스'],
    maxGuests: 2,
    petsAllowed: false,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    description: '강남역 근처에 위치한 고급 호텔로, 비즈니스 및 관광객에게 적합합니다.',
  },
  {
    id: 3,
    name: '바닷가 감성 숙소',
    type: '감성숙소',
    location: '강원 강릉시',
    price: 180000,
    rating: 4.8,
    images: ['https://picsum.photos/id/241/200/300', 'https://picsum.photos/id/242/200/300'],
    tags: ['#오션뷰', '#커플', '#인생샷'],
    maxGuests: 2,
    petsAllowed: true,
    checkInTime: '16:00',
    checkOutTime: '10:00',
    description: '아름다운 강릉 바다를 한눈에 볼 수 있는 감성적인 숙소입니다.',
  },
];

const AccommodationManagement = () => { // 숙박 시설 관리 컴포넌트 정의
  const { isAdminAuthenticated } = useAdminAuth(); // 관리자 인증 상태를 가져옵니다.
  const [accommodations, setAccommodations] = useState([]); // 숙박 시설 목록을 저장하는 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [editingAccommodation, setEditingAccommodation] = useState(null); // 현재 수정 중인 숙박 시설 정보
  const [newAccommodation, setNewAccommodation] = useState({ // 새로 추가할 숙박 시설 정보
    name: '',
    type: '펜션',
    location: '',
    price: '',
    rating: 4.5,
    images: [''],
    tags: [''],
    maxGuests: 2,
    petsAllowed: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    description: '',
  });

  useEffect(() => { // 컴포넌트 마운트 시 초기 데이터를 설정하고 숙박 시설 목록을 불러옵니다.
    mockDataService.initialize('accommodations', initialAccommodationData);
    if (isAdminAuthenticated) { // 관리자 인증 상태일 때만 데이터를 가져옵니다.
      fetchAccommodations();
    }
  }, [isAdminAuthenticated]); // isAdminAuthenticated가 변경될 때마다 실행됩니다.

  const fetchAccommodations = async () => { // 숙박 시설 목록을 비동기적으로 가져오는 함수
    setLoading(true); // 로딩 상태 시작
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.getAll('accommodations'); // mockDataService를 통해 숙박 시설 데이터 요청
      if (response.success) {
        setAccommodations(response.data); // 성공 시 숙박 시설 상태 업데이트
      } else {
        setError(response.message || '숙박 시설 정보를 불러오는데 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to fetch accommodations:', err);
      setError('숙박 시설 정보를 불러오는데 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleInputChange = (e) => { // 입력 필드 값 변경을 처리하는 함수
    const { name, value, type, checked } = e.target;
    const actualValue = type === 'checkbox' ? checked : 
                       type === 'number' ? parseFloat(value) || 0 : value;
    
    if (editingAccommodation) { // 수정 중인 숙박 시설이 있을 경우 해당 상태 업데이트
      setEditingAccommodation({ ...editingAccommodation, [name]: actualValue });
    } else { // 새로운 숙박 시설을 추가 중일 경우 해당 상태 업데이트
      setNewAccommodation({ ...newAccommodation, [name]: actualValue });
    }
  };

  const handleArrayInputChange = (e, index, arrayName) => { // 배열 형태의 입력 필드 값 변경을 처리하는 함수 (예: 이미지 URL, 태그)
    const { value } = e.target;
    const currentData = editingAccommodation || newAccommodation;
    const newArray = [...currentData[arrayName]];
    newArray[index] = value;
    
    if (editingAccommodation) { // 수정 중인 숙박 시설의 배열 상태 업데이트
      setEditingAccommodation({ ...editingAccommodation, [arrayName]: newArray });
    } else { // 새로운 숙박 시설의 배열 상태 업데이트
      setNewAccommodation({ ...newAccommodation, [arrayName]: newArray });
    }
  };

  const addArrayItem = (arrayName) => { // 배열에 새 항목을 추가하는 함수
    const currentData = editingAccommodation || newAccommodation;
    const newArray = [...currentData[arrayName], '']; // 빈 문자열을 추가
    
    if (editingAccommodation) { // 수정 중인 숙박 시설의 배열에 항목 추가
      setEditingAccommodation({ ...editingAccommodation, [arrayName]: newArray });
    } else { // 새로운 숙박 시설의 배열에 항목 추가
      setNewAccommodation({ ...newAccommodation, [arrayName]: newArray });
    }
  };

  const removeArrayItem = (index, arrayName) => { // 배열에서 특정 항목을 제거하는 함수
    const currentData = editingAccommodation || newAccommodation;
    const newArray = currentData[arrayName].filter((_, i) => i !== index);
    
    if (editingAccommodation) { // 수정 중인 숙박 시설의 배열에서 항목 제거
      setEditingAccommodation({ ...editingAccommodation, [arrayName]: newArray });
    } else { // 새로운 숙박 시설의 배열에서 항목 제거
      setNewAccommodation({ ...newAccommodation, [arrayName]: newArray });
    }
  };

  const handleAddAccommodation = async (e) => { // 새 숙박 시설 추가를 처리하는 함수
    e.preventDefault(); // 폼 제출의 기본 동작 방지
    setError(null); // 에러 상태 초기화
    try {
      const accommodationToSend = { 
        ...newAccommodation,
        price: parseFloat(newAccommodation.price) || 0,
        rating: parseFloat(newAccommodation.rating) || 4.5,
        maxGuests: parseInt(newAccommodation.maxGuests) || 2,
        images: newAccommodation.images.filter(img => img.trim() !== ''), // 빈 이미지 URL 제거
        tags: newAccommodation.tags.filter(tag => tag.trim() !== '') // 빈 태그 제거
      };

      const response = await mockDataService.create('accommodations', accommodationToSend); // mockDataService를 통해 숙박 시설 추가 요청
      
      if (response.success) {
        setNewAccommodation({ // 새 숙박 시설 폼 초기화
          name: '',
          type: '펜션',
          location: '',
          price: '',
          rating: 4.5,
          images: [''],
          tags: [''],
          maxGuests: 2,
          petsAllowed: true,
          checkInTime: '15:00',
          checkOutTime: '11:00',
          description: '',
        });
        fetchAccommodations(); // 숙박 시설 목록 새로고침
      } else {
        setError(response.message || '숙박 시설 추가에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to add accommodation:', err);
      setError('숙박 시설 추가에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  const handleEditAccommodation = async (e) => { // 숙박 시설 수정을 처리하는 함수
    e.preventDefault(); // 폼 제출의 기본 동작 방지
    setError(null); // 에러 상태 초기화
    if (!editingAccommodation) return; // 수정 중인 숙박 시설이 없으면 함수 종료
    try {
      const accommodationToSend = { 
        ...editingAccommodation,
        price: parseFloat(editingAccommodation.price) || 0,
        rating: parseFloat(editingAccommodation.rating) || 4.5,
        maxGuests: parseInt(editingAccommodation.maxGuests) || 2,
        images: editingAccommodation.images.filter(img => img.trim() !== ''), // 빈 이미지 URL 제거
        tags: editingAccommodation.tags.filter(tag => tag.trim() !== '') // 빈 태그 제거
      };

      const response = await mockDataService.update('accommodations', editingAccommodation.id, accommodationToSend); // mockDataService를 통해 숙박 시설 업데이트 요청
      if (response.success) {
        setEditingAccommodation(null); // 수정 상태 종료
        fetchAccommodations(); // 숙박 시설 목록 새로고침
      } else {
        setError(response.message || '숙박 시설 수정에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to edit accommodation:', err);
      setError('숙박 시설 수정에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  const handleDeleteAccommodation = async (accommodationId) => { // 숙박 시설 삭제를 처리하는 함수
    if (!window.confirm('정말로 이 숙박 시설을 삭제하시겠습니까?')) return; // 삭제 확인
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.remove('accommodations', accommodationId); // mockDataService를 통해 숙박 시설 삭제 요청
      if (response.success) {
        fetchAccommodations(); // 숙박 시설 목록 새로고침
      } else {
        setError(response.message || '숙박 시설 삭제에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to delete accommodation:', err);
      setError('숙박 시설 삭제에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  if (loading) { // 로딩 중일 때 표시할 UI
    return <div className={adminStyles.userManagementContainer}>숙박 시설 정보를 불러오는 중...</div>;
  }

  if (error) { // 에러 발생 시 표시할 UI
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return ( // 숙박 시설 관리 페이지의 메인 UI
    <div className={adminStyles.userManagementContainer}>
      <h3>숙박 시설 관리</h3>

      {/* 새 숙박 시설 추가 폼 */}
      <h4>새 숙박 시설 추가</h4>
      <form onSubmit={handleAddAccommodation} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="시설명" value={newAccommodation.name} onChange={handleInputChange} required />
        
        <select name="type" value={newAccommodation.type} onChange={handleInputChange} required>
          <option value="펜션">펜션</option>
          <option value="호텔">호텔</option>
          <option value="리조트">리조트</option>
          <option value="감성숙소">감성숙소</option>
          <option value="모텔">모텔</option>
        </select>
        
        <input type="text" name="location" placeholder="위치 (예: 경기 가평군)" value={newAccommodation.location} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="가격 (원)" value={newAccommodation.price} onChange={handleInputChange} required />
        <input type="number" name="rating" placeholder="평점 (1-5)" min="1" max="5" step="0.1" value={newAccommodation.rating} onChange={handleInputChange} />
        <input type="number" name="maxGuests" placeholder="최대 인원" min="1" value={newAccommodation.maxGuests} onChange={handleInputChange} />
        
        <label>
          <input type="checkbox" name="petsAllowed" checked={newAccommodation.petsAllowed} onChange={handleInputChange} />
          반려동물 동반
        </label>
        
        <input type="time" name="checkInTime" placeholder="체크인 시간" value={newAccommodation.checkInTime} onChange={handleInputChange} />
        <input type="time" name="checkOutTime" placeholder="체크아웃 시간" value={newAccommodation.checkOutTime} onChange={handleInputChange} />
        
        <div style={{ gridColumn: 'span 2' }}>
          <h5>이미지 URL</h5>
          {newAccommodation.images.map((image, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
              <input 
                type="url" 
                placeholder="이미지 URL" 
                value={image} 
                onChange={(e) => handleArrayInputChange(e, index, 'images')}
                style={{ flex: 1, marginRight: '5px' }}
              />
              <button type="button" onClick={() => removeArrayItem(index, 'images')}>삭제</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('images')}>이미지 추가</button>
        </div>
        
        <div style={{ gridColumn: 'span 2' }}>
          <h5>태그</h5>
          {newAccommodation.tags.map((tag, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
              <input 
                type="text" 
                placeholder="태그 (예: #대형견가능)" 
                value={tag} 
                onChange={(e) => handleArrayInputChange(e, index, 'tags')}
                style={{ flex: 1, marginRight: '5px' }}
              />
              <button type="button" onClick={() => removeArrayItem(index, 'tags')}>삭제</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('tags')}>태그 추가</button>
        </div>
        
        <textarea name="description" placeholder="설명" value={newAccommodation.description} onChange={handleInputChange} rows="3" style={{ gridColumn: 'span 2' }}></textarea>
        <button type="submit" className={adminStyles.userFormButton} style={{ gridColumn: 'span 2' }}>추가</button>
      </form>

      {/* 기존 숙박 시설 목록 */}
      <h4>기존 숙박 시설</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>시설명</th>
            <th>유형</th>
            <th>위치</th>
            <th>가격</th>
            <th>평점</th>
            <th>최대인원</th>
            <th>반려동물</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {accommodations.map((accommodation) => {
            // JSON 문자열 파싱 (mockDataService는 이미 객체로 저장하므로 필요 없음)
            // let parsedImages = [];
            // let parsedTags = [];
            // try {
            //   if (accommodation.images && typeof accommodation.images === 'string') {
            //     parsedImages = JSON.parse(accommodation.images);
            //   } else if (Array.isArray(accommodation.images)) {
            //     parsedImages = accommodation.images;
            //   }
            //   if (accommodation.tags && typeof accommodation.tags === 'string') {
            //     parsedTags = JSON.parse(accommodation.tags);
            //   } else if (Array.isArray(accommodation.tags)) {
            //     parsedTags = accommodation.tags;
            //   }
            // } catch (e) {
            //   console.error('Error parsing JSON:', e);
            // }

            return (
              <tr key={accommodation.id}>
                <td>{accommodation.id}</td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="text" name="name" value={editingAccommodation.name || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    accommodation.name
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <select name="type" value={editingAccommodation.type || ''} onChange={handleInputChange} className={adminStyles.userEditInput}>
                      <option value="펜션">펜션</option>
                      <option value="호텔">호텔</option>
                      <option value="리조트">리조트</option>
                      <option value="감성숙소">감성숙소</option>
                      <option value="모텔">모텔</option>
                    </select>
                  ) : (
                    accommodation.type
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="text" name="location" value={editingAccommodation.location || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    accommodation.location
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="number" name="price" value={editingAccommodation.price || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    `₩${accommodation.price?.toLocaleString() || 0}`
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="number" name="rating" min="1" max="5" step="0.1" value={editingAccommodation.rating || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    `★${accommodation.rating || 0}`
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="number" name="maxGuests" min="1" value={editingAccommodation.maxGuests || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    `${accommodation.maxGuests || 0}명`
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="checkbox" name="petsAllowed" checked={editingAccommodation.petsAllowed || false} onChange={handleInputChange} />
                  ) : (
                    accommodation.petsAllowed ? 'O' : 'X'
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <>
                      <button onClick={handleEditAccommodation} className={adminStyles.userActionButton}>저장</button>
                      <button onClick={() => setEditingAccommodation(null)} className={adminStyles.userActionButton}>취소</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => {
                        const editData = { 
                          ...accommodation,
                          images: accommodation.images,
                          tags: accommodation.tags
                        };
                        setEditingAccommodation(editData);
                      }} className={adminStyles.userActionButton}>수정</button>
                      <button onClick={() => handleDeleteAccommodation(accommodation.id)} className={adminStyles.userActionButton}>삭제</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccommodationManagement;