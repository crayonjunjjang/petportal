// src/components/admin/CafeManagement.jsx
// 이 파일은 관리자가 카페 정보를 관리(추가, 수정, 삭제)할 수 있는 컴포넌트입니다.
// 카페 목록을 표시하고, 새로운 카페를 추가하거나 기존 카페의 정보를 수정 및 삭제하는 기능을 제공합니다.

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminStyles from './Admin.module.css';
import { mockDataService } from '../../utils/mockDataService';

// Initial mock data for cafes
const initialCafeData = [
  {
    id: 1,
    name: '멍멍이 카페',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    description: '강아지들이 뛰어놀 수 있는 넓은 공간과 맛있는 커피가 있는 카페입니다.',
    image: 'https://picsum.photos/id/250/200/300',
  },
  {
    id: 2,
    name: '냥이의 휴식처',
    address: '서울시 마포구 홍대입구 45',
    phone: '02-9876-5432',
    description: '고양이들과 함께 편안하게 쉴 수 있는 아늑한 공간입니다.',
    image: 'https://picsum.photos/id/251/200/300',
  },
  {
    id: 3,
    name: '새들의 정원',
    address: '경기도 용인시 수지구 숲속로 78',
    phone: '031-5555-4444',
    description: '다양한 새들과 교감하며 자연을 느낄 수 있는 이색 카페입니다.',
    image: 'https://picsum.photos/id/252/200/300',
  },
  {
    id: 4,
    name: '도그라운드',
    address: '부산 해운대구 센텀동로 12',
    phone: '051-1111-2222',
    description: '넓은 야외 운동장이 있는 반려견 동반 카페',
    image: 'https://picsum.photos/id/253/200/300',
  },
  {
    id: 5,
    name: '캣츠앤커피',
    address: '대구 중구 동성로 30',
    phone: '053-3333-4444',
    description: '다양한 고양이들과 함께하는 아늑한 북카페',
    image: 'https://picsum.photos/id/254/200/300',
  },
  {
    id: 6,
    name: '펫츠 플레이스',
    address: '광주 서구 상무대로 50',
    phone: '062-5555-6666',
    description: '반려동물 용품샵과 카페가 결합된 복합 공간',
    image: 'https://picsum.photos/id/255/200/300',
  },
  {
    id: 7,
    name: '댕댕이의 하루',
    address: '대전 유성구 봉명동 77',
    phone: '042-7777-8888',
    description: '수제 간식과 애견 유치원을 함께 운영하는 카페',
    image: 'https://picsum.photos/id/256/200/300',
  },
  {
    id: 8,
    name: '멍냥쉼터',
    address: '울산 남구 삼산로 99',
    phone: '052-9999-0000',
    description: '조용하고 아늑한 분위기에서 반려동물과 휴식',
    image: 'https://picsum.photos/id/257/200/300',
  },
  {
    id: 9,
    name: '해피 펫 카페',
    address: '인천 연수구 송도동 100',
    phone: '032-1234-0000',
    description: '넓은 실내 공간과 다양한 놀이 시설을 갖춘 카페',
    image: 'https://picsum.photos/id/258/200/300',
  },
  {
    id: 10,
    name: '숲속의 멍냥',
    address: '강원 춘천시 남산면 숲길 20',
    phone: '033-2222-3333',
    description: '자연 속에서 반려동물과 함께 힐링할 수 있는 카페',
    image: 'https://picsum.photos/id/259/200/300',
  },
  {
    id: 11,
    name: '제주 멍멍이네',
    address: '제주 제주시 애월읍 애월로 15',
    phone: '064-1111-3333',
    description: '제주 바다를 보며 즐기는 반려견 동반 카페',
    image: 'https://picsum.photos/id/260/200/300',
  },
  {
    id: 12,
    name: '광안리 펫 카페',
    address: '부산 수영구 광안해변로 200',
    phone: '051-4444-5555',
    description: '광안대교 뷰가 멋진 반려견 동반 카페',
    image: 'https://picsum.photos/id/261/200/300',
  },
  {
    id: 13,
    name: '대구 펫 프렌즈',
    address: '대구 수성구 동대구로 100',
    phone: '053-6666-7777',
    description: '다양한 품종의 강아지들이 있는 테마 카페',
    image: 'https://picsum.photos/id/262/200/300',
  },
  {
    id: 14,
    name: '대전 냥이별',
    address: '대전 서구 둔산로 50',
    phone: '042-8888-9999',
    description: '고양이들과 함께하는 조용한 휴식 공간',
    image: 'https://picsum.photos/id/263/200/300',
  },
  {
    id: 15,
    name: '울산 펫 빌리지',
    address: '울산 북구 진장유통로 10',
    phone: '052-1212-3434',
    description: '대규모 반려동물 복합 문화 공간 내 카페',
    image: 'https://picsum.photos/id/264/200/300',
  },
  {
    id: 16,
    name: '인천 댕냥하우스',
    address: '인천 남동구 구월동 55',
    phone: '032-5656-7878',
    description: '아늑한 분위기의 반려견, 반려묘 동반 카페',
    image: 'https://picsum.photos/id/265/200/300',
  },
  {
    id: 17,
    name: '강릉 펫 오션',
    address: '강원 강릉시 창해로 300',
    phone: '033-1111-5555',
    description: '오션뷰를 즐길 수 있는 반려견 동반 카페',
    image: 'https://picsum.photos/id/266/200/300',
  },
  {
    id: 18,
    name: '여수 낭만 펫',
    address: '전남 여수시 웅천남로 10',
    phone: '061-2222-4444',
    description: '낭만적인 분위기의 반려견 동반 카페',
    image: 'https://picsum.photos/id/267/200/300',
  },
  {
    id: 19,
    name: '경주 펫 스테이',
    address: '경북 경주시 보문로 400',
    phone: '054-3333-6666',
    description: '한옥 스타일의 반려견 동반 카페',
    image: 'https://picsum.photos/id/268/200/300',
  },
  {
    id: 20,
    name: '춘천 펫 가든',
    address: '강원 춘천시 신북읍 율문리 100',
    phone: '033-7777-9999',
    description: '넓은 정원에서 뛰어놀 수 있는 반려견 동반 카페',
    image: 'https://picsum.photos/id/269/200/300',
  },
];

