import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminStyles from './Admin.module.css';
import { mockDataService } from '../../utils/mockDataService';

const initialHotelData = [
  {
    id: 1,
    name: '펫 프렌들리 호텔 서울',
    address: '서울시 중구 명동 10',
    price: 250000,
    description: '반려동물과 함께 편안하게 머물 수 있는 럭셔리 호텔',
    image: 'https://picsum.photos/id/260/200/300',
  },
  {
    id: 2,
    name: '도그 리조트 제주',
    address: '제주도 서귀포시 안덕면 펫리조트길 50',
    price: 300000,
    description: '제주 자연 속에서 반려동물과 특별한 추억을 만들 수 있는 리조트',
    image: 'https://picsum.photos/id/261/200/300',
  },
  {
    id: 3,
    name: '고양이 전용 호텔 부산',
    address: '부산시 해운대구 센텀시티로 20',
    price: 180000,
    description: '고양이만을 위한 최고급 시설과 서비스를 제공하는 호텔',
    image: 'https://picsum.photos/id/262/200/300',
  },
];

const HotelManagement = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHotel, setEditingHotel] = useState(null);
  const [newHotel, setNewHotel] = useState({
    name: '',
    address: '',
    price: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    mockDataService.initialize('hotels', initialHotelData);
    if (isAdminAuthenticated) {
      fetchHotels();
    }
  }, [isAdminAuthenticated]);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockDataService.getAll('hotels');
      if (response.success) {
        setHotels(response.data);
      } else {
        setError(response.message || '호텔 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      setError('호텔 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingHotel) {
      setEditingHotel({ ...editingHotel, [name]: value });
    } else {
      setNewHotel({ ...newHotel, [name]: value });
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const hotelToSend = { ...newHotel };
      hotelToSend.price = parseFloat(hotelToSend.price);

      const response = await mockDataService.create('hotels', hotelToSend);
      if (response.success) {
        setNewHotel({
          name: '',
          address: '',
          price: '',
          description: '',
          image: '',
        });
        fetchHotels();
      } else {
        setError(response.message || '호텔 추가에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to add hotel:', err);
      setError('호텔 추가에 실패했습니다.');
    }
  };

  const handleEditHotel = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingHotel) return;
    try {
      const hotelToSend = { ...editingHotel };
      hotelToSend.price = parseFloat(hotelToSend.price);

      const response = await mockDataService.update('hotels', editingHotel.id, hotelToSend);
      if (response.success) {
        setEditingHotel(null);
        fetchHotels();
      } else {
        setError(response.message || '호텔 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to edit hotel:', err);
      setError('호텔 수정에 실패했습니다.');
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('정말로 이 호텔을 삭제하시겠습니까?')) return;
    setError(null);
    try {
      const response = await mockDataService.remove('hotels', hotelId);
      if (response.success) {
        fetchHotels();
      } else {
        setError(response.message || '호텔 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to delete hotel:', err);
      setError('호텔 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>호텔 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>호텔 관리</h3>

      <h4>새 호텔 추가</h4>
      <form onSubmit={handleAddHotel} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="호텔명" value={newHotel.name} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="주소" value={newHotel.address} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="가격" value={newHotel.price} onChange={handleInputChange} required />
        <input type="text" name="image" placeholder="이미지 URL" value={newHotel.image} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newHotel.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      <h4>기존 호텔</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>호텔명</th>
            <th>주소</th>
            <th>가격</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.id}</td>
              <td>
                {editingHotel?.id === hotel.id ? (
                  <input type="text" name="name" value={editingHotel.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hotel.name
                )}
              </td>
              <td>
                {editingHotel?.id === hotel.id ? (
                  <input type="text" name="address" value={editingHotel.address} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hotel.address
                )}
              </td>
              <td>
                {editingHotel?.id === hotel.id ? (
                  <input type="number" name="price" value={editingHotel.price} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  `₩${hotel.price}`
                )}
              </td>
              <td>
                {editingHotel?.id === hotel.id ? (
                  <>
                    <button onClick={handleEditHotel} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingHotel(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingHotel({ ...hotel })}>수정</button>
                    <button onClick={() => handleDeleteHotel(hotel.id)}>삭제</button>
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

export default HotelManagement;
