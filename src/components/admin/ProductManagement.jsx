// src/components/admin/ProductManagement.jsx

// --- 파일 역할: 관리자 페이지의 '반려용품 관리' 탭에 해당하는 UI 및 기능 ---
// 이 컴포넌트는 관리자가 시스템에 등록된 반려용품을 관리(조회, 추가, 수정, 삭제)할 수 있는 인터페이스를 제공합니다.
// 주요 기능으로는 상품 목록 조회, 카테고리 및 검색어를 통한 필터링, 페이지네이션, 신규 상품 추가,
// 기존 상품 정보 수정, 상품 삭제, 그리고 '베스트 상품' 및 '추천 상품'으로의 지정/해제 기능이 있습니다.
// 데이터는 목(mock) 데이터 서비스를 통해 관리되며, 실제 백엔드 API 연동 시 해당 서비스만 교체하면 됩니다.

import React, { useState, useEffect } from 'react'; // React 및 상태 관리를 위한 useState, 부수 효과를 위한 useEffect 훅 임포트
// import { useAdminAuth } from '../../context/AdminAuthContext'; // 관리자 인증 컨텍스트 (실제 인증 로직 사용 시 활성화)
import adminStyles from './Admin.module.css'; // 관리자 페이지 공통 스타일을 위한 CSS 모듈 임포트
import { mockDataService } from '../../utils/mockDataService'; // 목 데이터 관리 서비스 유틸리티 임포트
import ProductData from "../../data/products.json"; // 초기 상품 데이터로 사용될 JSON 파일 임포트

