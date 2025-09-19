// src/components/service/maps/__tests__/ServiceMapComponents.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Kakao Maps API
global.kakao = {
  maps: {
    load: jest.fn((callback) => callback()),
    LatLng: jest.fn((lat, lng) => ({ lat, lng })),
    Map: jest.fn(() => ({
      addControl: jest.fn(),
      panTo: jest.fn(),
    })),
    Marker: jest.fn(() => ({
      setMap: jest.fn(),
      setImage: jest.fn(),
    })),
    InfoWindow: jest.fn(() => ({
      open: jest.fn(),
      close: jest.fn(),
    })),
    ZoomControl: jest.fn(),
    MapTypeControl: jest.fn(),
    ControlPosition: {
      RIGHT: 'right',
      TOPRIGHT: 'topright',
    },
    event: {
      addListener: jest.fn(),
    },
  },
};

// Mock loadKakaoMap utility
jest.mock('../../../utils/loadKakaoMap', () => ({
  loadKakaoMap: jest.fn(() => Promise.resolve()),
}));

import GroomingMapView from '../GroomingMapView';
import CafeMapView from '../CafeMapView';
import HospitalMapView from '../HospitalMapView';
import HotelMapView from '../HotelMapView';

describe('Service Map Components', () => {
  const mockUserLocation = { lat: 37.5665, lng: 126.9780 };
  const mockMarkers = [
    {
      id: '1',
      lat: 37.5665,
      lng: 126.9780,
      name: 'Test Location 1',
    },
    {
      id: '2',
      lat: 37.5675,
      lng: 126.9790,
      name: 'Test Location 2',
    },
  ];

  beforeEach(() => {
    // Set up environment variable
    process.env.VITE_KAKAO_JS_KEY = 'test-api-key';
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('GroomingMapView', () => {
    it('renders without crashing', () => {
      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );
      
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );
      
      expect(screen.getByText(/미용 지도 로딩 중/)).toBeInTheDocument();
    });

    it('applies grooming-specific filters', () => {
      const filters = {
        services: ['full-grooming'],
        petTypes: ['dog'],
        priceRanges: ['medium'],
      };

      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={filters}
        />
      );

      // Component should render with filters applied
      expect(screen.getByRole('application')).toHaveClass('grooming-map');
    });
  });

  describe('CafeMapView', () => {
    it('renders without crashing', () => {
      render(
        <CafeMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );
      
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('applies cafe-specific filters', () => {
      const filters = {
        amenities: ['wifi', 'pet-friendly'],
        isOpenOnly: true,
      };

      render(
        <CafeMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={filters}
        />
      );

      expect(screen.getByRole('application')).toHaveClass('cafe-map');
    });
  });

  describe('HospitalMapView', () => {
    it('renders without crashing', () => {
      render(
        <HospitalMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );
      
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('applies hospital-specific filters', () => {
      const filters = {
        specialties: ['emergency'],
        emergencyOnly: true,
        available24h: true,
      };

      render(
        <HospitalMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={filters}
        />
      );

      expect(screen.getByRole('application')).toHaveClass('hospital-map');
    });
  });

  describe('HotelMapView', () => {
    it('renders without crashing', () => {
      render(
        <HotelMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );
      
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('applies hotel-specific filters', () => {
      const filters = {
        petFriendly: true,
        petAmenities: ['pet-beds'],
        priceRanges: ['mid-range'],
      };

      render(
        <HotelMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={filters}
        />
      );

      expect(screen.getByRole('application')).toHaveClass('hotel-map');
    });
  });

  describe('Error Handling', () => {
    it('shows fallback when Kakao Maps fails to load', async () => {
      // Mock loadKakaoMap to reject
      const { loadKakaoMap } = require('../../../utils/loadKakaoMap');
      loadKakaoMap.mockRejectedValueOnce(new Error('API load failed'));

      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/지도 서비스 일시 중단/)).toBeInTheDocument();
      });
    });

    it('shows error when API key is missing', async () => {
      delete process.env.VITE_KAKAO_JS_KEY;

      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/지도 서비스 일시 중단/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );

      const mapContainer = screen.getByRole('application');
      expect(mapContainer).toHaveAttribute('aria-label', '미용 지도');
    });

    it('has skip link for keyboard users', () => {
      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );

      const skipLink = screen.getByText('지도로 건너뛰기');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveClass('skip-to-map');
    });

    it('announces marker count to screen readers', () => {
      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );

      const announcement = screen.getByText(/개의 미용 위치가 표시됩니다/);
      expect(announcement).toBeInTheDocument();
      expect(announcement.parentElement).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes', () => {
      render(
        <GroomingMapView
          userLocation={mockUserLocation}
          markers={mockMarkers}
          filters={{}}
        />
      );

      const mapContainer = screen.getByRole('application');
      expect(mapContainer).toHaveClass('service-map-container');
      expect(mapContainer).toHaveClass('grooming-map');
    });
  });
});