import React, { useMemo } from 'react';
import BaseServiceMapView from '../../common/BaseServiceMapView'; // Changed import
import ServiceMapErrorBoundary from '../../common/ServiceMapErrorBoundary'; // Added import
import { generateServiceMarkers } from '../../../utils/serviceMapUtils.js'; // Import generateServiceMarkers

const GroomingMapView = ({ userLocation, rawData, serviceType, filters, onMarkerClick }) => {
  // Note: generateServiceMarkers is now called inside BaseServiceMapView
  // So, we just pass rawData as rawMarkers to BaseServiceMapView.
  // The markers prop in BaseServiceMapView is actually rawMarkers.

  return (
    <ServiceMapErrorBoundary
      userLocation={userLocation}
      rawMarkers={rawData} // Pass rawData as rawMarkers
      serviceType={serviceType}
      serviceConfig={{ /* Grooming specific config if needed */ }}
      onError={(error, errorInfo) => {
        console.error('GroomingMapView Error:', error);
      }}
    >
      <BaseServiceMapView
        userLocation={userLocation}
        rawMarkers={rawData} // Pass rawData as rawMarkers
        serviceType={serviceType}
        filters={filters}
        onMarkerClick={onMarkerClick}
        className="grooming-map"
        customConfig={{
          // Grooming specific custom config if needed
        }}
      />
    </ServiceMapErrorBoundary>
  );
};

export default GroomingMapView;