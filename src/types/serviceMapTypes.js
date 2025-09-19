// src/types/serviceMapTypes.js

// Base marker interface
export const createBaseMarker = (id, lat, lng, name) => ({
  id,
  lat,
  lng,
  name,
});

// Service-specific marker data structures
export const createGroomingMarker = (baseMarker, serviceData) => ({
  ...baseMarker,
  serviceType: 'grooming',
  services: serviceData.services || [],
  petTypes: serviceData.petTypes || [],
  priceRange: serviceData.priceRange || 'medium',
  rating: serviceData.rating || 0,
  phone: serviceData.phone || '',
  address: serviceData.address || '',
});

export const createCafeMarker = (baseMarker, serviceData) => ({
  ...baseMarker,
  serviceType: 'cafe',
  amenities: serviceData.amenities || [],
  specialties: serviceData.specialties || [],
  isOpen: serviceData.isOpen || false,
  openingHours: serviceData.openingHours || '',
  rating: serviceData.rating || 0,
  phone: serviceData.phone || '',
  address: serviceData.address || '',
});

export const createHospitalMarker = (baseMarker, serviceData) => ({
  ...baseMarker,
  serviceType: 'hospital',
  specialties: serviceData.specialties || [],
  isEmergency: serviceData.isEmergency || false,
  is24Hours: serviceData.is24Hours || false,
  phone: serviceData.phone || '',
  emergencyPhone: serviceData.emergencyPhone || '',
  rating: serviceData.rating || 0,
  address: serviceData.address || '',
});

export const createHotelMarker = (baseMarker, serviceData) => ({
  ...baseMarker,
  serviceType: 'hotel',
  petPolicy: {
    allowed: serviceData.petPolicy?.allowed || false,
    fee: serviceData.petPolicy?.fee || 0,
    restrictions: serviceData.petPolicy?.restrictions || [],
  },
  petAmenities: serviceData.petAmenities || [],
  roomTypes: serviceData.roomTypes || [],
  priceRange: serviceData.priceRange || 'mid-range',
  rating: serviceData.rating || 0,
  phone: serviceData.phone || '',
  address: serviceData.address || '',
});

// Filter interfaces
export const createGroomingFilters = (services = [], petTypes = [], priceRanges = []) => ({
  services,
  petTypes,
  priceRanges,
});

export const createCafeFilters = (amenities = [], isOpenOnly = false) => ({
  amenities,
  isOpenOnly,
});

export const createHospitalFilters = (specialties = [], emergencyOnly = false, available24h = false) => ({
  specialties,
  emergencyOnly,
  available24h,
});

export const createHotelFilters = (petFriendly = false, petAmenities = [], priceRanges = []) => ({
  petFriendly,
  petAmenities,
  priceRanges,
});

// Validation functions
export const validateMarkerData = (marker) => {
  if (!marker.id || !marker.lat || !marker.lng || !marker.name) {
    console.warn('Invalid marker data:', marker);
    return false;
  }
  
  if (typeof marker.lat !== 'number' || typeof marker.lng !== 'number') {
    console.warn('Invalid coordinates:', marker);
    return false;
  }
  
  return true;
};

export const validateServiceData = (serviceData, serviceType) => {
  if (!serviceData || typeof serviceData !== 'object') {
    return false;
  }
  
  switch (serviceType) {
    case 'grooming':
      return Array.isArray(serviceData.services) && Array.isArray(serviceData.petTypes);
    case 'cafe':
      return Array.isArray(serviceData.amenities);
    case 'hospital':
      return Array.isArray(serviceData.specialties);
    case 'hotel':
      return serviceData.petPolicy && typeof serviceData.petPolicy === 'object';
    default:
      return true;
  }
};