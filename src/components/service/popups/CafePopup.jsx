// src/components/service/popups/CafePopup.jsx

import React from 'react';
import './ServicePopup.css';

const CafePopup = ({ data, onClose }) => {
  const { name, serviceData = {} } = data;
  const {
    amenities = [],
    specialties = [],
    isOpen = false,
    openingHours = '',
    rating = 0,
    phone = '',
    address = ''
  } = serviceData;

  const getAmenityText = (amenity) => {
    const amenityMap = {
      'wifi': 'WiFi',
      'pet-friendly': '반려동물 동반',
      'outdoor-seating': '야외석',
      'parking': '주차장',
      'takeout': '테이크아웃',
      'delivery': '배달'
    };
    return amenityMap[amenity] || amenity;
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'wifi': '📶',
      'pet-friendly': '🐕',
      'outdoor-seating': '🪑',
      'parking': '🅿️',
      'takeout': '🥤',
      'delivery': '🚚'
    };
    return iconMap[amenity] || '✓';
  };

  const getSpecialtyText = (specialty) => {
    const specialtyMap = {
      'espresso': '에스프레소',
      'desserts': '디저트',
      'brunch': '브런치',
      'bakery': '베이커리',
      'smoothies': '스무디'
    };
    return specialtyMap[specialty] || specialty;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="service-popup cafe-popup">
      <div className="popup-header">
        <div className="popup-title">
          <span className="service-icon">☕</span>
          <h3>{name}</h3>
        </div>
        {onClose && (
          <button className="popup-close" onClick={onClose}>×</button>
        )}
      </div>

      <div className="popup-content">
        {/* Operating Status */}
        <div className="info-section">
          <div className="operating-status">
            <span className={`status-indicator ${isOpen ? 'open' : 'closed'}`}>
              {isOpen ? '🟢 영업중' : '🔴 영업종료'}
            </span>
            {openingHours && (
              <span className="opening-hours">
                {openingHours}
              </span>
            )}
          </div>
          <div className="current-time">
            현재 시간: {getCurrentTime()}
          </div>
        </div>

        {amenities.length > 0 && (
          <div className="info-section">
            <div className="info-label">편의시설</div>
            <div className="amenity-tags">
              {amenities.map(amenity => (
                <span key={amenity} className="amenity-tag cafe-tag">
                  <span className="amenity-icon">{getAmenityIcon(amenity)}</span>
                  {getAmenityText(amenity)}
                </span>
              ))}
            </div>
          </div>
        )}

        {specialties.length > 0 && (
          <div className="info-section">
            <div className="info-label">특선 메뉴</div>
            <div className="specialty-tags">
              {specialties.map(specialty => (
                <span key={specialty} className="specialty-tag">
                  {getSpecialtyText(specialty)}
                </span>
              ))}
            </div>
          </div>
        )}

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
        {isOpen && (
          <button 
            className="action-button tertiary"
            onClick={() => {
              // This could integrate with ordering systems in the future
              alert('주문 기능은 준비 중입니다.');
            }}
          >
            주문하기
          </button>
        )}
      </div>
    </div>
  );
};

export default CafePopup;