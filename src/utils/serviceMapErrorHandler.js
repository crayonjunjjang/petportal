// src/utils/serviceMapErrorHandler.js

// Error types for service maps
export const SERVICE_MAP_ERROR_TYPES = {
  KAKAO_API_LOAD_FAILED: 'KAKAO_API_LOAD_FAILED',
  KAKAO_API_KEY_MISSING: 'KAKAO_API_KEY_MISSING',
  MAP_CREATION_FAILED: 'MAP_CREATION_FAILED',
  MARKER_CREATION_FAILED: 'MARKER_CREATION_FAILED',
  GEOLOCATION_FAILED: 'GEOLOCATION_FAILED',
  SERVICE_DATA_INVALID: 'SERVICE_DATA_INVALID',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Service map error class
export class ServiceMapError extends Error {
  constructor(type, message, severity = ERROR_SEVERITY.MEDIUM, originalError = null) {
    super(message);
    this.name = 'ServiceMapError';
    this.type = type;
    this.severity = severity;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

// Error handler class
export class ServiceMapErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.listeners = [];
  }

  // Log error with context
  logError(error, context = {}) {
    const errorEntry = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        type: error.type || SERVICE_MAP_ERROR_TYPES.UNKNOWN_ERROR,
        severity: error.severity || ERROR_SEVERITY.MEDIUM,
        stack: error.stack
      },
      context: {
        serviceType: context.serviceType,
        userAgent: navigator.userAgent,
        url: window.location.href,
        userLocation: context.userLocation,
        markersCount: context.markersCount,
        ...context
      }
    };

    // Add to log
    this.errorLog.unshift(errorEntry);
    
    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console logging based on severity
    this.consoleLog(errorEntry);

    // Notify listeners
    this.notifyListeners(errorEntry);

    // Send to monitoring service if available
    this.sendToMonitoring(errorEntry);

    return errorEntry.id;
  }

  // Generate unique error ID
  generateErrorId() {
    return `sme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Console logging with appropriate level
  consoleLog(errorEntry) {
    const { error, context } = errorEntry;
    const logMessage = `[ServiceMap] ${error.type}: ${error.message}`;
    
    switch (error.severity) {
      case ERROR_SEVERITY.CRITICAL:
        console.error(logMessage, { error, context });
        break;
      case ERROR_SEVERITY.HIGH:
        console.error(logMessage, { error, context });
        break;
      case ERROR_SEVERITY.MEDIUM:
        console.warn(logMessage, { error, context });
        break;
      case ERROR_SEVERITY.LOW:
        console.info(logMessage, { error, context });
        break;
      default:
        console.log(logMessage, { error, context });
    }
  }

  // Add error listener
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove error listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  notifyListeners(errorEntry) {
    this.listeners.forEach(listener => {
      try {
        listener(errorEntry);
      } catch (err) {
        console.error('Error in ServiceMapErrorHandler listener:', err);
      }
    });
  }

  // Send error to monitoring service
  sendToMonitoring(errorEntry) {
    // Skip in development
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    try {
      // This would integrate with your monitoring service
      // For example: Sentry, LogRocket, DataDog, etc.
      
      // Example implementation:
      // if (window.Sentry) {
      //   window.Sentry.captureException(new Error(errorEntry.error.message), {
      //     tags: {
      //       component: 'ServiceMap',
      //       serviceType: errorEntry.context.serviceType,
      //       errorType: errorEntry.error.type
      //     },
      //     extra: errorEntry.context
      //   });
      // }

      console.log('Would send to monitoring service:', errorEntry);
    } catch (err) {
      console.error('Failed to send error to monitoring service:', err);
    }
  }

  // Get error statistics
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      bySeverity: {},
      byType: {},
      byServiceType: {},
      recent: this.errorLog.slice(0, 10)
    };

    this.errorLog.forEach(entry => {
      const { error, context } = entry;
      
      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      
      // Count by type
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      
      // Count by service type
      if (context.serviceType) {
        stats.byServiceType[context.serviceType] = (stats.byServiceType[context.serviceType] || 0) + 1;
      }
    });

    return stats;
  }

  // Clear error log
  clearLog() {
    this.errorLog = [];
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error) {
    switch (error.type) {
      case SERVICE_MAP_ERROR_TYPES.KAKAO_API_KEY_MISSING:
        return '지도 서비스 설정에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
      
      case SERVICE_MAP_ERROR_TYPES.KAKAO_API_LOAD_FAILED:
        return '지도를 불러오는 중 문제가 발생했습니다. 인터넷 연결을 확인해주세요.';
      
      case SERVICE_MAP_ERROR_TYPES.MAP_CREATION_FAILED:
        return '지도를 생성할 수 없습니다. 페이지를 새로고침해주세요.';
      
      case SERVICE_MAP_ERROR_TYPES.GEOLOCATION_FAILED:
        return '위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.';
      
      case SERVICE_MAP_ERROR_TYPES.NETWORK_ERROR:
        return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.';
      
      default:
        return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }
}

// Global error handler instance
export const serviceMapErrorHandler = new ServiceMapErrorHandler();

// Helper functions for common error scenarios
export const handleKakaoMapError = (error, context) => {
  let errorType = SERVICE_MAP_ERROR_TYPES.UNKNOWN_ERROR;
  let severity = ERROR_SEVERITY.MEDIUM;

  if (error.message.includes('API key')) {
    errorType = SERVICE_MAP_ERROR_TYPES.KAKAO_API_KEY_MISSING;
    severity = ERROR_SEVERITY.HIGH;
  } else if (error.message.includes('load') || error.message.includes('script')) {
    errorType = SERVICE_MAP_ERROR_TYPES.KAKAO_API_LOAD_FAILED;
    severity = ERROR_SEVERITY.HIGH;
  } else if (error.message.includes('Map')) {
    errorType = SERVICE_MAP_ERROR_TYPES.MAP_CREATION_FAILED;
    severity = ERROR_SEVERITY.MEDIUM;
  }

  const serviceMapError = new ServiceMapError(errorType, error.message, severity, error);
  return serviceMapErrorHandler.logError(serviceMapError, context);
};

export const handleMarkerError = (error, context) => {
  const serviceMapError = new ServiceMapError(
    SERVICE_MAP_ERROR_TYPES.MARKER_CREATION_FAILED,
    `마커 생성 실패: ${error.message}`,
    ERROR_SEVERITY.LOW,
    error
  );
  return serviceMapErrorHandler.logError(serviceMapError, context);
};

export const handleGeolocationError = (error, context) => {
  const serviceMapError = new ServiceMapError(
    SERVICE_MAP_ERROR_TYPES.GEOLOCATION_FAILED,
    `위치 정보 가져오기 실패: ${error.message}`,
    ERROR_SEVERITY.LOW,
    error
  );
  return serviceMapErrorHandler.logError(serviceMapError, context);
};

export const handleNetworkError = (error, context) => {
  const serviceMapError = new ServiceMapError(
    SERVICE_MAP_ERROR_TYPES.NETWORK_ERROR,
    `네트워크 오류: ${error.message}`,
    ERROR_SEVERITY.MEDIUM,
    error
  );
  return serviceMapErrorHandler.logError(serviceMapError, context);
};

// Performance monitoring
export class ServiceMapPerformanceMonitor {
  constructor() {
    this.metrics = {};
  }

  // Start timing
  startTiming(operation, context = {}) {
    const key = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.metrics[key] = {
      operation,
      startTime: performance.now(),
      context
    };
    return key;
  }

  // End timing
  endTiming(key) {
    if (!this.metrics[key]) {
      console.warn('Performance timing key not found:', key);
      return null;
    }

    const metric = this.metrics[key];
    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const result = {
      operation: metric.operation,
      duration,
      context: metric.context,
      timestamp: new Date().toISOString()
    };

    // Log slow operations
    if (duration > 1000) { // More than 1 second
      console.warn(`Slow ServiceMap operation: ${metric.operation} took ${duration.toFixed(2)}ms`, result);
    }

    // Clean up
    delete this.metrics[key];

    return result;
  }

  // Get current metrics
  getMetrics() {
    return Object.values(this.metrics);
  }
}

export const serviceMapPerformanceMonitor = new ServiceMapPerformanceMonitor();