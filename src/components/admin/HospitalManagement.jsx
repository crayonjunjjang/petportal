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

const HospitalManagement = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHospital, setEditingHospital] = useState(null);
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    specialties: '',
  });

  useEffect(() => {
    mockDataService.initialize('hospitals', initialHospitalData);
    if (isAdminAuthenticated) {
      fetchHospitals();
    }
  }, [isAdminAuthenticated]);

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockDataService.getAll('hospitals');
      if (response.success) {
        setHospitals(response.data);
      } else {
        setError(response.message || '병원 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
      setError('병원 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingHospital) {
      setEditingHospital({ ...editingHospital, [name]: value });
    } else {
      setNewHospital({ ...newHospital, [name]: value });
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await mockDataService.create('hospitals', newHospital);
      if (response.success) {
        setNewHospital({
          name: '',
          address: '',
          phone: '',
          description: '',
          specialties: '',
        });
        fetchHospitals();
      } else {
        setError(response.message || '병원 추가에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to add hospital:', err);
      setError('병원 추가에 실패했습니다.');
    }
  };

  const handleEditHospital = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingHospital) return;
    try {
      const response = await mockDataService.update('hospitals', editingHospital.id, editingHospital);
      if (response.success) {
        setEditingHospital(null);
        fetchHospitals();
      } else {
        setError(response.message || '병원 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to edit hospital:', err);
      setError('병원 수정에 실패했습니다.');
    }
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (!window.confirm('정말로 이 병원을 삭제하시겠습니까?')) return;
    setError(null);
    try {
      const response = await mockDataService.remove('hospitals', hospitalId);
      if (response.success) {
        fetchHospitals();
      } else {
        setError(response.message || '병원 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to delete hospital:', err);
      setError('병원 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>병원 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>병원 관리</h3>

      <h4>새 병원 추가</h4>
      <form onSubmit={handleAddHospital} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="병원명" value={newHospital.name} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="주소" value={newHospital.address} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="전화번호" value={newHospital.phone} onChange={handleInputChange} required />
        <input type="text" name="specialties" placeholder="전문 분야" value={newHospital.specialties} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newHospital.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

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