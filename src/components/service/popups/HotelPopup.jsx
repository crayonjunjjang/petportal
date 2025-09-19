// src/components/service/popups/HotelPopup.jsx

import React from 'react';
import './ServicePopup.css';

const HotelPopup = ({ data, onClose }) => {
  const { name, serviceData = {} } = data;
  const {
    petPolicy = { allowed: false, fee: 0, restrictions: [] },
    petAmenities = [],
    roomTypes = [],
    priceRange = 'mid-range',
    rating = 0,
    phone = '',
    address = ''
  } = serviceData;

  const getPriceRangeText = (range) => {
    switch (range) {
      case 'budget': return '경제형 (10만원 이하)';
      case 'mid-range': return '중급형 (10-20만원)';
      case 'luxury': return '고급형 (20만원 이상)';
      default: return '문의';
    }
  };

  const getRoomTypeText = (roomType) => {
    const roomTypeMap = {
      'standard': '스탠다드',
      'deluxe': '디럭스',
      'suite': '스위트',
      'family': '패밀리룸'
    };
    return roomTypeMap[roomType] || roomType;
  };

  const getPetAmenityText = (amenity) => {
    const amenityMap = {
      'pet-beds': '반려동물 침대',
      'pet-food': '반려동물 사료',
      'pet-sitting': '펫시팅 서비스',
      'pet-park': '반려동물 놀이터',
      'pet-spa': '반려동물 스파'
    };
    return amenityMap[amenity] || amenity;
  };

  const getPetAmenityIcon = (amenity) => {
    const iconMap = {
      'pet-beds': '🛏️',
      'pet-food': '🍽️',
      'pet-sitting': '👨‍⚕️',
      'pet-park': '🏞️',
      'pet-spa': '🛁'
    };
    return iconMap[amenity] || '🐕';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="service-popup hotel-popup">
      <div className="popup-header">
        <div className="popup-title">
          <span className="service-icon">🏨</span>
          <h3>{name}</h3>
        </div>
        {onClose && (
          <button className="popup-close" onClick={onClose}>×</button>
        )}
      </div>

      <div className="popup-content">
        {/* Pet Policy Section */}
        <div className="info-section">
          <div className="info-label">반려동물 정책</div>
          <div className="pet-policy">
            {petPolicy.allowed ? (
              <div className="pet-allowed">
                <span className="policy-badge allowed">
                  🐕 반려동물 동반 가능
                </span>
                {petPolicy.fee > 0 && (
                  <div className="pet-fee">
                    추가 요금: {formatPrice(petPolicy.fee)}원/박
                  </div>
                )}
                {petPolicy.restrictions.length > 0 && (
                  <div className="pet-restrictions">
                    <div className="restrictions-label">제한사항:</div>
                    <ul className="restrictions-list">
                      {petPolicy.restrictions.map((restriction, index) => (
                        <li key={index}>{restriction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <span className="policy-badge not-allowed">
                ❌ 반려동물 동반 불가
              </span>
            )}
          </div>
        </div>

        {/* Pet Amenities */}
        {petAmenities.length > 0 && (
          <div className="info-section">
            <div className="info-label">반려동물 편의시설</div>
            <div className="pet-amenity-tags">
              {petAmenities.map(amenity => (
                <span key={amenity} className="pet-amenity-tag hotel-tag">
                  <span className="amenity-icon">{getPetAmenityIcon(amenity)}</span>
                  {getPetAmenityText(amenity)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Room Types */}
        {roomTypes.length > 0 && (
          <div className="info-section">
            <div className="info-label">객실 타입</div>
            <div className="room-types">
              {roomTypes.map(roomType => (
                <span key={roomType} className="room-type-tag">
                  {getRoomTypeText(roomType)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="info-section">
          <div className="info-label">가격대</div>
          <div className="price-range">
            <span className={`price-badge ${priceRange}`}>
              {getPriceRangeText(priceRange)}
            </span>
          </div>
        </div>

        {rating > 0 && (
          <div className="info-section">
            <div className="info-label">평점</div>
            <div className="rating">
              <span className="stars">
                {'⭐'.repeat(Math.floor(rating))}
              </span>
              <span className="rating-number">{rating.toFixed(1)}</span>
            </div>
          </div>
        )}

        {address && (
          <div className="info-section">
            <div className="info-label">주소</div>
            <div className="address">{address}</div>
          </div>
        )}

        {phone && (
          <div className="info-section">
            <div className="info-label">전화번호</div>
            <div className="contact">
              <a href={`tel:${phone}`} className="phone-link">
                📞 {phone}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="popup-actions">
        <button 
          className="action-button primary"
          onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(name)}`, '_blank')}
        >
          길찾기
        </button>
        {phone && (
          <button 
            className="action-button secondary"
            onClick={() => window.open(`tel:${phone}`)}
          >
            전화하기
          </button>
        )}
        <button 
          className="action-button tertiary"
          onClick={() => {
            // This could integrate with booking systems in the future
            alert('예약 기능은 준비 중입니다.');
          }}
        >
          예약하기
        </button>
      </div>

      {petPolicy.allowed && (
        <div className="pet-notice">
          <div className="notice-icon">🐕</div>
          <div className="notice-text">
            반려동물 동반 시 사전 예약이 필요할 수 있습니다.
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelPopup;