// src/components/service/popups/HospitalPopup.jsx

import React from 'react';
import './ServicePopup.css';

const HospitalPopup = ({ data, onClose }) => {
  const { name, serviceData = {} } = data;
  const {
    specialties = [],
    isEmergency = false,
    is24Hours = false,
    phone = '',
    emergencyPhone = '',
    rating = 0,
    address = ''
  } = serviceData;

  const getSpecialtyText = (specialty) => {
    const specialtyMap = {
      'general': '일반진료',
      'surgery': '외과',
      'dental': '치과',
      'emergency': '응급실',
      'dermatology': '피부과',
      'cardiology': '심장내과'
    };
    return specialtyMap[specialty] || specialty;
  };

  const getSpecialtyIcon = (specialty) => {
    const iconMap = {
      'general': '🩺',
      'surgery': '🔬',
      'dental': '🦷',
      'emergency': '🚨',
      'dermatology': '💊',
      'cardiology': '❤️'
    };
    return iconMap[specialty] || '🏥';
  };

  return (
    <div className="service-popup hospital-popup">
      <div className="popup-header">
        <div className="popup-title">
          <span className="service-icon">🏥</span>
          <h3>{name}</h3>
        </div>
        {onClose && (
          <button className="popup-close" onClick={onClose}>×</button>
        )}
      </div>

      <div className="popup-content">
        {/* Emergency and 24h indicators */}
        {(isEmergency || is24Hours) && (
          <div className="info-section">
            <div className="emergency-indicators">
              {isEmergency && (
                <span className="emergency-badge">
                  🚨 응급실 운영
                </span>
              )}
              {is24Hours && (
                <span className="hours-badge">
                  ⏰ 24시간 운영
                </span>
              )}
            </div>
          </div>
        )}

        {specialties.length > 0 && (
          <div className="info-section">
            <div className="info-label">전문 진료과</div>
            <div className="specialty-tags">
              {specialties.map(specialty => (
                <span key={specialty} className="specialty-tag hospital-tag">
                  <span className="specialty-icon">{getSpecialtyIcon(specialty)}</span>
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

        {/* Contact Information */}
        <div className="info-section">
          <div className="info-label">연락처</div>
          <div className="contact-info">
            {phone && (
              <div className="contact-item">
                <a href={`tel:${phone}`} className="phone-link">
                  📞 일반: {phone}
                </a>
              </div>
            )}
            {emergencyPhone && emergencyPhone !== phone && (
              <div className="contact-item emergency">
                <a href={`tel:${emergencyPhone}`} className="phone-link emergency-phone">
                  🚨 응급: {emergencyPhone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Operating Hours Info */}
        <div className="info-section">
          <div className="info-label">운영 정보</div>
          <div className="operating-info">
            {is24Hours ? (
              <div className="hours-info">⏰ 24시간 운영</div>
            ) : (
              <div className="hours-info">📞 운영시간 문의</div>
            )}
            {isEmergency && (
              <div className="emergency-info">🚨 응급환자 24시간 접수</div>
            )}
          </div>
        </div>
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
        {isEmergency && emergencyPhone && (
          <button 
            className="action-button emergency"
            onClick={() => window.open(`tel:${emergencyPhone}`)}
          >
            응급전화
          </button>
        )}
      </div>

      {isEmergency && (
        <div className="emergency-notice">
          <div className="notice-icon">⚠️</div>
          <div className="notice-text">
            응급상황 시 119에 먼저 연락하시기 바랍니다.
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalPopup;