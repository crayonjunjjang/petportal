// src/components/admin/GroomingManagement.jsx
// 이 파일은 관리자가 미용 서비스 정보를 관리(추가, 수정, 삭제)할 수 있는 컴포넌트입니다.
// 미용 서비스 목록을 표시하고, 새로운 미용 서비스를 추가하거나 기존 미용 서비스의 정보를 수정 및 삭제하는 기능을 제공합니다.

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminStyles from './Admin.module.css';
import { mockDataService } from '../../utils/mockDataService';

const initialGroomingData = [
  {
    id: 1,
    name: '기본 미용 (소형견)',
    price: 30000,
    description: '목욕, 털 정리, 발톱 관리, 귀 청소',
    duration: 60,
  },
  {
    id: 2,
    name: '부분 미용 (중형견)',
    price: 45000,
    description: '부분 털 정리, 발톱 관리, 귀 청소',
    duration: 90,
  },
  {
    id: 3,
    name: '전체 미용 (대형견)',
    price: 70000,
    description: '전체 털 정리, 목욕, 발톱 관리, 귀 청소, 아로마 스파',
    duration: 120,
  },
  {
    id: 4,
    name: '스파 패키지 (소형견)',
    price: 50000,
    description: '아로마 스파, 목욕, 털 정리',
    duration: 75,
  },
  {
    id: 5,
    name: '탄산 스파 (모든 견종)',
    price: 25000,
    description: '피부 진정 및 혈액순환 개선에 도움을 주는 탄산 스파',
    duration: 30,
  },
  {
    id: 6,
    name: '치아 스케일링 (무마취)',
    price: 80000,
    description: '전문가에 의한 무마취 치아 스케일링',
    duration: 45,
  },
  {
    id: 7,
    name: '부분 염색 (귀/꼬리)',
    price: 35000,
    description: '안전한 염색약으로 귀 또는 꼬리 부분 염색',
    duration: 60,
  },
  {
    id: 8,
    name: '발바닥 털 정리',
    price: 15000,
    description: '미끄럼 방지 및 위생을 위한 발바닥 털 정리',
    duration: 20,
  },
  {
    id: 9,
    name: '위생 미용 (항문/배/발)',
    price: 20000,
    description: '항문, 배, 발 주변 위생 털 정리',
    duration: 30,
  },
  {
    id: 10,
    name: '엉킨 털 제거',
    price: 10000,
    description: '심하게 엉킨 털 제거 (추가 요금 발생 가능)',
    duration: 30,
  },
  {
    id: 11,
    name: '고양이 기본 미용',
    price: 60000,
    description: '고양이 목욕, 털 정리, 발톱 관리',
    duration: 90,
  },
  {
    id: 12,
    name: '고양이 무마취 미용',
    price: 100000,
    description: '스트레스 최소화를 위한 고양이 무마취 미용',
    duration: 120,
  },
  {
    id: 13,
    name: '특수견 미용 (푸들)',
    price: 55000,
    description: '푸들 견종 특성에 맞는 전문 미용',
    duration: 90,
  },
  {
    id: 14,
    name: '특수견 미용 (비숑)',
    price: 60000,
    description: '비숑 견종 특성에 맞는 전문 미용',
    duration: 100,
  },
  {
    id: 15,
    name: '가위컷 전문 (소형견)',
    price: 70000,
    description: '섬세한 가위컷으로 스타일 완성',
    duration: 120,
  },
  {
    id: 16,
    name: '가위컷 전문 (중형견)',
    price: 90000,
    description: '섬세한 가위컷으로 스타일 완성',
    duration: 150,
  },
  {
    id: 17,
    name: '부분 목욕 (발/엉덩이)',
    price: 20000,
    description: '간단한 부분 목욕 서비스',
    duration: 30,
  },
  {
    id: 18,
    name: '향기 스파',
    price: 30000,
    description: '은은한 향으로 심신 안정에 도움을 주는 스파',
    duration: 40,
  },
  {
    id: 19,
    name: '모발 영양팩',
    price: 25000,
    description: '건조하고 손상된 모발에 영양 공급',
    duration: 30,
  },
  {
    id: 20,
    name: '발톱 깎기 및 갈기',
    price: 10000,
    description: '안전하고 깔끔한 발톱 관리',
    duration: 15,
  },
];

