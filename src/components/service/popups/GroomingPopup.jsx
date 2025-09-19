// src/components/service/popups/GroomingPopup.jsx

import React from 'react';
import './ServicePopup.css';

const GroomingPopup = ({ data, onClose }) => {
  const { name, serviceData = {} } = data;
  const {
    services = [],
    petTypes = [],
    priceRange = 'medium',
    rating = 0,
    phone = '',
    address = ''
  } = serviceData;

  const getPriceRangeText = (range) => {
    switch (range) {
      case 'low': return '저렴 (3만원 이하)';
      case 'medium': return '보통 (3-6만원)';
      case 'high': return '고급 (6만원 이상)';
      default: return '문의';
    }
  };

  const getServiceText = (service) => {
    const serviceMap = {
      'bathing': '목욕',
      'nail-trimming': '발톱깎기',
      'full-grooming': '풀 그루밍',
      'teeth-cleaning': '양치',
      'ear-cleaning': '귀청소'
    };
    return serviceMap[service] || service;
  };

  const getPetTypeText = (petType) => {
    const petTypeMap = {
      'dog': '강아지',
      'cat': '고양이',
      'small-pets': '소동물',
      'birds': '조류'
    };
    return petTypeMap[petType] || petType;
  };

  return (
    <div className="service-popup grooming-popup">
      <div className="popup-header">
        <div className="popup-title">
          <span className="service-icon">🐕</span>
          <h3>{name}</h3>
        </div>
        {onClose && (
          <button className="popup-close" onClick={onClose}>×</button>
        )}
      </div>

      <div className="popup-content">
        {services.length > 0 && (
          <div className="info-section">
            <div className="info-label">제공 서비스</div>
            <div className="service-tags">
              {services.map(service => (
                <span key={service} className="service-tag grooming-tag">
                  {getServiceText(service)}
                </span>
              ))}
            </div>
          </div>
        )}

        {petTypes.length > 0 && (
          <div className="info-section">
            <div className="info-label">반려동물 종류</div>
            <div className="pet-types">
              {petTypes.map(petType => (
                <span key={petType} className="pet-type-tag">
                  {getPetTypeText(petType)}
                </span>
              ))}
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default GroomingPopup;