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

const GroomingManagement = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const [groomingServices, setGroomingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
    duration: '',
  });

  useEffect(() => {
    mockDataService.initialize('groomingServices', initialGroomingData);
    if (isAdminAuthenticated) {
      fetchGroomingServices();
    }
  }, [isAdminAuthenticated]);

  const fetchGroomingServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockDataService.getAll('groomingServices');
      if (response.success) {
        setGroomingServices(response.data);
      } else {
        setError(response.message || '미용 서비스 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to fetch grooming services:', err);
      setError('미용 서비스 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService({ ...editingService, [name]: value });
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const serviceToSend = { ...newService };
      serviceToSend.price = parseFloat(serviceToSend.price);
      serviceToSend.duration = parseInt(serviceToSend.duration) || null;

      const response = await mockDataService.create('groomingServices', serviceToSend);
      if (response.success) {
        setNewService({
          name: '',
          price: '',
          description: '',
          duration: '',
        });
        fetchGroomingServices();
      } else {
        setError(response.message || '미용 서비스 추가에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to add grooming service:', err);
      setError('미용 서비스 추가에 실패했습니다.');
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingService) return;
    try {
      const serviceToSend = { ...editingService };
      serviceToSend.price = parseFloat(serviceToSend.price);
      serviceToSend.duration = parseInt(serviceToSend.duration) || null;

      const response = await mockDataService.update('groomingServices', editingService.id, serviceToSend);
      if (response.success) {
        setEditingService(null);
        fetchGroomingServices();
      } else {
        setError(response.message || '미용 서비스 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to edit grooming service:', err);
      setError('미용 서비스 수정에 실패했습니다.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('정말로 이 미용 서비스를 삭제하시겠습니까?')) return;
    setError(null);
    try {
      const response = await mockDataService.remove('groomingServices', serviceId);
      if (response.success) {
        fetchGroomingServices();
      } else {
        setError(response.message || '미용 서비스 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to delete grooming service:', err);
      setError('미용 서비스 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>미용 서비스 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>미용 서비스 관리</h3>

      <h4>새 미용 서비스 추가</h4>
      <form onSubmit={handleAddService} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="서비스명" value={newService.name} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="가격" value={newService.price} onChange={handleInputChange} required />
        <input type="number" name="duration" placeholder="소요 시간 (분)" value={newService.duration} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newService.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

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