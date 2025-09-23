// src/components/pension/PensionCard.jsx

// --- IMPORT ---
import React from 'react';
import { Link } from 'react-router-dom'; // React Router의 Link 컴포넌트 (페이지 이동)
import styles from './PensionCard.module.css'; // 컴포넌트 전용 CSS 모듈

/**
 * @component PensionCard
 * @description 단일 숙소 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * `PensionPage.jsx`에서 숙소 목록을 렌더링할 때 각 숙소에 대해 사용됩니다.
 * 클릭 시 해당 숙소의 상세 페이지(`PensionDetailPage.jsx`)로 이동합니다.
 *
 * @param {object} props - 컴포넌트에 전달되는 속성(props).
 * @param {object} props.pension - 표시할 숙소 객체. 다음 속성들을 포함합니다:
 * @param {number} props.pension.id - 숙소의 고유 ID (상세 페이지 링크에 사용).
 * @param {string[]} props.pension.images - 숙소 이미지 URL 배열.
 * @param {string} props.pension.name - 숙소 이름.
 * @param {string} props.pension.location - 숙소 위치.
 * @param {number} props.pension.rating - 숙소 평점.
 * @param {string} [props.pension.checkInTime] - 체크인 시간 (선택 사항).
 * @param {string} [props.pension.checkOutTime] - 체크아웃 시간 (선택 사항).
 * @param {number} props.pension.price - 1박당 숙소 가격.
 * @param {string[]} props.pension.tags - 숙소 특징을 나타내는 태그 배열.
 */
const PensionCard = ({ pension }) => {
  // 가격을 통화 형식(예: 1,000)으로 포맷하는 헬퍼 함수입니다.
  const formatPrice = (price) => {
    if (typeof price === 'number' && !isNaN(price)) {
      return price.toLocaleString();
    }
    return '가격 정보 없음'; // 유효하지 않은 가격일 경우 기본 메시지 반환
  };

  return (
    // Link 컴포넌트를 사용하여 카드 전체를 클릭 가능한 링크로 만듭니다.
    // `to` 속성으로 상세 페이지의 URL을 지정합니다. (예: /pet-friendly-lodging/1)
    <Link to={`/pet-friendly-lodging/${pension.id}`} className={styles.cardLink}> {/* 카드 전체를 감싸는 링크 */}
      <div className={styles.card}> {/* 개별 숙소 카드 컨테이너 */}
        <img 
          src={ // 숙소 이미지 URL을 결정합니다.
            pension.images && pension.images.length > 0 
              ? (Array.isArray(pension.images) ? pension.images[0] : JSON.parse(pension.images || '[]')[0]) // images가 배열이면 첫 번째, 문자열이면 파싱 후 첫 번째
              : pension.image || 'https://picsum.photos/400/300' // images가 없으면 image 속성 사용, 그것도 없으면 기본 이미지
          } 
          alt={pension.name} // 이미지 대체 텍스트
          className={styles.cardImage} // 이미지 스타일
        />
        <div className={styles.cardContent}> {/* 카드 내용 영역 */}
          <div className={styles.info}> {/* 위치 및 평점 정보 */}
            <span className={styles.location}>{pension.location}</span>
            <span className={styles.rating}>⭐ {pension.rating.toFixed(1)}</span>
          </div>
          <h3 className={styles.title}>{pension.name}</h3> {/* 숙소 이름 */}
          {/* 체크인/체크아웃 시간이 있을 경우에만 렌더링 */}
          {pension.checkInTime && pension.checkOutTime && (
            <div className={styles.timeInfo}> 
              <span>체크인 {pension.checkInTime}</span>
              <span>체크아웃 {pension.checkOutTime}</span>
            </div>
          )}
          <p className={styles.price}>₩{formatPrice(pension.price)} / 박</p> {/* 1박당 가격 */}
          <div className={styles.tags}> {/* 숙소 태그 목록 */}
            {/* tags가 문자열이면 JSON.parse로 배열로 변환, 없으면 빈 배열 */}
            {(pension.tags && typeof pension.tags === 'string' ? JSON.parse(pension.tags) : pension.tags || []).map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PensionCard;
