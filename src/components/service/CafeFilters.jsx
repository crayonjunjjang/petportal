// src/components/service/CafeFilters.jsx
import React from 'react';
import styles from './ServiceFilters.module.css';

const CafeFilters = ({ filters, onFilterChange, searchTerm, onSearchChange }) => {
  const handleServiceToggle = (service) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    onFilterChange('services', newServices);
  };

  return (
    <div className={styles.filtersContainer}>
      <h3 className={styles.filtersTitle}>검색 및 필터</h3>
      
      {/* 검색 */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>카페 검색</label>
        <input
          type="text"
          placeholder="카페명이나 지역을 검색해보세요"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* 운영 시간 */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>운영 시간</label>
        <div className={styles.timeInputs}>
          <select 
            value={filters.startTime || ''} 
            onChange={(e) => onFilterChange('startTime', e.target.value)}
            className={styles.timeSelect}
          >
            <option value="">시작 시간</option>
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, '0');
              return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
            })}
          </select>
          <span className={styles.timeSeparator}>~</span>
          <select 
            value={filters.endTime || ''} 
            onChange={(e) => onFilterChange('endTime', e.target.value)}
            className={styles.timeSelect}
          >
            <option value="">종료 시간</option>
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, '0');
              return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
            })}
          </select>
        </div>
      </div>

      {/* 서비스 */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>서비스</label>
        <div className={styles.checkboxGrid}>
          {[
            '애견음료', '대형견 가능', '야외 테라스', 
            '고양이 전용 공간', '실내놀이터', '포토존', 
            '굿즈', '보드게임', '수제 간식'
          ].map(service => (
            <label key={service} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.services.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>{service}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 예약 */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>예약</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="reservation"
              checked={filters.requiresReservation === null}
              onChange={() => onFilterChange('requiresReservation', null)}
              className={styles.radio}
            />
            <span className={styles.radioText}>전체</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="reservation"
              checked={filters.requiresReservation === false}
              onChange={() => onFilterChange('requiresReservation', false)}
              className={styles.radio}
            />
            <span className={styles.radioText}>예약 불필요</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="reservation"
              checked={filters.requiresReservation === true}
              onChange={() => onFilterChange('requiresReservation', true)}
              className={styles.radio}
            />
            <span className={styles.radioText}>예약 필수</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CafeFilters;