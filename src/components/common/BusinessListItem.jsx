// src/components/common/BusinessListItem.jsx
import React, { useState } from 'react';
import styles from './BusinessList.module.css';

const BusinessListItem = ({ item, isExpanded, onToggle }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const {
        name, rating, reviews, distanceKm, services, address, phone, description, images,
        availableNow, isOpen,
        pricePerNight, operatingHours, openHour, closeHour
    } = item;

    // Status logic
    let statusText = '';
    let statusClass = '';
    if (isOpen !== undefined) {
        statusText = isOpen ? '진료 가능' : '진료 종료';
        statusClass = isOpen ? styles.itemStatusAvailable : styles.itemStatusRequired;
    } else if (availableNow !== undefined) {
        statusText = availableNow ? '즉시 이용 가능' : '예약 필요';
        statusClass = availableNow ? styles.itemStatusAvailable : styles.itemStatusNotAvailable;
    }

    // Hours logic
    let hoursText = '';
    if (operatingHours) {
        hoursText = `${operatingHours.start} - ${operatingHours.end}`;
    } else if (openHour !== undefined && closeHour !== undefined) {
        hoursText = (openHour === 0 && closeHour === 24) ? '24시간 운영' : `${String(openHour).padStart(2, '0')}:00 - ${String(closeHour).padStart(2, '0')}:00`;
    }

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <li className={styles.listItemWrapper}>
            <div className={styles.listItem} onClick={onToggle}>
                <div className={styles.itemHeader}>
                    <strong className={styles.itemName}>{name}</strong>
                    <div className={styles.itemInfo}>
                        {rating && <span className={styles.itemRating}>⭐ {rating} ({reviews})</span>}
                        {distanceKm && <span className={styles.itemDistance}>{distanceKm}km</span>}
                    </div>
                </div>
                <div className={styles.itemMeta}>
                    {hoursText && <span className={styles.metaItem}>🕒 {hoursText}</span>}
                    {pricePerNight && <span className={styles.metaItem}>💰 1박 {pricePerNight.toLocaleString()}원</span>}
                    {statusText && <span className={statusClass}>{statusText}</span>}
                </div>
            </div>

            {isExpanded && (
                <div className={styles.expandedDetails}>
                    <div className={styles.detailsContent}>
                        <p>{description}</p>
                        <h4>주요 서비스</h4>
                        <div className={styles.itemServices}>
                            {services.map((s) => (
                                <span key={s} className={styles.servicePill}>{s}</span>
                            ))}
                        </div>
                        <h4>위치 및 연락처</h4>
                        <p><strong>주소:</strong> {address}</p>
                        <p><strong>전화번호:</strong> {phone}</p>
                        <div className={styles.ctaContainer}>
                            <button className={styles.ctaButton}>전화하기</button>
                            <button className={`${styles.ctaButton} ${styles.primary}`}>예약하기</button>
                        </div>
                    </div>
                    {images && images.length > 0 && (
                        <div className={styles.imageSlider}>
                            <img src={images[currentImageIndex]} alt={`${name} ${currentImageIndex + 1}`} className={styles.sliderImage} />
                            {images.length > 1 && (
                                <>
                                    <button onClick={handlePrevImage} className={`${styles.sliderNav} ${styles.prev}`}>‹</button>
                                    <button onClick={handleNextImage} className={`${styles.sliderNav} ${styles.next}`}>›</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </li>
    );
};

export default BusinessListItem;