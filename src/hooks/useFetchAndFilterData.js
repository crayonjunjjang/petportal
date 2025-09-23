import { useState, useEffect, useCallback } from 'react';
import { useUI } from '../contexts/UIContext';

const useFetchAndFilterData = (apiUrl, dataExtractor, options = {}) => {
  const {
    enablePagination = false,
    enableSearch = false,
    itemsPerPage = 5
  } = options;

  const { setIsLoading } = useUI();
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [postFilterData, setPostFilterData] = useState([]); // State to hold data after filtering, before pagination
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const extractor = useCallback(dataExtractor || (data => data), []);

  // fetchData 함수는 이제 사용되지 않으므로 주석 처리하거나 삭제할 수 있습니다.
  // API를 다시 사용할 경우를 대비해 남겨둡니다.
  // const fetchData = useCallback(async (page = 1, search = '') => { ... });

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (setIsLoading) setIsLoading(true);

    try {
      // apiUrl이 문자열이 아니면 로컬 데이터로 간주합니다.
      if (typeof apiUrl !== 'string') {
        const localData = apiUrl;
        const extractedData = extractor(localData);
        setAllData(extractedData);
        setPostFilterData(extractedData); // Initially, post-filter data is all data
        setTotalItems(extractedData.length); // Set total items for pagination
      } else {
        // 기존 API 호출 로직 (현재는 비활성화됨)
        // 이 부분에 원래의 fetch/axios 코드를 넣을 수 있습니다.
        console.warn(`Frontend-only mode: Not fetching data from ${apiUrl}. Returning empty array.`);
        setAllData([]);
        setFilteredData([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error(`Failed to process data:`, err);
      setError(err);
      setAllData([]);
      setFilteredData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
      if (setIsLoading) setIsLoading(false);
    }
    // apiUrl이 변경될 때마다 이 effect를 실행합니다.
  }, [apiUrl, extractor]);

  // This effect handles pagination slicing
  useEffect(() => {
    if (enablePagination) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setFilteredData(postFilterData.slice(startIndex, endIndex));
      setTotalItems(postFilterData.length);
    } else {
      setFilteredData(postFilterData);
      setTotalItems(postFilterData.length);
    }
  }, [currentPage, postFilterData, enablePagination, itemsPerPage]);

  // Function to apply new filters (for client-side filtering)
  const applyFilter = useCallback((filterFn) => {
    setPostFilterData(filterFn(allData));
    setCurrentPage(1); // Reset to first page when filters change
  }, [allData]);

  // Pagination controls
  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(totalItems / itemsPerPage);
    setCurrentPage(prev => Math.min(prev + 1, maxPage));
  }, [totalItems, itemsPerPage]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  // Search functionality
  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    allData,
    filteredData,
    applyFilter,
    error,
    loading,
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    // Search
    searchTerm,
    updateSearchTerm
  };
};

export default useFetchAndFilterData;