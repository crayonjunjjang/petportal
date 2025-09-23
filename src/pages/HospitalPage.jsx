import React, { useEffect, useMemo, useState, useCallback } from 'react';
import HospitalMapView from '../components/service/maps/HospitalMapView';
import BusinessCardGrid from '../components/common/BusinessCardGrid';
import FilterSection from '../components/common/FilterSection';
import '../styles/hospital.css';
import Pagination from '../components/common/Pagination';
import hospitalData from '../data/hospital.json';

const HospitalPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    appointment: '',
    hospitalServices: [],
    targetAnimals: []
  });

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Simulate data fetching and filtering
    setLoading(true);
    setTimeout(() => {
      let result = hospitalData;

      if (filters.location) {
        result = result.filter(hospital => 
            hospital.name.toLowerCase().includes(filters.location.toLowerCase()) ||
            hospital.address.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.hospitalServices.length > 0) {
          result = result.filter(hospital => filters.hospitalServices.every(service => (hospital.specialties || []).includes(service)));
      }
      if (filters.targetAnimals.length > 0) {
          result = result.filter(hospital => filters.targetAnimals.every(animal => (hospital.targetAnimals || []).includes(animal)));
      }

      setHospitals(result);
      setLoading(false);
    }, 500);
  }, [filters]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        setError(new Error('위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.'));
        setUserLocation({ lat: 37.5665, lng: 126.9780 }); // Default to Seoul
      }
    );
  }, []);

  const markers = useMemo(() => hospitals.map(hospital => ({
    id: hospital.id,
    lat: hospital.lat,
    lng: hospital.lng,
    name: hospital.name,
    specialties: hospital.specialties || ['general'],
    isEmergency: hospital.isEmergency || false,
    is24Hours: hospital.is24Hours || false,
    phone: hospital.phone || '',
    emergencyPhone: hospital.emergencyPhone || hospital.phone || '',
    rating: hospital.rating || 4.0,
    address: hospital.address || '',
  })), [hospitals]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleToggleFilter = (filterType, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(hospitals.length / itemsPerPage);
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const currentHospitals = hospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) {
    return <div className="pageContainer" style={{ color: 'red' }}>오류: {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}</div>;
  }

  if (loading) {
    return <div className="pageContainer">병원 정보를 불러오는 중...</div>;
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
            specialties: filters.hospitalServices,
            emergencyOnly: filters.hospitalServices.includes('24시 응급'),
            available24h: filters.hospitalServices.includes('24시 응급')
          }}
          onMarkerClick={(markerData) => {
            console.log('Hospital marker clicked:', markerData);
            // Could show detailed popup or navigate to detail page
          }}
        />
        <div className="filtersOnMap">
          <FilterSection
            locationPlaceholder="병원이름이나 지역을 검색해보세요"
            onLocationChange={(value) => handleFilterChange('location', value)}
          >
            <div className="filterGroup">
              <label className="filterLabel">진료 종류</label>
              <div className="pillButtonContainer">
                {['24시 응급', '내과', '외과', '치과', '심장 전문', 'MRI/CT'].map(type => (
                  <button key={type} onClick={() => handleToggleFilter('hospitalServices', type)} className={`hospital-filter-btn ${filters.hospitalServices.includes(type) ? 'active' : ''}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="filterGroup">
              <label className="filterLabel">대상 동물</label>
              <div className="pillButtonContainer">
                {['강아지', '고양이', '특수동물'].map(animal => (
                  <button key={animal} onClick={() => handleToggleFilter('targetAnimals', animal)} className={`hospital-filter-btn ${filters.targetAnimals.includes(animal) ? 'active' : ''}`}>
                    {animal}
                  </button>
                ))}
              </div>
            </div>
          </FilterSection>
        </div>
      </div>

      <div className="hospital-grid">
        <BusinessCardGrid items={currentHospitals.map(h => ({ ...h, type: 'hospital', images: h.imageUrl ? [h.imageUrl] : [] }))} />
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
