// src/components/common/FilterSection.jsx
import React, { useState } from 'react';
import styles from './FilterSection.module.css';
import searchIcon from '../../assets/search.png';

const FilterSection = ({ children, locationPlaceholder, onLocationChange }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [location, setLocation] = useState('');

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
        if (onLocationChange) {
            onLocationChange(e.target.value);
        }
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.searchAndToggle}>
                <div className={styles.filterInputWrapper}>
                    <img src={searchIcon} alt="돋보기 아이콘" className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={locationPlaceholder}
                        value={location}
                        onChange={handleLocationChange}
                        className={styles.filterInput}
                    />
                </div>
                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={styles.toggleButton}
                    aria-expanded={isFilterVisible}
                >
                    상세 필터 {isFilterVisible ? '▲' : '▼'}
                </button>
            </div>
            {isFilterVisible && (
                <div className={styles.advancedFilters}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default FilterSection;