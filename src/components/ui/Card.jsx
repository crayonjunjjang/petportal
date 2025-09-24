// src/components/ui/Card.jsx

// --- 파일 역할: 다양한 유형의 콘텐츠를 표시하기 위한 범용적인 카드(Card) UI 컴포넌트 ---
// 이 컴포넌트는 `item` 객체와 `type` 문자열을 props로 받아,
// `type`에 따라 다른 구조와 스타일로 카드 UI를 렌더링합니다.
// 예를 들어, 'business', 'hospital', 'cafe', 'hotel', 'grooming' 등 다양한 서비스의 요약 정보를 표시하는 데 사용될 수 있습니다.
// 또한, 'sitter'와 같은 특정 유형에 대한 추가 액션 버튼을 포함할 수 있습니다.

import React from 'react'; // React 라이브러리 임포트
import styles from './Card.module.css'; // Card 컴포넌트의 스타일을 위한 CSS 모듈 임포트
import Button from './Button'; // 재사용 가능한 버튼 UI 컴포넌트 임포트

// --- Card Component ---
// props:
//   - item: 카드에 표시될 데이터 객체. 다양한 속성을 포함할 수 있으며, type에 따라 다르게 사용됩니다.
//   - type: 카드의 유형을 결정하는 문자열. 기본값은 'default'.
//           (예: 'default', 'business', 'hospital', 'cafe', 'hotel', 'grooming', 'sitter' 등)
const Card = ({ item, type = 'default' }) => {
  // item 객체에서 필요한 모든 속성을 구조 분해 할당합니다.
  // 이 속성들은 카드의 type에 따라 선택적으로 사용됩니다.
  const { 
    id, // 아이템의 고유 ID
    image, // 단일 이미지 URL (images가 없을 경우 사용)
    images, // 이미지 URL 배열 (주로 첫 번째 이미지를 대표 이미지로 사용)
    title, // 아이템의 제목 (예: 게시글 제목, 상품명)
    name, // 아이템의 이름 (예: 업체명, 병원명). title이 없을 경우 사용
    location, // 아이템의 위치 정보 (예: 지역명)
    specialty, // 단일 전문 분야 (예: 병원의 특정 진료과)
    specialties, // 전문 분야 배열 (예: 병원의 여러 진료과)
    author, // 작성자 (예: 게시글 작성자)
    rating, // 평점 (예: 5점 만점)
    reviews, // 리뷰 수
    description, // 아이템의 간략한 설명
    address, // 상세 주소
    phone, // 전화번호
    distanceKm, // 현재 위치로부터의 거리 (킬로미터)
    services, // 제공하는 서비스 목록 (예: 미용실의 서비스 종류)
    operatingHours, // 운영 시간 (문자열 또는 시작/종료 시간을 포함하는 객체)
    requiresReservation, // 예약 필수 여부 (boolean)
    targetAnimals, // 대상 동물 목록 (예: 병원에서 진료하는 동물)
    amenities // 호텔/펜션용 편의시설 목록
  } = item;

  // 카드에 표시할 대표 이미지를 결정합니다.
  // `images` 배열이 존재하면 첫 번째 이미지를 사용하고, 그렇지 않으면 `image` 속성을 사용합니다.
  const cardImage = images && images.length > 0 ? images[0] : image;

  return (
    <div 
      // 기본 `card` 스타일과 함께, `type` prop에 따른 추가 클래스를 적용하여 카드 유형별 스타일을 분기합니다.
      className={`${styles.card} ${styles[type]}`}
    >
      {/* 카드 상단 이미지 영역 */}
      <img src={cardImage} alt={title || name} className={styles.cardImage} />
      
      {/* 카드 내용 영역 */}
      <div className={styles.cardContent}>
        {/* 제목 및 위치 정보 컨테이너 */}
        <div className={styles.titleContainer}>
          {/* 카드 제목. title이 없으면 name을 사용합니다. */}
          <h3 className={styles.cardTitle}>{title || name}</h3>
          {/* location 정보가 있을 경우 위치 태그를 표시합니다. */}
          {location && <span className={styles.locationTag}>{location}</span>}
        </div>
        {/* specialty 정보가 있을 경우 부제목으로 표시합니다. */}
        {specialty && <p className={styles.cardSubtitle}>{specialty}</p>}
        {/* author 정보가 있을 경우 작성자를 표시합니다. */}
        {author && <p className={styles.cardAuthor}>by {author}</p>}
        
        {/* 
          'business', 'hospital', 'grooming', 'cafe', 'hotel' 유형의 카드일 때만 표시되는 상세 정보 섹션.
          이 섹션은 주로 서비스 업체의 상세 정보를 요약하여 보여줍니다.
        */}
        {(type === 'business' || type === 'hospital' || type === 'grooming' || type === 'cafe' || type === 'hotel') && (
          <>
            <div className={styles.businessInfo}>
              {/* 평점 및 리뷰 정보 */}
              {rating && (
                <div className={styles.ratingInfo}>
                  <span className={styles.cardRating}>⭐ {rating}</span>
                  {reviews && <span className={styles.reviewCount}>({reviews}개 리뷰)</span>}
                </div>
              )}
              {/* 주소 정보 */}
              {address && <p className={styles.address}>{address}</p>}
              {/* 전화번호 정보 */}
              {phone && <p className={styles.phone}>{phone}</p>}
              {/* 거리 정보 */}
              {distanceKm && <p className={styles.distance}>{distanceKm}km</p>}
              {/* 운영 시간 정보. operatingHours가 문자열일 수도, 객체일 수도 있는 경우를 모두 처리합니다. */}
              {operatingHours && (
                <p className={styles.hours}>
                  {typeof operatingHours === 'string' ? operatingHours : `${operatingHours.start} - ${operatingHours.end}`}
                </p>
              )}
              {/* 예약 필수 여부 정보 */}
              {requiresReservation !== undefined && (
                <p className={styles.reservation}>
                  {requiresReservation ? '예약 필수' : '예약 불필요'}
                </p>
              )}
            </div>

            {/* 전문 분야 태그 목록 (예: 병원의 진료과). specialties 배열이 있을 경우 표시합니다. */}
            {specialties && specialties.length > 0 && (
              <div className={styles.specialtiesContainer}>
                {specialties.map(spec => (
                  <span key={spec} className={styles.specialtyTag}>{spec}</span>
                ))}
              </div>
            )}

            {/* 제공 서비스 태그 목록 (최대 3개 표시 후 "더보기"로 처리). services 배열이 있을 경우 표시합니다. */}
            {services && services.length > 0 && (
              <div className={styles.services}>
                {services.slice(0, 3).map(service => (
                  <span key={service} className={styles.serviceTag}>{service}</span>
                ))}
                {services.length > 3 && <span className={styles.moreServices}>+{services.length - 3}</span>}
              </div>
            )}

            {/* 대상 동물 태그 목록 (예: 미용실/병원에서 다루는 동물). targetAnimals 배열이 있을 경우 표시합니다. */}
            {targetAnimals && targetAnimals.length > 0 && (
              <div className={styles.targetAnimalsContainer}>
                {targetAnimals.map(animal => (
                  <span key={animal} className={styles.targetAnimalTag}>{animal}</span>
                ))}
              </div>
            )}

            {/* 편의시설 태그 목록 (호텔/펜션용, 최대 3개 표시 후 "더보기"로 처리). amenities 배열이 있을 경우 표시합니다. */}
            {amenities && amenities.length > 0 && (
              <div className={styles.amenitiesContainer}>
                {amenities.slice(0, 3).map(amenity => (
                  <span key={amenity} className={styles.amenityTag}>{amenity}</span>
                ))}
                 {amenities.length > 3 && <span className={styles.moreServices}>+{amenities.length - 3}</span>}
              </div>
            )}
          </>
        )}
        
        {/* 'business' 관련 유형이 아닐 때 표시될 기본 평점 정보. */}
        {rating && !['business', 'hospital', 'grooming', 'cafe', 'hotel'].includes(type) && <span className={styles.cardRating}>⭐ {rating}</span>}
        
        {/* 'sitter' 유형일 때만 '프로필 보기' 버튼 표시. */}
        {type === 'sitter' && (
          <Button variant="primary" size="small" className={styles.viewProfileButton}>
            프로필 보기
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card; // Card 컴포넌트를 내보냅니다.