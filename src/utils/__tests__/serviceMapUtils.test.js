// src/utils/__tests__/serviceMapUtils.test.js

import {
  generateServiceMarkers,
  filterServiceMarkers,
  calculateDistance,
  sortMarkersByDistance
} from '../serviceMapUtils';

describe('Service Map Utils', () => {
  const mockRawData = [
    {
      id: '1',
      lat: 37.5665,
      lng: 126.9780,
      name: 'Test Grooming 1',
      services: ['full-grooming', 'bathing'],
      targetAnimals: ['dog', 'cat'],
      priceRange: 'medium',
      rating: 4.5
    },
    {
      id: '2',
      lat: 37.5675,
      lng: 126.9790,
      name: 'Test Grooming 2',
      services: ['nail-trimming'],
      targetAnimals: ['dog'],
      priceRange: 'low',
      rating: 4.0
    }
  ];

  describe('generateServiceMarkers', () => {
    it('generates grooming markers correctly', () => {
      const markers = generateServiceMarkers(mockRawData, 'grooming');
      
      expect(markers).toHaveLength(2);
      expect(markers[0]).toMatchObject({
        id: '1',
        serviceType: 'grooming',
        serviceData: expect.objectContaining({
          services: ['full-grooming', 'bathing'],
          petTypes: ['dog', 'cat'],
          priceRange: 'medium',
          rating: 4.5
        })
      });
    });

    it('generates cafe markers correctly', () => {
      const cafeData = [
        {
          id: '1',
          lat: 37.5665,
          lng: 126.9780,
          name: 'Test Cafe',
          amenities: ['wifi', 'pet-friendly'],
          isOpen: true,
          openingHours: '09:00-22:00'
        }
      ];

      const markers = generateServiceMarkers(cafeData, 'cafe');
      
      expect(markers[0].serviceData).toMatchObject({
        amenities: ['wifi', 'pet-friendly'],
        isOpen: true,
        openingHours: '09:00-22:00'
      });
    });

    it('handles invalid data gracefully', () => {
      const invalidData = [
        { id: '1' }, // Missing coordinates
        { lat: 'invalid', lng: 'invalid', name: 'Invalid' }, // Invalid coordinates
        null,
        undefined
      ];

      const markers = generateServiceMarkers(invalidData, 'grooming');
      expect(markers).toHaveLength(0);
    });

    it('returns empty array for non-array input', () => {
      expect(generateServiceMarkers(null, 'grooming')).toEqual([]);
      expect(generateServiceMarkers(undefined, 'grooming')).toEqual([]);
      expect(generateServiceMarkers('invalid', 'grooming')).toEqual([]);
    });
  });

  describe('filterServiceMarkers', () => {
    let markers;

    beforeEach(() => {
      markers = generateServiceMarkers(mockRawData, 'grooming');
    });

    it('filters by grooming services', () => {
      const filters = { services: ['full-grooming'] };
      const filtered = filterServiceMarkers(markers, filters, 'grooming');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Test Grooming 1');
    });

    it('filters by pet types', () => {
      const filters = { petTypes: ['cat'] };
      const filtered = filterServiceMarkers(markers, filters, 'grooming');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Test Grooming 1');
    });

    it('filters by price range', () => {
      const filters = { priceRanges: ['low'] };
      const filtered = filterServiceMarkers(markers, filters, 'grooming');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Test Grooming 2');
    });

    it('applies multiple filters', () => {
      const filters = {
        services: ['full-grooming'],
        petTypes: ['dog'],
        priceRanges: ['medium']
      };
      const filtered = filterServiceMarkers(markers, filters, 'grooming');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Test Grooming 1');
    });

    it('returns all markers when no filters applied', () => {
      const filtered = filterServiceMarkers(markers, {}, 'grooming');
      expect(filtered).toHaveLength(2);
    });

    it('handles invalid inputs gracefully', () => {
      expect(filterServiceMarkers(null, {}, 'grooming')).toEqual([]);
      expect(filterServiceMarkers(markers, null, 'grooming')).toEqual(markers);
    });
  });

  describe('calculateDistance', () => {
    it('calculates distance between two points', () => {
      const point1 = { lat: 37.5665, lng: 126.9780 };
      const point2 = { lat: 37.5675, lng: 126.9790 };
      
      const distance = calculateDistance(point1, point2);
      
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(2); // Should be less than 2km
    });

    it('returns 0 for same points', () => {
      const point = { lat: 37.5665, lng: 126.9780 };
      const distance = calculateDistance(point, point);
      
      expect(distance).toBe(0);
    });
  });

  describe('sortMarkersByDistance', () => {
    it('sorts markers by distance from user location', () => {
      const userLocation = { lat: 37.5665, lng: 126.9780 };
      const markers = generateServiceMarkers(mockRawData, 'grooming');
      
      const sorted = sortMarkersByDistance(markers, userLocation);
      
      expect(sorted).toHaveLength(2);
      // First marker should be closer (same coordinates as user)
      expect(sorted[0].name).toBe('Test Grooming 1');
    });

    it('returns original array when no user location', () => {
      const markers = generateServiceMarkers(mockRawData, 'grooming');
      const sorted = sortMarkersByDistance(markers, null);
      
      expect(sorted).toEqual(markers);
    });

    it('handles invalid inputs gracefully', () => {
      const userLocation = { lat: 37.5665, lng: 126.9780 };
      
      expect(sortMarkersByDistance(null, userLocation)).toEqual([]);
      expect(sortMarkersByDistance([], userLocation)).toEqual([]);
    });
  });
});