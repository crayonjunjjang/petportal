// src/components/common/BusinessList.jsx
import React, { useState } from 'react';
import BusinessListItem from './BusinessListItem';
import styles from './BusinessList.module.css';

const BusinessList = ({ items }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (itemId) => {
    setExpandedId(prevId => (prevId === itemId ? null : itemId));
  };

  if (!items || items.length === 0) {
    return <div className={styles.noResults}>표시할 업체가 없습니다.</div>;
  }

  return (
    <ul className={styles.listContainer}>
      {items.map((item) => (
        <BusinessListItem
          key={item.id}
          item={item}
          isExpanded={item.id === expandedId}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </ul>
  );
};

export default BusinessList;