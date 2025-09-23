// src/components/common/FilterSection.jsx

// --- IMPORT ---
import React, { useState } from 'react';
import styles from './FilterSection.module.css'; // 컴포넌트 전용 CSS 모듈
import searchIcon from '../../assets/search.png'; // 검색 아이콘 이미지

/**
 * @component FilterSection
 * @description 검색 입력창과 상세 필터 토글 기능을 제공하는 공통 필터 섹션 컴포넌트입니다.
 * `PensionPage.jsx`와 같이 검색 및 필터링 기능이 필요한 페이지에서 사용됩니다.
 * 자식 요소로 상세 필터 UI를 받아 `isFilterVisible` 상태에 따라 렌더링합니다.
 *
 * @param {object} props - 컴포넌트에 전달되는 속성(props).
 * @param {React.ReactNode} props.children - 상세 필터 영역에 렌더링될 자식 React 요소들.
 * @param {string} props.locationPlaceholder - 검색 입력창의 플레이스홀더 텍스트.
 * @param {string} props.searchTerm - 현재 검색어 상태.
 * @param {function(string): void} props.onSearchTermChange - 검색어 변경 시 호출될 콜백 함수.
 * @param {function(): void} props.onSearch - 검색 버튼 클릭 시 호출될 콜백 함수.
 */
const FilterSection = ({ children, locationPlaceholder, searchTerm, onSearchTermChange, onSearch }) => {
    // 상세 필터 영역의 가시성(표시 여부)을 관리하는 상태입니다.
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // 검색어 입력창의 값이 변경될 때 호출되는 핸들러입니다.
    // 부모 컴포넌트로부터 받은 `onSearchTermChange` 함수를 호출하여 검색어 상태를 업데이트합니다.
    const handleLocationChange = (e) => {
        if (onSearchTermChange) {
            onSearchTermChange(e.target.value);
        }
    };

    // 검색 버튼 클릭 시 호출되는 핸들러입니다.
    // 부모 컴포넌트로부터 받은 `onSearch` 함수를 호출하여 검색을 실행합니다.
    const handleSearch = () => {
        if (onSearch) {
            onSearch();
        }
    };

    return (
        <div className={styles.filterContainer}> {/* 전체 필터 섹션 컨테이너 */}
            <div className={styles.searchAndToggle}> {/* 검색 입력창과 토글 버튼을 포함하는 영역 */}
                <div className={styles.filterInputWrapper}> {/* 검색 입력창과 아이콘 래퍼 */}
                    <img src={searchIcon} alt="돋보기 아이콘" className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={locationPlaceholder} // 부모로부터 받은 플레이스홀더 텍스트
                        value={searchTerm} // 부모로부터 받은 검색어 상태
                        onChange={handleLocationChange} // 검색어 변경 핸들러
                        className={styles.filterInput}
                    />
                </div>
                {/* 검색 버튼: 클릭 시 `onSearch` 콜백 함수 호출 */}
                <button onClick={handleSearch} className={styles.searchButton}>검색</button>
                {/* 상세 필터 토글 버튼: 클릭 시 `isFilterVisible` 상태를 변경하여 상세 필터 영역을 보이거나 숨깁니다. */}
                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={styles.toggleButton}
                    aria-expanded={isFilterVisible} // 접근성을 위한 aria 속성
                >
                    상세 필터 {isFilterVisible ? '▲' : '▼'} {/* 상태에 따라 버튼 텍스트 변경 */}
                </button>
            </div>
            {/* `isFilterVisible`이 true일 때만 상세 필터 영역을 렌더링합니다. */}
            {isFilterVisible && (
                <div className={styles.advancedFilters}> {/* 상세 필터 컨테이너 */}
                    {children} {/* 부모 컴포넌트에서 전달된 자식 요소들 (예: 날짜 선택, 인원 선택 등) */}
                </div>
            )}
        </div>
    );
};

export default FilterSection;
