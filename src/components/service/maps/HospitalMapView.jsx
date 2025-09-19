// src/components/service/maps/HospitalMapView.jsx

import React from 'react';
import BaseServiceMapView from '../../common/BaseServiceMapView';
import ServiceMapErrorBoundary from '../../common/ServiceMapErrorBoundary';
import { SERVICE_CONFIGS } from '../../../config/serviceMapConfig';

const HospitalMapView = ({ 
  userLocation, 
  markers = [], 
  filters = {},
  onMarkerClick,
  className = ''
}) => {
  // Get hospital-specific configuration
  const hospitalConfig = SERVICE_CONFIGS.hospital;

  // Process filters for hospital service
  const processedFilters = {
    specialties: filters.specialties || [],
    emergencyOnly: filters.emergencyOnly || false,
    available24h: filters.available24h || false,
    ...filters
  };

  // Custom marker click handler for hospital
  const handleMarkerClick = (markerData) => {
    console.log('Hospital marker clicked:', markerData);
    
    // Add hospital-specific logic here
    if (markerData.serviceData?.isEmergency) {
      console.log('Emergency hospital clicked');
    }
    
    if (markerData.serviceData?.is24Hours) {
      console.log('24-hour hospital clicked');
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
      serviceType="hospital"
      serviceConfig={hospitalConfig}
      onError={(error, errorInfo) => {
        console.error('HospitalMapView Error:', error);
        // Could send to monitoring service
      }}
    >
      <BaseServiceMapView
        userLocation={userLocation}
        rawMarkers={markers}
        serviceType="hospital"
        filters={processedFilters}
        onMarkerClick={handleMarkerClick}
        className={`hospital-map ${className}`}
        customConfig={{
          // Override default config if needed
          markerIcon: '🏥',
          accentColor: '#45B7D1',
          backgroundColor: '#F0F9FF',
          // Enable emergency highlighting for hospitals
          emergencyHighlight: true,
        }}
      />
    </ServiceMapErrorBoundary>
  );
};

export default HospitalMapView;