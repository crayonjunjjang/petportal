// src/components/admin/ProductManagement.jsx
// 관리자 페이지의 반려용품 관리 컴포넌트
import React, { useState, useEffect } from 'react';
// import { useAdminAuth } from '../../context/AdminAuthContext'; // 관리자 인증 컨텍스트 (주석 처리)
import adminStyles from './Admin.module.css'; // 관리자 스타일 모듈 임포트
import { mockDataService } from '../../utils/mockDataService'; // 목 데이터 서비스 임포트
import ProductData from "../../data/products.json";

const initialProductData = [
  {
    id: 1,
    name: '퓨리나 프로플랜 퍼포먼스 강아지 사료',
    description: '활동량이 많은 성견을 위한 고단백 사료',
    price: 55000,
    category: '사료',
    imageUrl: 'https://picsum.photos/id/270/200/300',
    stock: 100,
    isFeatured: true,
    isBest: false,
    brand: '퓨리나',
    rating: 4.8,
    reviewCount: 120
  },
  {
    id: 2,
    name: '템테이션 고양이 간식 참치맛',
    description: '고양이들이 환장하는 바삭하고 부드러운 간식',
    price: 8000,
    category: '간식',
    imageUrl: 'https://picsum.photos/id/271/200/300',
    stock: 250,
    isFeatured: false,
    isBest: true,
    brand: '템테이션',
    rating: 4.9,
    reviewCount: 300
  },
  {
    id: 3,
    name: '하울팟 강아지 노즈워크 장난감',
    description: '분리불안 해소에 도움을 주는 똑똑한 노즈워크 장난감',
    price: 28000,
    category: '장난감',
    imageUrl: 'https://picsum.photos/id/272/200/300',
    stock: 70,
    isFeatured: true,
    isBest: true,
    brand: '하울팟',
    rating: 4.7,
    reviewCount: 80
  },
  {
    id: 4,
    name: '도비 강아지 배변패드 특대형',
    description: '흡수력 좋은 대용량 배변패드, 냄새 걱정 끝!',
    price: 22000,
    category: '위생용품',
    imageUrl: 'https://picsum.photos/id/273/200/300',
    stock: 150,
    isFeatured: false,
    isBest: false,
    brand: '도비',
    rating: 4.5,
    reviewCount: 150
  },
  {
    id: 5,
    name: '페토이 고양이 캣타워 5단',
    description: '튼튼하고 안정적인 고양이 캣타워, 스크래쳐 포함',
    price: 120000,
    category: '용품',
    imageUrl: 'https://picsum.photos/id/274/200/300',
    stock: 30,
    isFeatured: true,
    isBest: false,
    brand: '페토이',
    rating: 4.6,
    reviewCount: 60
  },
];

