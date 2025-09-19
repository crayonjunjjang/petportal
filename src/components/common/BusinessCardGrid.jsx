// src/components/common/BusinessCardGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card'; // Adjust path if necessary

const BusinessCardGrid = ({ items }) => {
  if (!items || items.length === 0) {
    return <div style={{ textAlign: 'center', padding: '48px 20px', color: '#666' }}>표시할 업체가 없습니다.</div>;
  }

  return (
    <>
      {items.map((item) => (
        <Link to={`/${item.type || 'item'}/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
          <Card item={item} type="business" />
        </Link>
      ))}
    </>
  );
};

export default BusinessCardGrid;