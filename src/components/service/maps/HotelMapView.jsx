// src/components/service/maps/HotelMapView.jsx

import React from 'react';
import BaseServiceMapView from '../../common/BaseServiceMapView';
import ServiceMapErrorBoundary from '../../common/ServiceMapErrorBoundary';
import { SERVICE_CONFIGS } from '../../../config/serviceMapConfig';

const HotelMapView = ({ 
  userLocation, 
  markers = [], 
  filters = {},
  onMarkerClick,
  className = ''
}) => {
  // Get hotel-specific configuration
  const hotelConfig = SERVICE_CONFIGS.hotel;

  // Process filters for hotel service
  const processedFilters = {
    petFriendly: filters.petFriendly || false,
    petAmenities: filters.petAmenities || [],
    priceRanges: filters.priceRanges || [],
    ...filters
  };

  // Custom marker click handler for hotel
  const handleMarkerClick = (markerData) => {
    console.log('Hotel marker clicked:', markerData);
    
    // Add hotel-specific logic here
    if (markerData.serviceData?.petPolicy?.allowed) {
      console.log('Pet-friendly hotel clicked');
    }
    
    // Call parent handler if provided
    if (onMarkerClick) {
      onMarkerClick(markerData);
    }
  };

  return (
    <ServiceMapErrorBoundary
      userLocation={userLocation}
      markers={markers}
      serviceType="hotel"
      serviceConfig={hotelConfig}
      onError={(error, errorInfo) => {
        console.error('HotelMapView Error:', error);
        // Could send to monitoring service
      }}
    >
      <BaseServiceMapView
        userLocation={userLocation}
        rawMarkers={markers}
        serviceType="hotel"
        filters={processedFilters}
        onMarkerClick={handleMarkerClick}
        className={`hotel-map ${className}`}
        customConfig={{
          // Override default config if needed
          markerIcon: '🏨',
          accentColor: '#96CEB4',
          backgroundColor: '#F0FDF4',
        }}
      />
    </ServiceMapErrorBoundary>
  );
};

export default HotelMapView;