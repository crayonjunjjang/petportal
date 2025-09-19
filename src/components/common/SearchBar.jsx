// src/components/common/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { useSearch } from '../../contexts/SearchContext';

const SearchBar = ({ isScrolled }) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // 검색 키워드와 관련 페이지 매핑
  const searchMappings = {
    // 서비스 관련
    '미용': '/grooming',
    '그루밍': '/grooming',
    '목욕': '/grooming',
    '병원': '/hospital',
    '동물병원': '/hospital',
    '수의사': '/hospital',
    '치료': '/hospital',
    '카페': '/cafe',
    '펫카페': '/cafe',
    '호텔': '/hotel',
    '숙박': '/hotel',
    '펜션': '/pet-friendly-lodging',
    
    // 반려용품 관련
    '사료': '/pet-supplies/category/사료',
    '간식': '/pet-supplies/category/간식',
    '장난감': '/pet-supplies/category/장난감',
    '용품': '/pet-supplies',
    '반려용품': '/pet-supplies',
    '쿠션': '/pet-supplies/category/침구/쿠션',
    '침구': '/pet-supplies/category/침구/쿠션',
    '의류': '/pet-supplies/category/의류/악세서리',
    '목줄': '/pet-supplies/category/의류/악세서리',
    '샴푸': '/pet-supplies/category/미용/목욕',
    '미용용품': '/pet-supplies/category/미용/목욕',
    
    // 커뮤니티 관련
    '커뮤니티': '/community',
    '게시판': '/community',
    '자유게시판': '/community/free-talk',
    '자유': '/community/free-talk',
    '펫자랑': '/community/pet-showcase',
    '자랑': '/community/pet-showcase',
    '정보공유': '/community/info-share',
    '정보': '/community/info-share',
    'qna': '/community/qna',
    '질문': '/community/qna',
    '분양': '/community/adoption',
    '나눔': '/community/adoption',
    '산책': '/community/walk',
    '모임': '/community/walk',
    '실종': '/community/missing',
    '보호': '/community/missing',
    '후기': '/community/review',
    '리뷰': '/community/review',
    
    // 기타
    '고객센터': '/customerservice',
    '문의': '/customerservice',
    '공지': '/notice',
    'faq': '/faq'
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      // 검색어와 매칭되는 제안사항 생성
      const matchedSuggestions = Object.keys(searchMappings)
        .filter(keyword => keyword.includes(value.toLowerCase()) || value.toLowerCase().includes(keyword))
        .slice(0, 5);
      
      setSuggestions(matchedSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim());
    }
  };

  const performSearch = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // 정확한 키워드 매칭 확인
    for (const [keyword, path] of Object.entries(searchMappings)) {
      if (lowerQuery.includes(keyword) || keyword.includes(lowerQuery)) {
        navigate(path);
        setShowSuggestions(false);
        return;
      }
    }
    
    // 매칭되는 키워드가 없으면 반려용품 검색으로 이동
    navigate(`/pet-supplies?search=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    performSearch(suggestion);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={`${styles.searchContainer} ${isScrolled ? styles.scrolled : ''}`}>
        <input
          type="text"
          placeholder="미용, 병원, 카페, 용품 등 검색..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          검색
        </button>
        
        {/* 검색 제안사항 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className={styles.suggestionIcon}>🔍</span>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
