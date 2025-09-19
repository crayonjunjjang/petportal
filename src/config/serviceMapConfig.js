// src/config/serviceMapConfig.js

// Service-specific marker configurations
export const SERVICE_CONFIGS = {
  grooming: {
    markerIcon: '🐕',
    markerColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
    accentColor: '#FF6B6B',
    name: '미용',
    defaultZoom: 5,
  },
  cafe: {
    markerIcon: '☕',
    markerColor: '#4ECDC4',
    backgroundColor: '#F0FDFC',
    accentColor: '#4ECDC4',
    name: '카페',
    defaultZoom: 5,
  },
  hospital: {
    markerIcon: '🏥',
    markerColor: '#45B7D1',
    backgroundColor: '#F0F9FF',
    accentColor: '#45B7D1',
    name: '병원',
    defaultZoom: 5,
  },
  hotel: {
    markerIcon: '🏨',
    markerColor: '#96CEB4',
    backgroundColor: '#F0FDF4',
    accentColor: '#96CEB4',
    name: '호텔',
    defaultZoom: 5,
  },
};

// Service-specific data type definitions
export const SERVICE_DATA_TYPES = {
  grooming: {
    services: ['bathing', 'nail-trimming', 'full-grooming', 'teeth-cleaning', 'ear-cleaning'],
    petTypes: ['dog', 'cat', 'small-pets', 'birds'],
    priceRanges: ['low', 'medium', 'high'],
  },
  cafe: {
    amenities: ['wifi', 'pet-friendly', 'outdoor-seating', 'parking', 'takeout', 'delivery'],
    specialties: ['espresso', 'desserts', 'brunch', 'bakery', 'smoothies'],
    operatingStatus: ['open', 'closed', 'closing-soon'],
  },
  hospital: {
    specialties: ['general', 'surgery', 'dental', 'emergency', 'dermatology', 'cardiology'],
    serviceTypes: ['consultation', 'surgery', 'vaccination', 'health-check'],
    availability: ['24hours', 'emergency', 'appointment-only'],
  },
  hotel: {
    petAmenities: ['pet-beds', 'pet-food', 'pet-sitting', 'pet-park', 'pet-spa'],
    roomTypes: ['standard', 'deluxe', 'suite', 'family'],
    priceRanges: ['budget', 'mid-range', 'luxury'],
    petPolicies: ['small-pets-only', 'all-pets', 'cats-only', 'dogs-only'],
  },
};

// Utility function to get service configuration
export const getServiceConfig = (serviceType) => {
  return SERVICE_CONFIGS[serviceType] || SERVICE_CONFIGS.grooming;
};

// Utility function to get service data types
export const getServiceDataTypes = (serviceType) => {
  return SERVICE_DATA_TYPES[serviceType] || SERVICE_DATA_TYPES.grooming;
};

// Generate service-specific marker data
export const createServiceMarker = (baseData, serviceType, serviceSpecificData = {}) => {
  const config = getServiceConfig(serviceType);
  
  return {
    ...baseData,
    serviceType,
    serviceData: serviceSpecificData,
    displayConfig: {
      icon: config.markerIcon,
      color: config.markerColor,
      priority: serviceType === 'hospital' ? 1 : 0, // Emergency services get higher priority
    },
    popupConfig: {
      backgroundColor: config.backgroundColor,
      accentColor: config.accentColor,
      serviceName: config.name,
    },
  };
};

// Service-specific popup content generators
export const generatePopupContent = (markerData, serviceType) => {
  const config = getServiceConfig(serviceType);
  const { serviceData } = markerData;
  
  switch (serviceType) {
    case 'grooming':
      return {
        title: markerData.name,
        subtitle: `${config.markerIcon} ${config.name}`,
        content: [
          serviceData.services && `서비스: ${serviceData.services.join(', ')}`,
          serviceData.petTypes && `반려동물: ${serviceData.petTypes.join(', ')}`,
          serviceData.priceRange && `가격대: ${serviceData.priceRange}`,
          serviceData.rating && `평점: ⭐ ${serviceData.rating}`,
        ].filter(Boolean),
      };
      
    case 'cafe':
      return {
        title: markerData.name,
        subtitle: `${config.markerIcon} ${config.name}`,
        content: [
          serviceData.amenities && `편의시설: ${serviceData.amenities.join(', ')}`,
          serviceData.specialties && `특선: ${serviceData.specialties.join(', ')}`,
          serviceData.isOpen !== undefined && `운영상태: ${serviceData.isOpen ? '영업중' : '영업종료'}`,
          serviceData.openingHours && `운영시간: ${serviceData.openingHours}`,
          serviceData.rating && `평점: ⭐ ${serviceData.rating}`,
        ].filter(Boolean),
      };
      
    case 'hospital':
      return {
        title: markerData.name,
        subtitle: `${config.markerIcon} ${config.name}`,
        content: [
          serviceData.specialties && `전문분야: ${serviceData.specialties.join(', ')}`,
          serviceData.isEmergency && '🚨 응급실 운영',
          serviceData.is24Hours && '⏰ 24시간 운영',
          serviceData.phone && `전화: ${serviceData.phone}`,
          serviceData.emergencyPhone && `응급: ${serviceData.emergencyPhone}`,
          serviceData.rating && `평점: ⭐ ${serviceData.rating}`,
        ].filter(Boolean),
      };
      
    case 'hotel':
      return {
        title: markerData.name,
        subtitle: `${config.markerIcon} ${config.name}`,
        content: [
          serviceData.petPolicy?.allowed && '🐕 반려동물 동반 가능',
          serviceData.petPolicy?.fee && `반려동물 추가요금: ${serviceData.petPolicy.fee}원`,
          serviceData.petAmenities && `반려동물 편의시설: ${serviceData.petAmenities.join(', ')}`,
          serviceData.roomTypes && `객실타입: ${serviceData.roomTypes.join(', ')}`,
          serviceData.priceRange && `가격대: ${serviceData.priceRange}`,
          serviceData.rating && `평점: ⭐ ${serviceData.rating}`,
        ].filter(Boolean),
      };
      
    default:
      return {
        title: markerData.name,
        subtitle: config.name,
        content: ['기본 정보가 표시됩니다.'],
      };
  }
};