// --- ProductManagement Component ---
// 관리자용 상품 관리 기능을 제공하는 함수형 컴포넌트
const ProductManagement = () => {
  // --- STATE VARIABLES (상태 관리) ---
  // const {isAdminAuthenticated} = useAdminAuth(); // 실제 관리자 인증 상태를 가져오는 훅 (현재는 데모를 위해 주석 처리)
  const isAdminAuthenticated = true; // 프론트엔드 데모를 위해 항상 '인증됨'으로 가정하여 기능을 시연합니다.
  const [products, setProducts] = useState([]); // 현재 화면에 표시될 상품 목록을 저장하는 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태를 나타내는 boolean 값
  const [error, setError] = useState(null); // 데이터 처리 중 발생한 오류 메시지를 저장하는 상태
  const [editingProduct, setEditingProduct] = useState(null); // 수정 중인 상품의 데이터를 저장하는 상태. null이 아니면 수정 모드입니다.
  const [showAddForm, setShowAddForm] = useState(false); // '상품 추가' 폼의 표시 여부를 관리하는 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 보고 있는 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 상품 데이터에 기반한 총 페이지 수
  const [selectedCategory, setSelectedCategory] = useState(''); // 상품 목록 필터링을 위해 선택된 카테고리
  const [searchTerm, setSearchTerm] = useState(''); // 상품 목록 검색을 위한 검색어

  // '상품 추가' 폼의 입력 필드 데이터를 관리하는 상태
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', imageUrl: '',
    stock: '', isFeatured: false, isBest: false, brand: '', rating: 4.0, reviewCount: 0
  });

  // 상품 카테고리 목록 (드롭다운 메뉴 등에 사용)
  const categories = ['사료', '간식', '장난감', '용품', '위생용품', '의류', '기타'];
  const PRODUCTS_PER_PAGE = 10; // 한 페이지에 보여줄 상품의 최대 개수

  // --- EFFECTS (데이터 로딩 및 초기화) ---
  // 컴포넌트가 마운트되거나, 관리자 인증 상태, 현재 페이지, 선택된 카테고리, 검색어가 변경될 때마다
  // 상품 데이터를 다시 불러와 화면을 업데이트합니다.
  useEffect(() => {
    // 목 데이터 서비스에 초기 상품 데이터(products.json)를 설정합니다.
    // 이 작업은 한 번만 수행되어야 하므로, 실제 애플리케이션에서는 별도의 초기화 로직이 필요할 수 있습니다.
    mockDataService.initialize('Product', ProductData);
    if (isAdminAuthenticated) {
      fetchProducts(); // 관리자 인증 상태일 때만 상품 목록을 가져옵니다.
    }
  }, [isAdminAuthenticated, currentPage, selectedCategory, searchTerm]); // 의존성 배열에 따라 재실행

  // --- DATA FETCHING (데이터 가져오기) ---
  // 목 데이터 서비스로부터 상품 목록을 비동기적으로 가져와 상태를 업데이트하는 함수
  const fetchProducts = async () => {
    setLoading(true); // 로딩 시작
    setError(null); // 이전 오류 메시지 초기화
    try {
      const response = await mockDataService.getAll('Product'); // 모든 상품 데이터 가져오기
      if (response.success) {
        let allProducts = response.data;

        // 1. 카테고리 필터링: `selectedCategory`가 설정되어 있으면 해당 카테고리의 상품만 남깁니다.
        if (selectedCategory) {
          allProducts = allProducts.filter(product => product.category === selectedCategory);
        }
        // 2. 검색어 필터링: `searchTerm`이 설정되어 있으면 상품명 또는 설명에 검색어가 포함된 상품만 남깁니다.
        if (searchTerm) {
          allProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // 3. 페이지네이션 처리: 필터링된 상품들을 현재 페이지에 맞게 분할합니다.
        const totalItems = allProducts.length; // 필터링된 전체 상품 수
        const totalPagesCount = Math.ceil(totalItems / PRODUCTS_PER_PAGE); // 총 페이지 수 계산
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE; // 현재 페이지의 시작 인덱스
        const endIndex = startIndex + PRODUCTS_PER_PAGE; // 현재 페이지의 끝 인덱스
        const paginatedProducts = allProducts.slice(startIndex, endIndex); // 현재 페이지에 표시될 상품 목록

        setProducts(paginatedProducts); // 현재 페이지에 맞는 상품 목록으로 상태 업데이트
        setTotalPages(totalPagesCount); // 전체 페이지 수 업데이트
      } else {
        // 데이터 가져오기 실패 시 오류 메시지 설정
        setError(response.message || '반려용품 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      // 예외 발생 시 콘솔에 에러를 기록하고 오류 메시지 설정
      console.error('Failed to fetch products:', err);
      setError('반려용품 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // --- EVENT HANDLERS (이벤트 처리 함수) ---

  // 폼 입력 필드의 값이 변경될 때 호출되는 함수
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // 입력 타입이 체크박스인 경우 `checked` 값을, 그 외에는 `value` 값을 사용합니다.
    const newValue = type === 'checkbox' ? checked : value;

    // 현재 수정 모드인지(editingProduct가 null이 아닌지)에 따라 다른 상태를 업데이트합니다.
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: newValue }); // 수정 중인 상품 정보 업데이트
    } else {
      setFormData({ ...formData, [name]: newValue }); // 새 상품 추가 폼 데이터 업데이트
    }
  };

  // '상품 추가' 폼 제출 시 호출되는 함수
  const handleAddProduct = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작(페이지 새로고침)을 막습니다.
    setError(null); // 이전 오류 메시지 초기화
    try {
      // 폼 데이터를 API가 요구하는 형식에 맞게 변환합니다. (숫자형 필드 파싱, 생성 시각 추가 등)
      const productToAdd = { 
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating) || 4.0, // 기본 평점 설정
        reviewCount: parseInt(formData.reviewCount) || 0, // 기본 리뷰 수 설정
        createdAt: new Date().toISOString() // ISO 형식의 현재 시각 추가
      };
      const response = await mockDataService.create('Product', productToAdd);

      if (response.success) {
        // 상품 추가 성공 시, 폼을 초기화하고 '상품 추가' 폼을 숨긴 후 상품 목록을 새로고침합니다.
        setFormData({
          name: '', description: '', price: '', category: '', imageUrl: '',
          stock: '', isFeatured: false, isBest: false, brand: '', rating: 4.0, reviewCount: 0
        });
        setShowAddForm(false);
        fetchProducts(); // 업데이트된 목록을 다시 불러옵니다.
        alert('반려용품이 성공적으로 추가되었습니다.');
      } else {
        setError(response.message || '반려용품 추가에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to add product:', err);
      setError('반려용품 추가 중 오류가 발생했습니다.');
    }
  };

  // '상품 수정' 폼 제출 시 호출되는 함수
  const handleUpdateProduct = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지
    setError(null); // 이전 오류 메시지 초기화
    try {
      // 수정 중인 상품 데이터를 API 형식에 맞게 변환합니다.
      const productToUpdate = { 
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        rating: parseFloat(editingProduct.rating) || 4.0,
        reviewCount: parseInt(editingProduct.reviewCount) || 0,
      };
      const response = await mockDataService.update('Product', editingProduct.id, productToUpdate);

      if (response.success) {
        // 수정 성공 시, 수정 모드를 종료하고 상품 목록을 새로고침합니다.
        setEditingProduct(null); // 수정 모드 해제
        fetchProducts(); // 업데이트된 목록을 다시 불러옵니다.
        alert('반려용품이 성공적으로 수정되었습니다.');
      } else {
        setError(response.message || '반려용품 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to update product:', err);
      setError('반려용품 수정 중 오류가 발생했습니다.');
    }
  };

  // '삭제' 버튼 클릭 시 호출되는 함수
  const handleDelete = async (productId) => {
    // 사용자에게 삭제 확인 메시지를 표시합니다.
    if (!confirm('정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return; // 사용자가 '취소'를 누르면 함수 실행을 중단합니다.
    }

    try {
      const response = await mockDataService.remove('Product', productId);
      if (response.success) {
        alert('상품이 성공적으로 삭제되었습니다.');
        fetchProducts(); // 업데이트된 목록을 다시 불러옵니다.
      } else {
        setError(response.message || '상품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제 중 오류가 발생했습니다.');
    }
  };

  // '베스트' 버튼 클릭 시 상품의 `isBest` 속성을 토글하는 함수
  const toggleBestProduct = async (productId) => {
    try {
      // 먼저 해당 상품의 현재 정보를 가져옵니다.
      const product = (await mockDataService.getById('Product', productId)).data;
      if (product) {
        // `isBest` 속성을 반전시킨 새로운 상품 객체를 생성합니다.
        const updatedProduct = { ...product, isBest: !product.isBest };
        const response = await mockDataService.update('Product', productId, updatedProduct);
        if (response.success) {
          fetchProducts(); // 업데이트된 목록을 다시 불러옵니다.
          alert(`상품이 ${updatedProduct.isBest ? '베스트 상품으로 설정' : '베스트 상품에서 해제'}되었습니다.`);
        } else {
          setError(response.message || '베스트 상품 설정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('베스트 상품 설정 실패:', error);
      alert('베스트 상품 설정 중 오류가 발생했습니다.');
    }
  };

  // '추천' 버튼 클릭 시 상품의 `isFeatured` 속성을 토글하는 함수
  const toggleFeaturedProduct = async (productId) => {
    try {
      // 먼저 해당 상품의 현재 정보를 가져옵니다.
      const product = (await mockDataService.getById('Product', productId)).data;
      if (product) {
        // `isFeatured` 속성을 반전시킨 새로운 상품 객체를 생성합니다.
        const updatedProduct = { ...product, isFeatured: !product.isFeatured };
        const response = await mockDataService.update('Product', productId, updatedProduct);
        if (response.success) {
          fetchProducts(); // 업데이트된 목록을 다시 불러옵니다.
          alert(`상품이 ${updatedProduct.isFeatured ? '추천 상품으로 설정' : '추천 상품에서 해제'}되었습니다.`);
        } else {
          setError(response.message || '추천 상품 설정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('추천 상품 설정 실패:', error);
      alert('추천 상품 설정 중 오류가 발생했습니다.');
    }
  };

  // --- RENDER (렌더링) ---
  // 데이터 로딩 중일 경우 로딩 메시지를 표시합니다.
  if (loading) return <div className={adminStyles.loading}>데이터를 불러오는 중입니다...</div>;

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>반려용품 관리</h3>
      
      {/* 오류가 있을 경우 오류 메시지를 표시합니다. */}
      {error && <div className={adminStyles.errorMessage}>{error}</div>}

      {/* 검색 및 필터링 UI 섹션 */}
      <div className={adminStyles.userForm}>
        {/* 상품명 검색 입력 필드 */}
        <input
          type="text"
          placeholder="상품명 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // 검색어 상태 업데이트
        />
        {/* 카테고리 선택 드롭다운 */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value); // 선택된 카테고리 상태 업데이트
            setCurrentPage(1); // 카테고리 변경 시 페이지를 1로 리셋하여 새로운 필터링 결과의 첫 페이지를 보여줍니다.
          }}
        >
          <option value="">모든 카테고리</option> {/* 기본 옵션 */}
          {categories.map(category => (
            <option key={category} value={category}>{category}</option> // 각 카테고리 옵션 렌더링
          ))}
        </select>
        {/* '상품 추가' 폼 토글 버튼 */}
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)} // 폼 표시 여부 토글
          className={adminStyles.userFormButton}
        >
          {showAddForm ? '상품 추가 취소' : '새 상품 추가'} {/* 버튼 텍스트 동적 변경 */}
        </button>
      </div>

      {/* '상품 추가' 폼 (showAddForm 상태가 true일 때만 보임) */}
      {showAddForm && (
        <form onSubmit={handleAddProduct} className={adminStyles.userForm}>
          {/* 상품명 입력 */}
          <input type="text" name="name" placeholder="상품명" value={formData.name} onChange={handleInputChange} required />
          {/* 상품 설명 입력 */}
          <textarea name="description" placeholder="상품 설명" value={formData.description} onChange={handleInputChange} required />
          {/* 가격 입력 */}
          <input type="number" name="price" placeholder="가격" value={formData.price} onChange={handleInputChange} required />
          {/* 카테고리 선택 */}
          <select name="category" value={formData.category} onChange={handleInputChange} required>
            <option value="">카테고리 선택</option>
            {categories.map(category => (<option key={category} value={category}>{category}</option>))}
          </select>
          {/* 브랜드 입력 */}
          <input type="text" name="brand" placeholder="브랜드" value={formData.brand} onChange={handleInputChange} />
          {/* 이미지 URL 입력 */}
          <input type="url" name="imageUrl" placeholder="이미지 URL" value={formData.imageUrl} onChange={handleInputChange} />
          {/* 재고 수량 입력 */}
          <input type="number" name="stock" placeholder="재고 수량" value={formData.stock} onChange={handleInputChange} />
          {/* 베스트상품 체크박스 */}
          <div>
            <label>
              <input type="checkbox" name="isBest" checked={formData.isBest} onChange={handleInputChange} />
              베스트상품으로 지정
            </label>
          </div>
          {/* 추천 상품 체크박스 */}
          <div>
            <label>
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} />
              추천 상품으로 지정
            </label>
          </div>
          {/* 상품 추가 제출 버튼 */}
          <button type="submit" className={adminStyles.userFormButton}>
            상품 추가
          </button>
        </form>
      )}

      {/* 상품 목록을 표시하는 테이블 */}
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>상품명</th>
            <th>카테고리</th>
            <th>브랜드</th>
            <th>가격</th>
            <th>재고</th>
            <th>베스트</th>
            <th>추천</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              {/* 각 상품의 정보를 표시합니다. 수정 모드일 경우 입력 필드를 보여줍니다. */}
              <td>
                {editingProduct?.id === product.id ? (
                  <input type="text" name="name" value={editingProduct.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <select name="category" value={editingProduct.category} onChange={handleInputChange} className={adminStyles.userEditInput}>
                    {categories.map(category => (<option key={category} value={category}>{category}</option>))}
                  </select>
                ) : (
                  product.category
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input type="text" name="brand" value={editingProduct.brand || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  product.brand || '-'
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input type="number" name="price" value={editingProduct.price} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  `${product.price?.toLocaleString()}원`
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input type="number" name="stock" value={editingProduct.stock || 0} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  product.stock || 0
                )}
              </td>
              <td>
                {/* 베스트 상품 토글 버튼 */}
                <button
                  onClick={() => toggleBestProduct(product.id)}
                  className={adminStyles.userActionButton}
                  style={{
                    backgroundColor: product.isBest ? '#48bb78' : '#e2e8f0', // 베스트 상품 여부에 따라 색상 변경
                    color: product.isBest ? 'white' : 'black'
                  }}
                >
                  {product.isBest ? '베스트' : '일반'}
                </button>
              </td>
              <td>
                {/* 추천 상품 토글 버튼 */}
                <button
                  onClick={() => toggleFeaturedProduct(product.id)}
                  className={adminStyles.userActionButton}
                  style={{
                    backgroundColor: product.isFeatured ? '#667eea' : '#e2e8f0', // 추천 상품 여부에 따라 색상 변경
                    color: product.isFeatured ? 'white' : 'black'
                  }}
                >
                  {product.isFeatured ? '추천' : '일반'}
                </button>
              </td>
              <td>
                {/* 수정/삭제 버튼 또는 저장/취소 버튼 (수정 모드에 따라 다름) */}
                {editingProduct?.id === product.id ? (
                  <>
                    <button onClick={handleUpdateProduct} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingProduct(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingProduct(product)} className={adminStyles.userActionButton}>수정</button>
                    <button onClick={() => handleDelete(product.id)} className={adminStyles.userActionButton}>삭제</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 UI (전체 페이지가 1보다 클 때만 표시) */}
      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {/* 페이지 번호 버튼들을 렌더링 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)} // 페이지 클릭 시 현재 페이지 업데이트
              className={adminStyles.userActionButton}
              style={{
                backgroundColor: currentPage === page ? '#667eea' : '#e2e8f0', // 현재 페이지에 따라 색상 변경
                color: currentPage === page ? 'white' : 'black',
                margin: '0 5px'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement; // ProductManagement 컴포넌트를 내보냅니다.