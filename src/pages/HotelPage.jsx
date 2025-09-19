// src/pages/HotelPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import HotelMapView from '../components/service/maps/HotelMapView';
import BusinessCardGrid from '../components/common/BusinessCardGrid';
import FilterSection from '../components/common/FilterSection';
import '../styles/hotel.css';
import Pagination from '../components/common/Pagination';
import allHotels from '../data/hotel.json';
import GuestPetSelector from '../components/pension/GuestPetSelector';

const ITEMS_PER_PAGE = 6;

const HotelPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    startDate: '',
    endDate: '',
    priceRange: { min: 0, max: 100000 },
    hotelServices: [],
    targetAnimals: []
  });
  const [guests, setGuests] = useState(1);
  const [pets, setPets] = useState(0);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const applyFilters = useCallback(() => {
    let filtered = allHotels;

    if (filters.location) {
        filtered = filtered.filter(hotel => 
            hotel.name.toLowerCase().includes(filters.location.toLowerCase()) ||
            hotel.address.toLowerCase().includes(filters.location.toLowerCase())
        );
    }
    filtered = filtered.filter(hotel => (hotel.pricePerNight ?? 0) >= filters.priceRange.min && (hotel.pricePerNight ?? 0) <= filters.priceRange.max);
    if (filters.hotelServices.length > 0) {
        filtered = filtered.filter(hotel => filters.hotelServices.every(service => (hotel.services || []).includes(service)));
    }
    if (filters.targetAnimals.length > 0) {
        filtered = filtered.filter(hotel => filters.targetAnimals.every(animal => (hotel.targetAnimals || []).includes(animal)));
    }

    // Filter by guests and pets
    filtered = filtered.filter(hotel => {
      const maxGuests = hotel.maxGuests || 10; // Assuming maxGuests property in hotel data
      const petsAllowed = hotel.petsAllowed !== undefined ? hotel.petsAllowed : true; // Assuming petsAllowed property

      return guests <= maxGuests && (pets === 0 || petsAllowed);
    });

    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    setHotels(paginated);

  }, [currentPage, filters, guests, pets]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 37.5665, lng: 126.9780 })
    );
    applyFilters();
  }, [applyFilters]);

  const markers = useMemo(() => allHotels.map(hotel => ({
    id: hotel.id,
    lat: hotel.lat,
    lng: hotel.lng,
    name: hotel.name,
    petPolicy: {
      allowed: hotel.petFriendly || false,
      fee: hotel.petFee || 0,
      restrictions: hotel.petRestrictions || []
    },
    petAmenities: hotel.services?.filter(service => 
      ['pet-beds', 'pet-food', 'pet-sitting', 'pet-park', 'pet-spa'].includes(service)
    ) || [],
    roomTypes: hotel.roomTypes || ['standard'],
    priceRange: hotel.pricePerNight > 200000 ? 'luxury' : 
                hotel.pricePerNight > 100000 ? 'mid-range' : 'budget',
    rating: hotel.rating || 4.0,
    phone: hotel.phone || '',
    address: hotel.address || ''
  })), []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };
  
  const goToPage = (page) => {
    setCurrentPage(page);
  }

  return (
    <div className="hotel-container">
      <header className="pageHeader">
        <h1 className="pageTitle">펫 호텔</h1>
        <p className="pageSubtitle">반려동물과 편안하게 머무를 수 있는 호텔을 찾아보세요</p>
      </header>
      <div className="mapWrapper">
        <HotelMapView 
          userLocation={userLocation} 
          markers={markers}
          filters={{
            petFriendly: filters.targetAnimals.length > 0,
            petAmenities: filters.hotelServices,
            priceRanges: []
          }}
          onMarkerClick={(markerData) => {
            console.log('Hotel marker clicked:', markerData);
          }}
        />
        <div className="filtersOnMap">
          <FilterSection
            locationPlaceholder="호텔명이나 지역을 검색해보세요"
            onLocationChange={(value) => handleFilterChange('location', value)}>
            <div className="filterGroup">
              <label className="filterLabel">체크인/아웃</label>
              <div className="filterInputWrapper">
                <input 
                  type="date" 
                  value={filters.startDate} 
                  onChange={(e) => handleFilterChange('startDate', e.target.value)} 
                  className="filterInput" 
                />
              </div>
              <div className="filterInputWrapper">
                <input 
                  type="date" 
                  value={filters.endDate} 
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="filterInput"
                />
              </div>
            </div>
            <div className="filterGroup" style={{ position: 'relative' }}>
              <label htmlFor="guests">인원 및 반려동물</label>
              <input 
                type="text" 
                placeholder={`게스트 ${guests}명, 반려동물 ${pets}마리`}
                onClick={() => setShowGuestSelector(!showGuestSelector)}
                readOnly
              />
              {showGuestSelector && (
                <div className="guestSelectorDropdown">
                  <GuestPetSelector 
                    guests={guests} 
                    setGuests={setGuests} 
                    pets={pets} 
                    setPets={setPets}
                    maxGuests={10}
                  />
                </div>
              )}
            </div>
          </FilterSection>
        </div>
      </div>
      <div className="hotel-grid">
        <BusinessCardGrid items={hotels.map(h => ({ ...h, type: 'hotel' }))} />
      </div>

      {hotels.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default HotelPage;
