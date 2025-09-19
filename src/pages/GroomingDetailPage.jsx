import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import allGroomings from '../data/grooming.json'; // Assuming grooming data is here

const GroomingDetailPage = () => {
  const { groomingId } = useParams();
  const [grooming, setGrooming] = useState(null);

  useEffect(() => {
    // Find the grooming shop directly from the local JSON data
    const foundGrooming = allGroomings.find(g => g.id === groomingId);
    setGrooming(foundGrooming);
  }, [groomingId]);

  if (!grooming) {
    return <div>Loading grooming details...</div>;
  }

  return (
    <div>
      <h1>{grooming.name}</h1>
      <p>Address: {grooming.address}</p>
      <p>Phone: {grooming.phone}</p>
      <p>Description: {grooming.description}</p>
      {/* Display other grooming details as needed */}
    </div>
  );
};

export default GroomingDetailPage;