// src/components/common/ServiceMapErrorBoundary.jsx

import React from 'react';
import SimpleMapView from './SimpleMapView';

class ServiceMapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Service Map Error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to monitoring service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback to SimpleMapView with service-specific styling
      const { userLocation, markers, serviceType, serviceConfig } = this.props;
      
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <SimpleMapView 
            userLocation={userLocation} 
            markers={markers}
            serviceType={serviceType}
            serviceConfig={serviceConfig}
          />
          
          {/* Error indicator */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: '12px',
            color: '#d32f2f',
            zIndex: 1000
          }}>
            ⚠️ 지도 오류 발생 - 대체 지도 사용 중
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ServiceMapErrorBoundary;