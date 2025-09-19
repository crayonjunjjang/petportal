// src/components/service/maps/CafeMapView.jsx

import React from 'react';
import BaseServiceMapView from '../../common/BaseServiceMapView';
import ServiceMapErrorBoundary from '../../common/ServiceMapErrorBoundary';
import { SERVICE_CONFIGS } from '../../../config/serviceMapConfig';

const CafeMapView = ({ 
  userLocation, 
  markers = [], 
  filters = {},
  onMarkerClick,
  className = ''
}) => {
  // Get cafe-specific configuration
  const cafeConfig = SERVICE_CONFIGS.cafe;

  // Process filters for cafe service
  const processedFilters = {
    amenities: filters.amenities || [],
    isOpenOnly: filters.isOpenOnly || false,
    ...filters
  };

  // Custom marker click handler for cafe
  const handleMarkerClick = (markerData) => {
    console.log('Cafe marker clicked:', markerData);
    
    // Add cafe-specific logic here
    // For example, check if cafe is currently open
    if (markerData.serviceData?.isOpen) {
      console.log('Cafe is currently open');
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
      serviceType="cafe"
      serviceConfig={cafeConfig}
      onError={(error, errorInfo) => {
        console.error('CafeMapView Error:', error);
        // Could send to monitoring service
      }}
    >
      <BaseServiceMapView
        userLocation={userLocation}
        rawMarkers={markers}
        serviceType="cafe"
        filters={processedFilters}
        onMarkerClick={handleMarkerClick}
        className={`cafe-map ${className}`}
        customConfig={{
          // Override default config if needed
          markerIcon: '☕',
          accentColor: '#4ECDC4',
          backgroundColor: '#F0FDFC',
          // Show status indicators for cafes
          statusIndicators: true,
        }}
      />
    </ServiceMapErrorBoundary>
  );
};

export default CafeMapView;