const CafeManagement = () => { // 카페 관리 컴포넌트 정의
  const { isAdminAuthenticated } = useAdminAuth(); // 관리자 인증 상태를 가져옵니다.
  const [cafes, setCafes] = useState([]); // 카페 목록을 저장하는 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [editingCafe, setEditingCafe] = useState(null); // 현재 수정 중인 카페 정보
  const [newCafe, setNewCafe] = useState({ // 새로 추가할 카페 정보
    name: '',
    address: '',
    phone: '',
    description: '',
    image: '',
  });

  useEffect(() => { // 컴포넌트 마운트 시 초기 데이터를 설정하고 카페 목록을 불러옵니다.
    mockDataService.initialize('cafes', initialCafeData);
    if (isAdminAuthenticated) { // 관리자 인증 상태일 때만 데이터를 가져옵니다.
      fetchCafes();
    }
  }, [isAdminAuthenticated]); // isAdminAuthenticated가 변경될 때마다 실행됩니다.

  const fetchCafes = async () => { // 카페 목록을 비동기적으로 가져오는 함수
    setLoading(true); // 로딩 상태 시작
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.getAll('cafes'); // mockDataService를 통해 카페 데이터 요청
      if (response.success) {
        setCafes(response.data); // 성공 시 카페 상태 업데이트
      } else {
        setError(response.message || '카페 정보를 불러오는데 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to fetch cafes:', err);
      setError('카페 정보를 불러오는데 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleInputChange = (e) => { // 입력 필드 값 변경을 처리하는 함수
    const { name, value } = e.target;
    if (editingCafe) { // 수정 중인 카페가 있을 경우 해당 상태 업데이트
      setEditingCafe({ ...editingCafe, [name]: value });
    } else { // 새로운 카페를 추가 중일 경우 해당 상태 업데이트
      setNewCafe({ ...newCafe, [name]: value });
    }
  };

  const handleAddCafe = async (e) => { // 새 카페 추가를 처리하는 함수
    e.preventDefault(); // 폼 제출의 기본 동작 방지
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.create('cafes', newCafe); // mockDataService를 통해 카페 추가 요청
      if (response.success) {
        setNewCafe({ // 새 카페 폼 초기화
          name: '',
          address: '',
          phone: '',
          description: '',
          image: '',
        });
        fetchCafes(); // 카페 목록 새로고침
      } else {
        setError(response.message || '카페 추가에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to add cafe:', err);
      setError('카페 추가에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  const handleEditCafe = async (e) => { // 카페 수정을 처리하는 함수
    e.preventDefault(); // 폼 제출의 기본 동작 방지
    setError(null); // 에러 상태 초기화
    if (!editingCafe) return; // 수정 중인 카페가 없으면 함수 종료
    try {
      const response = await mockDataService.update('cafes', editingCafe.id, editingCafe); // mockDataService를 통해 카페 업데이트 요청
      if (response.success) {
        setEditingCafe(null); // 수정 상태 종료
        fetchCafes(); // 카페 목록 새로고침
      } else {
        setError(response.message || '카페 수정에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to edit cafe:', err);
      setError('카페 수정에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  const handleDeleteCafe = async (cafeId) => { // 카페 삭제를 처리하는 함수
    if (!window.confirm('정말로 이 카페를 삭제하시겠습니까?')) return; // 삭제 확인
    setError(null); // 에러 상태 초기화
    try {
      const response = await mockDataService.remove('cafes', cafeId); // mockDataService를 통해 카페 삭제 요청
      if (response.success) {
        fetchCafes(); // 카페 목록 새로고침
      } else {
        setError(response.message || '카페 삭제에 실패했습니다.'); // 실패 시 에러 메시지 설정
      }
    } catch (err) {
      console.error('Failed to delete cafe:', err);
      setError('카페 삭제에 실패했습니다.'); // 예외 발생 시 에러 메시지 설정
    }
  };

  if (loading) { // 로딩 중일 때 표시할 UI
    return <div className={adminStyles.userManagementContainer}>카페 정보를 불러오는 중...</div>;
  }

  if (error) { // 에러 발생 시 표시할 UI
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return ( // 카페 관리 페이지의 메인 UI
    <div className={adminStyles.userManagementContainer}>
      <h3>카페 관리</h3>

      {/* 새 카페 추가 폼 */}
      <h4>새 카페 추가</h4>
      <form onSubmit={handleAddCafe} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="카페명" value={newCafe.name} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="주소" value={newCafe.address} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="전화번호" value={newCafe.phone} onChange={handleInputChange} />
        <input type="text" name="image" placeholder="이미지 URL" value={newCafe.image} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newCafe.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      {/* 기존 카페 목록 */}
      <h4>기존 카페</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>카페명</th>
            <th>주소</th>
            <th>전화번호</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {cafes.map((cafe) => (
            <tr key={cafe.id}>
              <td>{cafe.id}</td>
              <td>
                {editingCafe?.id === cafe.id ? (
                  <input type="text" name="name" value={editingCafe.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  cafe.name
                )}
              </td>
              <td>
                {editingCafe?.id === cafe.id ? (
                  <input type="text" name="address" value={editingCafe.address} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  cafe.address
                )}
              </td>
              <td>
                {editingCafe?.id === cafe.id ? (
                  <input type="text" name="phone" value={editingCafe.phone} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  cafe.phone
                )}
              </td>
              <td>
                {editingCafe?.id === cafe.id ? (
                  <>
                    <button onClick={handleEditCafe} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingCafe(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingCafe({ ...cafe })}>수정</button>
                    <button onClick={() => handleDeleteCafe(cafe.id)}>삭제</button>
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

export default CafeManagement;