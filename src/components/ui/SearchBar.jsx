import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ size = 'medium', placeholder = '검색어를 입력하세요', onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(e.target.search.value);
    }
  };

  return (
    <form className={`${styles.searchBar} ${styles[size]}`} onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton} aria-label="검색">
        🔍
      </button>
    </form>
  );
};

export default SearchBar;

