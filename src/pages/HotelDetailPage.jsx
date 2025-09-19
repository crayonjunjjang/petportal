import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import allHotels from '../data/hotel.json'; // Assuming hotel data is here

const HotelDetailPage = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch data from an API
    // For now, we'll find the hotel from the local JSON data
    const foundHotel = allHotels.find(h => h.id === hotelId);
    setHotel(foundHotel);
  }, [hotelId]);

  if (!hotel) {
    return <div>Loading hotel details...</div>;
  }

  return (
    <div>
      <h1>{hotel.name}</h1>
      <p>Address: {hotel.address}</p>
      <p>Phone: {hotel.phone}</p>
      <p>Rating: {hotel.rating}</p>
      {/* Display other hotel details as needed */}
    </div>
  );
};

export default HotelDetailPage;