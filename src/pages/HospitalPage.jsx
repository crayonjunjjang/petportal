import React, { useEffect, useMemo, useState, useCallback } from 'react';
import HospitalMapView from '../components/service/maps/HospitalMapView';
import BusinessCardGrid from '../components/common/BusinessCardGrid';
import FilterSection from '../components/common/FilterSection';
import '../styles/hospital.css';
import Pagination from '../components/common/Pagination';
import allHospitals from '../data/hospital.json';

const ITEMS_PER_PAGE = 6;

const HospitalPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState(allHospitals); // New state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
  });

  const applyFilters = useCallback(() => {
    let filtered = allHospitals;

    if (filters.location) {
        filtered = filtered.filter(hospital => 
            hospital.name.toLowerCase().includes(filters.location.toLowerCase()) ||
            hospital.address.toLowerCase().includes(filters.location.toLowerCase()));
    }
    // Removed hospitalServices and targetAnimals filters

    setFilteredHospitals(filtered); // Update the full filtered list
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    setHospitals(paginated);

  }, [currentPage, filters]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 37.5665, lng: 126.9780 })
    );
  }, []); // Run only once on mount

  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // This useEffect will react to applyFilters changes

  const markers = useMemo(() => filteredHospitals.map(hospital => ({
    id: hospital.id,
    lat: hospital.lat,
    lng: hospital.lng,
    name: hospital.name,
    specialties: hospital.services || ['general'],
    isEmergency: hospital.services?.includes('24시 응급') || false,
    is24Hours: hospital.services?.includes('24시 응급') || false,
    phone: hospital.phone || '',
    emergencyPhone: hospital.emergencyPhone || hospital.phone || '',
    rating: hospital.rating || 4.0,
    address: hospital.address || ''
  })), [filteredHospitals]); // Depend on filteredHospitals

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  // handleToggleFilter is no longer needed
  
  const goToPage = (page) => {
    setCurrentPage(page);
  }

  return (
    <div className="hospital-container">
      <header className="hospital-header">
        <h1 className="hospital-title">동물병원</h1>
        <p className="hospital-subtitle">우리 아이를 맡길 수 있는 믿을 만한 동물병원을 찾아보세요</p>
      </header>

      <div className="mapWrapper">
        <HospitalMapView 
          userLocation={userLocation} 
          markers={markers}
          filters={{
            specialties: filters.hospitalServices || [],
            emergencyOnly: (filters.hospitalServices || []).includes('24시 응급'),
            available24h: (filters.hospitalServices || []).includes('24시 응급')
          }}
          onMarkerClick={(markerData) => {
            console.log('Hospital marker clicked:', markerData);
          }}
        />
        <div className="filtersOnMap">
          <FilterSection
            locationPlaceholder="병원이름이나 지역을 검색해보세요"
            onLocationChange={(value) => handleFilterChange('location', value)}>
          </FilterSection>
        </div>
      </div>

      <div className="hospital-grid">
        <BusinessCardGrid items={hospitals.map(h => ({ ...h, type: 'hospital' }))} />
      </div>

      {hospitals.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default HospitalPage;