const ProductManagement = () => {
  // const { isAdminAuthenticated } = useAdminAuth(); // 관리자 인증 상태 (주석 처리)
  const isAdminAuthenticated = true; // 프론트엔드 전용으로 항상 인증된 상태로 설정
  const [products, setProducts] = useState([]); // 상품 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const [editingProduct, setEditingProduct] = useState(null); // 편집 중인 상품 상태
  const [showAddForm, setShowAddForm] = useState(false); // 추가 폼 표시 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리
  const [searchTerm, setSearchTerm] = useState(''); // 검색어

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stock: '',
    isFeatured: false,
    isBest: false,
    brand: '',
    rating: 4.0,
    reviewCount: 0
  });

  const categories = ['사료', '간식', '장난감', '용품', '위생용품', '의류', '기타'];
  const PRODUCTS_PER_PAGE = 10;

  // 컴포넌트 마운트 시 및 의존성 변경 시 실행
  useEffect(() => {
    // 목 데이터 서비스에 초기 데이터 설정 (JSON 파일 데이터 사용)
    mockDataService.initialize('Product', ProductData);
    if (isAdminAuthenticated) {
      fetchProducts(); // 상품 목록 가져오기
    }
  }, [isAdminAuthenticated, currentPage, selectedCategory, searchTerm]);

  // 상품 목록을 가져오는 함수
  const fetchProducts = async () => {
    setLoading(true); // 로딩 시작
    setError(null); // 오류 상태 초기화
    try {
      // 목 데이터 서비스에서 모든 상품 가져오기
      const response = await mockDataService.getAll('Product');
      if (response.success) {
        let allProducts = response.data; // 모든 상품 데이터

        // 카테고리 필터링
        if (selectedCategory) {
          allProducts = allProducts.filter(product => product.category === selectedCategory);
        }
        // 검색어 필터링 (상품명 또는 설명에서 검색)
        if (searchTerm) {
          allProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // 페이지네이션 처리
        const totalItems = allProducts.length; // 전체 상품 수
        const totalPagesCount = Math.ceil(totalItems / PRODUCTS_PER_PAGE); // 전체 페이지 수 계산
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE; // 시작 인덱스
        const endIndex = startIndex + PRODUCTS_PER_PAGE; // 끝 인덱스
        const paginatedProducts = allProducts.slice(startIndex, endIndex); // 페이지별 상품 추출

        setProducts(paginatedProducts); // 상품 목록 상태 업데이트
        setTotalPages(totalPagesCount); // 전체 페이지 수 상태 업데이트
      } else {
        setError(response.message || '반려용품 데이터를 불러오는데 실패했습니다.'); // 오류 메시지 설정
      }
    } catch (err) {
      console.error('Failed to fetch products:', err); // 오류 로그 출력
      setError('반려용품 정보를 불러오는데 실패했습니다.'); // 오류 상태 설정
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 입력 필드 변경 처리 함수
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target; // 입력 요소의 속성들 추출
    const newValue = type === 'checkbox' ? checked : value; // 체크박스면 checked 값, 아니면 value 값 사용
    
    // 편집 모드인지 추가 모드인지에 따라 해당 상태 업데이트
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: newValue }); // 편집 중인 상품 정보 업데이트
    } else {
      setFormData({ ...formData, [name]: newValue }); // 새 상품 폼 데이터 업데이트
    }
  };

  // 새 상품 추가 처리 함수
  const handleAddProduct = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    setError(null); // 오류 상태 초기화
    try {
      // 폼 데이터를 적절한 타입으로 변환하여 상품 객체 생성
      const productToAdd = { 
        ...formData,
        price: parseFloat(formData.price), // 가격을 숫자로 변환
        stock: parseInt(formData.stock), // 재고를 정수로 변환
        rating: parseFloat(formData.rating) || 4.0, // 평점을 실수로 변환 (기본값 4.0)
        reviewCount: parseInt(formData.reviewCount) || 0, // 리뷰 수를 정수로 변환 (기본값 0)
        createdAt: new Date().toISOString() // 생성 날짜 추가
      };
      // 목 데이터 서비스를 통해 상품 생성
      const response = await mockDataService.create('Product', productToAdd);

      if (response.success) {
        // 성공 시 폼 데이터 초기화
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          imageUrl: '',
          stock: '',
          isFeatured: false,
          isBest: false,
          brand: '',
          rating: 4.0,
          reviewCount: 0
        });
        setShowAddForm(false); // 추가 폼 숨기기
        fetchProducts(); // 상품 목록 새로고침
        alert('반려용품이 추가되었습니다.'); // 성공 메시지 표시
      } else {
        setError(response.message || '반려용품 추가에 실패했습니다.'); // 오류 메시지 설정
      }
    } catch (err) {
      console.error('Failed to add product:', err); // 오류 로그 출력
      setError('반려용품 추가에 실패했습니다.'); // 오류 상태 설정
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const productToUpdate = { 
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        rating: parseFloat(editingProduct.rating) || 4.0,
        reviewCount: parseInt(editingProduct.reviewCount) || 0,
      };
      const response = await mockDataService.update('Product', editingProduct.id, productToUpdate);

      if (response.success) {
        setEditingProduct(null);
        fetchProducts();
        alert('반려용품이 수정되었습니다.');
      } else {
        setError(response.message || '반려용품 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to update product:', err);
      setError('반려용품 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await mockDataService.remove('Product', productId);

      if (response.success) {
        alert('상품이 삭제되었습니다.');
        fetchProducts();
      } else {
        setError(response.message || '상품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const toggleBestProduct = async (productId) => {
    try {
      const product = (await mockDataService.getById('products', productId)).data;
      if (product) {
        const updatedProduct = { ...product, isBest: !product.isBest };
        const response = await mockDataService.update('Product', productId, updatedProduct);
        if (response.success) {
          fetchProducts();
          alert(`상품이 ${updatedProduct.isBest ? '베스트 상품으로 설정' : '베스트 상품에서 해제'}되었습니다.`);
        } else {
          setError(response.message || '베스트상품 설정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('베스트상품 설정 실패:', error);
      alert('베스트상품 설정에 실패했습니다.');
    }
  };

  const toggleFeaturedProduct = async (productId) => {
    try {
      const product = (await mockDataService.getById('Product', productId)).data;
      if (product) {
        const updatedProduct = { ...product, isFeatured: !product.isFeatured };
        const response = await mockDataService.update('Product', productId, updatedProduct);
        if (response.success) {
          fetchProducts();
          alert(`상품이 ${updatedProduct.isFeatured ? '추천 상품으로 설정' : '추천 상품에서 해제'}되었습니다.`);
        } else {
          setError(response.message || '추천 상품 설정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('추천 상품 설정 실패:', error);
      alert('추천 상품 설정에 실패했습니다.');
    }
  };

  if (loading) return <div className={adminStyles.loading}>로딩 중...</div>;

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>반려용품 관리</h3>
      
      {error && <div className={adminStyles.errorMessage}>{error}</div>}

      {/* 검색 필터 */}
      <div className={adminStyles.userForm}>
        <input
          type="text"
          placeholder="상품명 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1); // Reset page when category changes
          }}
        >
          <option value="">모든 카테고리</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className={adminStyles.userFormButton}
        >
          {showAddForm ? '취소' : '상품 추가'}
        </button>
      </div>

      {/* 상품 추가 폼 */}
      {showAddForm && (
        <form onSubmit={handleAddProduct} className={adminStyles.userForm}>
          <input
            type="text"
            name="name"
            placeholder="상품명"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="상품 설명"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="가격"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            name="brand"
            placeholder="브랜드"
            value={formData.brand}
            onChange={handleInputChange}
          />
          <input
            type="url"
            name="imageUrl"
            placeholder="이미지 URL"
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="stock"
            placeholder="재고 수량"
            value={formData.stock}
            onChange={handleInputChange}
          />
          <div>
            <label>
              <input
                type="checkbox"
                name="isBest"
                checked={formData.isBest}
                onChange={handleInputChange}
              />
              베스트상품
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
              />
              추천 상품
            </label>
          </div>
          <button type="submit" className={adminStyles.userFormButton}>
            상품 추가
          </button>
        </form>
      )}

      {/* 상품 목록 */}
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
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                    className={adminStyles.userEditInput}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <select
                    name="category"
                    value={editingProduct.category}
                    onChange={handleInputChange}
                    className={adminStyles.userEditInput}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                ) : (
                  product.category
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    name="brand"
                    value={editingProduct.brand || ''}
                    onChange={handleInputChange}
                    className={adminStyles.userEditInput}
                  />
                ) : (
                  product.brand || '-'
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleInputChange}
                    className={adminStyles.userEditInput}
                  />
                ) : (
                  `${product.price?.toLocaleString()}원`
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct.stock || 0}
                    onChange={handleInputChange}
                    className={adminStyles.userEditInput}
                  />
                ) : (
                  product.stock || 0
                )}
              </td>
              <td>
                <button
                  onClick={() => toggleBestProduct(product.id)}
                  className={adminStyles.userActionButton}
                  style={{
                    backgroundColor: product.isBest ? '#48bb78' : '#e2e8f0',
                    color: product.isBest ? 'white' : 'black'
                  }}
                >
                  {product.isBest ? '베스트' : '일반'}
                </button>
              </td>
              <td>
                <button
                  onClick={() => toggleFeaturedProduct(product.id)}
                  className={adminStyles.userActionButton}
                  style={{
                    backgroundColor: product.isFeatured ? '#667eea' : '#e2e8f0',
                    color: product.isFeatured ? 'white' : 'black'
                  }}
                >
                  {product.isFeatured ? '추천' : '일반'}
                </button>
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <>
                    <button
                      onClick={handleUpdateProduct}
                      className={adminStyles.userActionButton}
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className={adminStyles.userActionButton}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className={adminStyles.userActionButton}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className={adminStyles.userActionButton}
                    >
                      삭제
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={adminStyles.userActionButton}
              style={{
                backgroundColor: currentPage === page ? '#667eea' : '#e2e8f0',
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

export default ProductManagement;