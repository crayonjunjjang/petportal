// src/components/admin/HospitalManagement.jsx
// 이 파일은 관리자가 동물병원 정보를 관리(추가, 수정, 삭제)할 수 있는 컴포넌트입니다.
// 동물병원 목록을 표시하고, 새로운 동물병원을 추가하거나 기존 동물병원의 정보를 수정 및 삭제하는 기능을 제공합니다.

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminStyles from './Admin.module.css';
import { mockDataService } from '../../utils/mockDataService';

const initialHospitalData = [
  {
    id: 1,
    name: '서울 동물병원',
    address: '서울시 강남구 역삼동 123-45',
    phone: '02-1111-2222',
    description: '24시간 응급 진료가 가능한 서울 대표 동물병원',
    specialties: '내과, 외과, 피부과',
  },
  {
    id: 2,
    name: '경기 반려동물 의료센터',
    address: '경기도 수원시 팔달구 중부대로 678',
    phone: '031-3333-4444',
    description: '최첨단 장비를 갖춘 종합 동물 의료 센터',
    specialties: '정형외과, 안과, 치과',
  },
  {
    id: 3,
    name: '부산 해운대 동물병원',
    address: '부산시 해운대구 마린시티 1로 50',
    phone: '051-5555-6666',
    description: '해운대 지역 주민들을 위한 친절한 동물병원',
    specialties: '예방접종, 건강검진',
  },
];

const HospitalManagement = () => { // 동물병원 관리 컴포넌트 정의
  const { isAdminAuthenticated } = useAdminAuth(); // 관리자 인증 상태를 가져옵니다.
  const [hospitals, setHospitals] = useState([]); // 동물병원 목록을 저장하는 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [editingHospital, setEditingHospital] = useState(null); // 현재 수정 중인 동물병원 정보
  const [newHospital, setNewHospital] = useState({ // 새로 추가할 동물병원 정보
    name: '',
    address: '',
    phone: '',
    description: '',
    specialties: '',
  });

  useEffect(() => { // 컴포넌트 마운트 시 초기 데이터를 설정하고 동물병원 목록을 불러옵니다.
    mockDataService.initialize('hospitals', initialHospitalData);
    if (isAdminAuthenticated) { // 관리자 인증 상태일 때만 데이터를 가져옵니다.
      fetchHospitals();
    }
  }, [isAdminAuthenticated]); // isAdminAuthenticated가 변경될 때마다 실행됩니다.

  const fetchHospitals = async () => { // 동물병원 목록을 비동기적으로 가져오는 함수
    setLoading(true); // 로딩 상태 시작
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.getAll('hospitals'); // mockDataService를 통해 동물병원 데이터 요청
      if (response.success) {
        setHospitals(response.data); // 성공 시 동물병원 상태 업데이트
      } else {
        setError(response.message || '병원 정보를 불러오는데 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
      setError('병원 정보를 불러오는데 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleInputChange = (e) => { // 입력 필드 값 변경을 처리하는 함수
    const { name, value } = e.target;
    if (editingHospital) { // 수정 중인 병원이 있을 경우 해당 상태 업데이트
      setEditingHospital({ ...editingHospital, [name]: value });
    } else { // 새로운 병원을 추가 중일 경우 해당 상태 업데이트
      setNewHospital({ ...newHospital, [name]: value });
    }
  };

  const handleAddHospital = async (e) => { // 새 동물병원 추가를 처리하는 함수
    e.preventDefault(); // 폼 제출의 기본 동작 방지
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.create('hospitals', newHospital); // mockDataService를 통해 동물병원 추가 요청
      if (response.success) {
        setNewHospital({ // 새 동물병원 폼 초기화
          name: '',
          address: '',
          phone: '',
          description: '',
          specialties: '',
        });
        fetchHospitals(); // 동물병원 목록 새로고침
      } else {
        setError(response.message || '병원 추가에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to add hospital:', err);
      setError('병원 추가에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  const handleEditHospital = async (e) => { // 동물병원 수정을 처리하는 함수
    e.preventDefault(); // 폼 제출의 기본 동작 방지
    setError(null); // 에러 상태 초기화
    if (!editingHospital) return; // 수정 중인 병원이 없으면 함수 종료
    try {
      const response = await mockDataService.update('hospitals', editingHospital.id, editingHospital); // mockDataService를 통해 동물병원 업데이트 요청
      if (response.success) {
        setEditingHospital(null); // 수정 상태 종료
        fetchHospitals(); // 동물병원 목록 새로고침
      } else {
        setError(response.message || '병원 수정에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to edit hospital:', err);
      setError('병원 수정에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  const handleDeleteHospital = async (hospitalId) => { // 동물병원 삭제를 처리하는 함수
    if (!window.confirm('정말로 이 병원을 삭제하시겠습니까?')) return; // 삭제 확인
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.remove('hospitals', hospitalId); // mockDataService를 통해 동물병원 삭제 요청
      if (response.success) {
        fetchHospitals(); // 동물병원 목록 새로고침
      } else {
        setError(response.message || '병원 삭제에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to delete hospital:', err);
      setError('병원 삭제에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  if (loading) { // 로딩 중일 때 표시할 UI
    return <div className={adminStyles.userManagementContainer}>병원 정보를 불러오는 중...</div>;
  }

  if (error) { // 에러 발생 시 표시할 UI
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return ( // 동물병원 관리 페이지의 메인 UI
    <div className={adminStyles.userManagementContainer}>
      <h3>병원 관리</h3>

      {/* 새 병원 추가 폼 */}
      <h4>새 병원 추가</h4>
      <form onSubmit={handleAddHospital} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="병원명" value={newHospital.name} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="주소" value={newHospital.address} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="전화번호" value={newHospital.phone} onChange={handleInputChange} required />
        <input type="text" name="specialties" placeholder="전문 분야" value={newHospital.specialties} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newHospital.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      {/* 기존 병원 목록 */}
      <h4>기존 병원</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>병원명</th>
            <th>주소</th>
            <th>전화번호</th>
            <th>전문 분야</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hospital) => (
            <tr key={hospital.id}>
              <td>{hospital.id}</td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <input type="text" name="name" value={editingHospital.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hospital.name
                )}
              </td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <input type="text" name="address" value={editingHospital.address} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hospital.address
                )}
              </td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <input type="text" name="phone" value={editingHospital.phone} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hospital.phone
                )}
              </td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <input type="text" name="specialties" value={editingHospital.specialties} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hospital.specialties
                )}
              </td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <>
                    <button onClick={handleEditHospital} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingHospital(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingHospital({ ...hospital })}>수정</button>
                    <button onClick={() => handleDeleteHospital(hospital.id)}>삭제</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HospitalManagement;