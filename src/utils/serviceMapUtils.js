// src/utils/serviceMapUtils.js

import { SERVICE_CONFIGS, generatePopupContent } from '../config/serviceMapConfig.js';
import { validateMarkerData, validateServiceData } from '../types/serviceMapTypes.js';

// Generate service-specific markers from raw data
export const generateServiceMarkers = (rawData, serviceType) => {
  if (!Array.isArray(rawData)) {
    console.warn('Invalid raw data for service markers:', rawData);
    return [];
  }
  
    return rawData
      .filter(item => validateMarkerData(item))
      .map(item => {
        const serviceData = extractServiceData(item, serviceType);
  
        if (!validateServiceData(serviceData, serviceType)) {
          console.warn(`Invalid service data for ${serviceType}:`, serviceData);
        }
  
        const marker = {
          ...item,
          serviceType,
          serviceData,
          displayConfig: getDisplayConfig(serviceType, serviceData),
        };
        return {
          ...marker,
          popupContent: generatePopupContent(marker, serviceType),
        };
      });};

// Extract service-specific data from raw item data
const extractServiceData = (item, serviceType) => {
  switch (serviceType) {
    case 'grooming':
      return {
        services: item.services || ['full-grooming'],
        petTypes: item.petTypes || ['dog', 'cat'],
        priceRange: item.priceRange || 'medium',
        rating: item.rating || 4.0,
        phone: item.phone || '',
        address: item.address || '',
      };
      
    case 'cafe':
      return {
        amenities: item.amenities || ['wifi'],
        specialties: item.specialties || ['coffee'],
        isOpen: item.isOpen !== undefined ? item.isOpen : true,
        openingHours: item.openingHours || '09:00-22:00',
        rating: item.rating || 4.0,
        phone: item.phone || '',
        address: item.address || '',
      };
      
    case 'hospital':
      return {
        specialties: item.specialties || ['general'],
        isEmergency: item.isEmergency || false,
        is24Hours: item.is24Hours || false,
        phone: item.phone || '',
        emergencyPhone: item.emergencyPhone || item.phone || '',
        rating: item.rating || 4.0,
        address: item.address || '',
      };
      
    case 'hotel':
      return {
        petPolicy: {
          allowed: item.petPolicy?.allowed || item.petFriendly || false,
          fee: item.petPolicy?.fee || item.petFee || 0,
          restrictions: item.petPolicy?.restrictions || [],
        },
        petAmenities: item.petAmenities || [],
        roomTypes: item.roomTypes || ['standard'],
        priceRange: item.priceRange || 'mid-range',
        rating: item.rating || 4.0,
        phone: item.phone || '',
        address: item.address || '',
      };
      
    default:
      return {};
  }
};

// Get display configuration for service type
const getDisplayConfig = (serviceType, serviceData) => {
  const config = SERVICE_CONFIGS[serviceType];
  let priority = 0;
  
  // Set priority based on service-specific criteria
  switch (serviceType) {
    case 'hospital':
      if (serviceData.isEmergency) priority = 2;
      else if (serviceData.is24Hours) priority = 1;
      break;
    case 'cafe':
      if (serviceData.isOpen) priority = 1;
      break;
    case 'hotel':
      if (serviceData.petPolicy?.allowed) priority = 1;
      break;
    default:
      priority = 0;
  }
  
  return {
    icon: config.markerIcon,
    color: config.markerColor,
    priority,
    size: priority > 0 ? 36 : 32, // Larger markers for high priority
  };
};

// Filter markers based on service-specific criteria
export const filterServiceMarkers = (markers, filters, serviceType) => {
  if (!Array.isArray(markers) || !filters) {
    return markers;
  }
  
  return markers.filter(marker => {
    switch (serviceType) {
      case 'grooming':
        return filterGroomingMarker(marker, filters);
      case 'cafe':
        return filterCafeMarker(marker, filters);
      case 'hospital':
        return filterHospitalMarker(marker, filters);
      case 'hotel':
        return filterHotelMarker(marker, filters);
      default:
        return true;
    }
  });
};

// Service-specific filter functions
const filterGroomingMarker = (marker, filters) => {
  const { serviceData } = marker;
  
  if (filters.services?.length > 0) {
    const hasService = filters.services.some(service => 
      serviceData.services?.includes(service)
    );
    if (!hasService) return false;
  }
  
  if (filters.petTypes?.length > 0) {
    const hasPetType = filters.petTypes.some(petType => 
      serviceData.petTypes?.includes(petType)
    );
    if (!hasPetType) return false;
  }
  
  if (filters.priceRanges?.length > 0) {
    if (!filters.priceRanges.includes(serviceData.priceRange)) {
      return false;
    }
  }
  
  return true;
};

const filterCafeMarker = (marker, filters) => {
  const { serviceData } = marker;
  
  if (filters.amenities?.length > 0) {
    const hasAmenity = filters.amenities.some(amenity => 
      serviceData.amenities?.includes(amenity)
    );
    if (!hasAmenity) return false;
  }
  
  if (filters.isOpenOnly && !serviceData.isOpen) {
    return false;
  }
  
  return true;
};

const filterHospitalMarker = (marker, filters) => {
  const { serviceData } = marker;
  
  if (filters.specialties?.length > 0) {
    const hasSpecialty = filters.specialties.some(specialty => 
      serviceData.specialties?.includes(specialty)
    );
    if (!hasSpecialty) return false;
  }
  
  if (filters.emergencyOnly && !serviceData.isEmergency) {
    return false;
  }
  
  if (filters.available24h && !serviceData.is24Hours) {
    return false;
  }
  
  return true;
};

const filterHotelMarker = (marker, filters) => {
  const { serviceData } = marker;
  
  if (filters.petFriendly && !serviceData.petPolicy?.allowed) {
    return false;
  }
  
  if (filters.petAmenities?.length > 0) {
    const hasPetAmenity = filters.petAmenities.some(amenity => 
      serviceData.petAmenities?.includes(amenity)
    );
    if (!hasPetAmenity) return false;
  }
  
  if (filters.priceRanges?.length > 0) {
    if (!filters.priceRanges.includes(serviceData.priceRange)) {
      return false;
    }
  }
  
  return true;
};

// Calculate distance between two points (for sorting by proximity)
export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Sort markers by distance from user location
export const sortMarkersByDistance = (markers, userLocation) => {
  if (!userLocation || !Array.isArray(markers)) {
    return markers;
  }
  
  return [...markers].sort((a, b) => {
    const distanceA = calculateDistance(userLocation, a);
    const distanceB = calculateDistance(userLocation, b);
    return distanceA - distanceB;
  });
};