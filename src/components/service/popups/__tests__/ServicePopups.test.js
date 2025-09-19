// src/components/service/popups/__tests__/ServicePopups.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroomingPopup from '../GroomingPopup';
import CafePopup from '../CafePopup';
import HospitalPopup from '../HospitalPopup';
import HotelPopup from '../HotelPopup';

describe('Service Popup Components', () => {
  describe('GroomingPopup', () => {
    const mockGroomingData = {
      name: 'Test Grooming Salon',
      serviceData: {
        services: ['full-grooming', 'bathing'],
        petTypes: ['dog', 'cat'],
        priceRange: 'medium',
        rating: 4.5,
        phone: '02-1234-5678',
        address: '서울시 강남구 테스트로 123'
      }
    };

    it('renders grooming information correctly', () => {
      render(<GroomingPopup data={mockGroomingData} />);
      
      expect(screen.getByText('Test Grooming Salon')).toBeInTheDocument();
      expect(screen.getByText('풀 그루밍')).toBeInTheDocument();
      expect(screen.getByText('목욕')).toBeInTheDocument();
      expect(screen.getByText('강아지')).toBeInTheDocument();
      expect(screen.getByText('고양이')).toBeInTheDocument();
      expect(screen.getByText('보통 (3-6만원)')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('handles missing service data gracefully', () => {
      const minimalData = { name: 'Minimal Grooming' };
      render(<GroomingPopup data={minimalData} />);
      
      expect(screen.getByText('Minimal Grooming')).toBeInTheDocument();
    });

    it('calls phone number when phone link clicked', () => {
      // Mock window.open
      const mockOpen = jest.fn();
      global.window.open = mockOpen;

      render(<GroomingPopup data={mockGroomingData} />);
      
      const phoneLink = screen.getByText('📞 02-1234-5678');
      fireEvent.click(phoneLink);
      
      expect(mockOpen).toHaveBeenCalledWith('tel:02-1234-5678');
    });
  });

  describe('CafePopup', () => {
    const mockCafeData = {
      name: 'Test Pet Cafe',
      serviceData: {
        amenities: ['wifi', 'pet-friendly', 'outdoor-seating'],
        specialties: ['espresso', 'desserts'],
        isOpen: true,
        openingHours: '09:00-22:00',
        rating: 4.2,
        phone: '02-2345-6789',
        address: '서울시 홍대 테스트로 456'
      }
    };

    it('renders cafe information correctly', () => {
      render(<CafePopup data={mockCafeData} />);
      
      expect(screen.getByText('Test Pet Cafe')).toBeInTheDocument();
      expect(screen.getByText('🟢 영업중')).toBeInTheDocument();
      expect(screen.getByText('WiFi')).toBeInTheDocument();
      expect(screen.getByText('반려동물 동반')).toBeInTheDocument();
      expect(screen.getByText('에스프레소')).toBeInTheDocument();
      expect(screen.getByText('4.2')).toBeInTheDocument();
    });

    it('shows closed status correctly', () => {
      const closedCafeData = {
        ...mockCafeData,
        serviceData: { ...mockCafeData.serviceData, isOpen: false }
      };
      
      render(<CafePopup data={closedCafeData} />);
      expect(screen.getByText('🔴 영업종료')).toBeInTheDocument();
    });

    it('displays current time', () => {
      render(<CafePopup data={mockCafeData} />);
      expect(screen.getByText(/현재 시간:/)).toBeInTheDocument();
    });
  });

  describe('HospitalPopup', () => {
    const mockHospitalData = {
      name: 'Test Animal Hospital',
      serviceData: {
        specialties: ['general', 'surgery', 'emergency'],
        isEmergency: true,
        is24Hours: true,
        phone: '02-3456-7890',
        emergencyPhone: '02-3456-7891',
        rating: 4.8,
        address: '서울시 서초구 테스트로 789'
      }
    };

    it('renders hospital information correctly', () => {
      render(<HospitalPopup data={mockHospitalData} />);
      
      expect(screen.getByText('Test Animal Hospital')).toBeInTheDocument();
      expect(screen.getByText('🚨 응급실 운영')).toBeInTheDocument();
      expect(screen.getByText('⏰ 24시간 운영')).toBeInTheDocument();
      expect(screen.getByText('일반진료')).toBeInTheDocument();
      expect(screen.getByText('외과')).toBeInTheDocument();
      expect(screen.getByText('4.8')).toBeInTheDocument();
    });

    it('shows emergency contact information', () => {
      render(<HospitalPopup data={mockHospitalData} />);
      
      expect(screen.getByText('📞 일반: 02-3456-7890')).toBeInTheDocument();
      expect(screen.getByText('🚨 응급: 02-3456-7891')).toBeInTheDocument();
    });

    it('displays emergency notice', () => {
      render(<HospitalPopup data={mockHospitalData} />);
      
      expect(screen.getByText('응급상황 시 119에 먼저 연락하시기 바랍니다.')).toBeInTheDocument();
    });

    it('shows emergency call button', () => {
      render(<HospitalPopup data={mockHospitalData} />);
      
      const emergencyButton = screen.getByText('응급전화');
      expect(emergencyButton).toBeInTheDocument();
      expect(emergencyButton).toHaveClass('emergency');
    });
  });

  describe('HotelPopup', () => {
    const mockHotelData = {
      name: 'Test Pet Hotel',
      serviceData: {
        petPolicy: {
          allowed: true,
          fee: 20000,
          restrictions: ['소형견만 가능', '예방접종 필수']
        },
        petAmenities: ['pet-beds', 'pet-food', 'pet-sitting'],
        roomTypes: ['standard', 'deluxe'],
        priceRange: 'mid-range',
        rating: 4.3,
        phone: '02-4567-8901',
        address: '서울시 강서구 테스트로 101'
      }
    };

    it('renders hotel information correctly', () => {
      render(<HotelPopup data={mockHotelData} />);
      
      expect(screen.getByText('Test Pet Hotel')).toBeInTheDocument();
      expect(screen.getByText('🐕 반려동물 동반 가능')).toBeInTheDocument();
      expect(screen.getByText('추가 요금: 20,000원/박')).toBeInTheDocument();
      expect(screen.getByText('반려동물 침대')).toBeInTheDocument();
      expect(screen.getByText('중급형 (10-20만원)')).toBeInTheDocument();
      expect(screen.getByText('4.3')).toBeInTheDocument();
    });

    it('shows pet policy restrictions', () => {
      render(<HotelPopup data={mockHotelData} />);
      
      expect(screen.getByText('소형견만 가능')).toBeInTheDocument();
      expect(screen.getByText('예방접종 필수')).toBeInTheDocument();
    });

    it('displays pet notice', () => {
      render(<HotelPopup data={mockHotelData} />);
      
      expect(screen.getByText('반려동물 동반 시 사전 예약이 필요할 수 있습니다.')).toBeInTheDocument();
    });

    it('shows not allowed status for non-pet-friendly hotels', () => {
      const nonPetHotelData = {
        ...mockHotelData,
        serviceData: {
          ...mockHotelData.serviceData,
          petPolicy: { allowed: false, fee: 0, restrictions: [] }
        }
      };
      
      render(<HotelPopup data={nonPetHotelData} />);
      expect(screen.getByText('❌ 반려동물 동반 불가')).toBeInTheDocument();
    });
  });

  describe('Common Popup Features', () => {
    it('renders close button when onClose provided', () => {
      const mockClose = jest.fn();
      render(<GroomingPopup data={{ name: 'Test' }} onClose={mockClose} />);
      
      const closeButton = screen.getByText('×');
      expect(closeButton).toBeInTheDocument();
      
      fireEvent.click(closeButton);
      expect(mockClose).toHaveBeenCalled();
    });

    it('renders action buttons', () => {
      const mockData = { name: 'Test', serviceData: { phone: '02-1234-5678' } };
      render(<GroomingPopup data={mockData} />);
      
      expect(screen.getByText('길찾기')).toBeInTheDocument();
      expect(screen.getByText('전화하기')).toBeInTheDocument();
    });

    it('opens Google Maps when directions clicked', () => {
      const mockOpen = jest.fn();
      global.window.open = mockOpen;

      const mockData = { name: 'Test Location' };
      render(<GroomingPopup data={mockData} />);
      
      const directionsButton = screen.getByText('길찾기');
      fireEvent.click(directionsButton);
      
      expect(mockOpen).toHaveBeenCalledWith(
        'https://www.google.com/maps/search/Test%20Location',
        '_blank'
      );
    });
  });
});