const GroomingManagement = () => { // 미용 서비스 관리 컴포넌트 정의
  const { isAdminAuthenticated } = useAdminAuth(); // 관리자 인증 상태를 가져옵니다.
  const [groomingServices, setGroomingServices] = useState([]); // 미용 서비스 목록을 저장하는 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [editingService, setEditingService] = useState(null); // 현재 수정 중인 미용 서비스 정보
  const [newService, setNewService] = useState({ // 새로 추가할 미용 서비스 정보
    name: '',
    price: '',
    description: '',
    duration: '',
  });

  useEffect(() => { // 컴포넌트 마운트 시 초기 데이터를 설정하고 미용 서비스 목록을 불러옵니다.
    mockDataService.initialize('groomingServices', initialGroomingData);
    if (isAdminAuthenticated) { // 관리자 인증 상태일 때만 데이터를 가져옵니다.
      fetchGroomingServices();
    }
  }, [isAdminAuthenticated]); // isAdminAuthenticated가 변경될 때마다 실행됩니다.

  const fetchGroomingServices = async () => { // 미용 서비스 목록을 비동기적으로 가져오는 함수
    setLoading(true); // 로딩 상태 시작
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.getAll('groomingServices'); // mockDataService를 통해 미용 서비스 데이터 요청
      if (response.success) {
        setGroomingServices(response.data); // 성공 시 미용 서비스 상태 업데이트
      } else {
        setError(response.message || '미용 서비스 정보를 불러오는데 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to fetch grooming services:', err);
      setError('미용 서비스 정보를 불러오는데 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleInputChange = (e) => { // 입력 필드 값 변경을 처리하는 함수
    const { name, value } = e.target;
    if (editingService) { // 수정 중인 서비스가 있을 경우 해당 상태 업데이트
      setEditingService({ ...editingService, [name]: value });
    } else { // 새로운 서비스를 추가 중일 경우 해당 상태 업데이트
      setNewService({ ...newService, [name]: value });
    }
  };

  const handleAddService = async (e) => { // 새 미용 서비스 추가를 처리하는 함수
    e.preventDefault(); // 폼 제출의 기본 동작 방지
    setError(null); // 에러 상태 초기화
    try {
      const serviceToSend = { ...newService };
      serviceToSend.price = parseFloat(serviceToSend.price); // 가격을 숫자로 변환
      serviceToSend.duration = parseInt(serviceToSend.duration) || null; // 소요 시간을 숫자로 변환 (없으면 null)

      const response = await mockDataService.create('groomingServices', serviceToSend); // mockDataService를 통해 미용 서비스 추가 요청
      if (response.success) {
        setNewService({ // 새 미용 서비스 폼 초기화
          name: '',
          price: '',
          description: '',
          duration: '',
        });
        fetchGroomingServices(); // 미용 서비스 목록 새로고침
      } else {
        setError(response.message || '미용 서비스 추가에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to add grooming service:', err);
      setError('미용 서비스 추가에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  const handleEditService = async (e) => { // 미용 서비스 수정을 처리하는 함수
    e.preventDefault(); // 폼 제출의 기본 동작 방지
    setError(null); // 에러 상태 초기화
    if (!editingService) return; // 수정 중인 서비스가 없으면 함수 종료
    try {
      const serviceToSend = { ...editingService };
      serviceToSend.price = parseFloat(serviceToSend.price); // 가격을 숫자로 변환
      serviceToSend.duration = parseInt(serviceToSend.duration) || null; // 소요 시간을 숫자로 변환 (없으면 null)

      const response = await mockDataService.update('groomingServices', editingService.id, serviceToSend); // mockDataService를 통해 미용 서비스 업데이트 요청
      if (response.success) {
        setEditingService(null); // 수정 상태 종료
        fetchGroomingServices(); // 미용 서비스 목록 새로고침
      } else {
        setError(response.message || '미용 서비스 수정에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to edit grooming service:', err);
      setError('미용 서비스 수정에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  const handleDeleteService = async (serviceId) => { // 미용 서비스 삭제를 처리하는 함수
    if (!window.confirm('정말로 이 미용 서비스를 삭제하시겠습니까?')) return; // 삭제 확인
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.remove('groomingServices', serviceId); // mockDataService를 통해 미용 서비스 삭제 요청
      if (response.success) {
        fetchGroomingServices(); // 미용 서비스 목록 새로고침
      } else {
        setError(response.message || '미용 서비스 삭제에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to delete grooming service:', err);
      setError('미용 서비스 삭제에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  if (loading) { // 로딩 중일 때 표시할 UI
    return <div className={adminStyles.userManagementContainer}>미용 서비스 정보를 불러오는 중...</div>;
  }

  if (error) { // 에러 발생 시 표시할 UI
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return ( // 미용 서비스 관리 페이지의 메인 UI
    <div className={adminStyles.userManagementContainer}>
      <h3>미용 서비스 관리</h3>

      {/* 새 미용 서비스 추가 폼 */}
      <h4>새 미용 서비스 추가</h4>
      <form onSubmit={handleAddService} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="서비스명" value={newService.name} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="가격" value={newService.price} onChange={handleInputChange} required />
        <input type="number" name="duration" placeholder="소요 시간 (분)" value={newService.duration} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newService.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      {/* 기존 미용 서비스 목록 */}
      <h4>기존 미용 서비스</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>서비스명</th>
            <th>가격</th>
            <th>소요 시간</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {groomingServices.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>
                {editingService?.id === service.id ? (
                  <input type="text" name="name" value={editingService.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  service.name
                )}
              </td>
              <td>
                {editingService?.id === service.id ? (
                  <input type="number" name="price" value={editingService.price} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  `₩${service.price}`
                )}
              </td>
              <td>
                {editingService?.id === service.id ? (
                  <input type="number" name="duration" value={editingService.duration} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  service.duration ? `${service.duration}분` : '-'
                )}
              </td>
              <td>
                {editingService?.id === service.id ? (
                  <>
                    <button onClick={handleEditService} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingService(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingService({ ...service })}>수정</button>
                    <button onClick={() => handleDeleteService(service.id)}>삭제</button>
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

export default GroomingManagement;