import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import allHospitals from '../data/hospital.json'; // Assuming hospital data is here

const HospitalDetailPage = () => {
  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    // Find the hospital directly from the local JSON data
    const foundHospital = allHospitals.find(h => h.id === hospitalId);
    setHospital(foundHospital);
  }, [hospitalId]);

  if (!hospital) {
    return <div>Loading hospital details...</div>;
  }

  return (
    <div>
      <h1>{hospital.name}</h1>
      <p>Address: {hospital.address}</p>
      <p>Phone: {hospital.phone}</p>
      <p>Rating: {hospital.rating}</p>
      {/* Display other hospital details as needed */}
    </div>
  );
};

export default HospitalDetailPage;