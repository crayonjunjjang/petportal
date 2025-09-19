// src/pages/CustomerServicePage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import styles from './CustomerServicePage.module.css';
import {
  COMPANY_INTRO_CONTENT, ANNOUNCEMENT_CONTENT, FAQ_CONTENT, SUPPORT_CONTENT,
  TERMS_CONTENT, PRIVACY_CONTENT, YOUTH_POLICY_CONTENT, OPERATION_POLICY_CONTENT,
  INQUIRY_CONTENT, INQUIRY_CATEGORIES
} from '../utils/constants';

const CustomerServicePage = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('companyIntro');
  const [modalContent, setModalContent] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    title: '',
    category: '서비스 이용',
    content: ''
  });

  // URL에 따라 활성 카테고리 설정
  useEffect(() => {
    const pathToCategory = {
      '/about': 'companyIntro',
      '/notice': 'announcements',
      '/faq': 'faq',
      '/support': 'support',
      '/inquiry': 'inquiry',
      '/terms': 'terms',
      '/privacy': 'privacy',
      '/youth': 'youthPolicy',
      '/policy': 'operationPolicy',
      '/customerservice': 'companyIntro'
    };
    
    const category = pathToCategory[location.pathname] || 'companyIntro';
    setActiveCategory(category);
  }, [location.pathname]);

  const categories = [
    { id: 'companyIntro', name: '회사소개', content: COMPANY_INTRO_CONTENT, type: 'single' },
    { id: 'announcements', name: '공지사항', content: ANNOUNCEMENT_CONTENT, type: 'board' },
    { id: 'faq', name: '자주 묻는 질문', content: FAQ_CONTENT, type: 'faq' },
    { id: 'support', name: '고객지원', content: SUPPORT_CONTENT, type: 'single' },
    { id: 'inquiry', name: '1:1 문의', content: INQUIRY_CONTENT, type: 'inquiry' },
    { id: 'terms', name: '이용약관', content: TERMS_CONTENT, type: 'single' },
    { id: 'privacy', name: '개인정보처리방침', content: PRIVACY_CONTENT, type: 'single' },
    { id: 'youthPolicy', name: '청소년보호정책', content: YOUTH_POLICY_CONTENT, type: 'single' },
    { id: 'operationPolicy', name: '운영정책', content: OPERATION_POLICY_CONTENT, type: 'single' },
  ];

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    // 실제로는 서버에 데이터를 전송
    alert('문의가 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setShowInquiryForm(false);
    setInquiryForm({ title: '', category: '서비스 이용', content: '' });
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setIsMobileMenuOpen(false); // 모바일에서 카테고리 선택 시 메뉴 닫기
  };

  const renderContent = () => {
    const category = categories.find(cat => cat.id === activeCategory);
    if (!category) return <p>카테고리를 선택해주세요.</p>;

    if (category.type === 'single') {
      return (
        <div className={styles.contentBlock}>
          <h3>{category.name}</h3>
          <pre className={styles.preformattedContent}>{category.content}</pre>
        </div>
      );
    } else if (category.type === 'board') {
      // 공지사항 게시판 형태
      return (
        <div className={styles.boardContainer}>
          <div className={styles.boardHeader}>
            <h3>{category.name}</h3>
            <span className={styles.totalCount}>총 {category.content.length}건</span>
          </div>
          <div className={styles.boardList}>
            <div className={styles.boardListHeader}>
              <span className={styles.headerTitle}>제목</span>
              <span className={styles.headerAuthor}>작성자</span>
              <span className={styles.headerDate}>등록일</span>
              <span className={styles.headerViews}>조회수</span>
            </div>
            {category.content.map((item) => (
              <div key={item.id} className={styles.boardItem} onClick={() => setModalContent({ 
                title: item.title, 
                content: item.content, 
                author: item.author, 
                date: item.date,
                type: 'board'
              })}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemAuthor}>{item.author}</span>
                <span className={styles.itemDate}>{item.date}</span>
                <span className={styles.itemViews}>{item.views}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (category.type === 'faq') {
      // FAQ 아코디언 형태
      return (
        <div className={styles.faqContainer}>
          <div className={styles.faqHeader}>
            <h3>{category.name}</h3>
            <span className={styles.totalCount}>총 {category.content.length}건</span>
          </div>
          <div className={styles.faqList}>
            {category.content.map((item) => (
              <div key={item.id} className={styles.faqItem}>
                <div className={styles.faqQuestion} onClick={() => setModalContent({ 
                  title: `[${item.category}] ${item.question}`, 
                  content: item.answer, 
                  views: item.views,
                  type: 'faq'
                })}>
                  <span className={styles.questionCategory}>[{item.category}]</span>
                  <span className={styles.questionText}>{item.question}</span>
                  <span className={styles.questionViews}>조회 {item.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (category.type === 'inquiry') {
      // 1:1 문의 게시판
      return (
        <div className={styles.inquiryContainer}>
          <div className={styles.inquiryHeader}>
            <h3>{category.name}</h3>
            <button className={styles.writeButton} onClick={() => setShowInquiryForm(true)}>
              문의하기
            </button>
          </div>
          <div className={styles.inquiryList}>
            <div className={styles.inquiryListHeader}>
              <span className={styles.headerTitle}>제목</span>
              <span className={styles.headerCategory}>분류</span>
              <span className={styles.headerDate}>등록일</span>
              <span className={styles.headerStatus}>상태</span>
            </div>
            {category.content.map((item) => (
              <div key={item.id} className={styles.inquiryItem} onClick={() => setModalContent({ 
                title: item.title, 
                content: item.content, 
                answer: item.answer,
                answerDate: item.answerDate,
                category: item.category,
                date: item.date,
                status: item.status,
                type: 'inquiry'
              })}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemCategory}>{item.category}</span>
                <span className={styles.itemDate}>{item.date}</span>
                <span className={`${styles.itemStatus} ${item.status === '답변완료' ? styles.completed : styles.waiting}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  const renderModal = () => {
    if (!modalContent) return null;

    if (modalContent.type === 'inquiry') {
      return (
        <div className={styles.modalOverlay} onClick={() => setModalContent(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalContent.title}</h3>
              <button className={styles.closeButton} onClick={() => setModalContent(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inquiryDetails}>
                <div className={styles.inquiryMeta}>
                  <span>분류: {modalContent.category}</span>
                  <span>등록일: {modalContent.date}</span>
                  <span className={`${styles.status} ${modalContent.status === '답변완료' ? styles.completed : styles.waiting}`}>
                    {modalContent.status}
                  </span>
                </div>
                <div className={styles.inquiryContent}>
                  <h4>문의 내용</h4>
                  <p>{modalContent.content}</p>
                </div>
                {modalContent.answer && (
                  <div className={styles.inquiryAnswer}>
                    <h4>답변 ({modalContent.answerDate})</h4>
                    <p>{modalContent.answer}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.modalOverlay} onClick={() => setModalContent(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalContent.title}</h3>
              <button className={styles.closeButton} onClick={() => setModalContent(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              {modalContent.author && (
                <div className={styles.postMeta}>
                  <span>작성자: {modalContent.author}</span>
                  <span>등록일: {modalContent.date}</span>
                </div>
              )}
              <pre className={styles.preformattedContent}>{modalContent.content}</pre>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      <main className={styles.customerServicePage}>
        {/* 모바일 햄버거 메뉴 버튼 */}
        <div className={styles.mobileMenuToggle}>
          <button 
            className={styles.hamburgerButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
          <h2 className={styles.mobileTitle}>고객센터</h2>
        </div>

        {/* 데스크탑 사이드바 */}
        <div className={styles.sidebar}>
          <h2>고객센터</h2>
          <ul>
            {categories.map(cat => (
              <li key={cat.id}>
                <button
                  className={`${styles.sidebarButton} ${activeCategory === cat.id ? styles.active : ''}`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 모바일 메뉴 오버레이 */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenuOverlay} onClick={() => setIsMobileMenuOpen(false)}>
            <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
              <div className={styles.mobileMenuHeader}>
                <h3>카테고리</h3>
                <button 
                  className={styles.mobileMenuClose}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ×
                </button>
              </div>
              <ul className={styles.mobileMenuList}>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`${styles.mobileMenuButton} ${activeCategory === cat.id ? styles.active : ''}`}
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className={styles.mainContent}>
          {renderContent()}
        </div>

        {renderModal()}

        {showInquiryForm && (
          <div className={styles.modalOverlay} onClick={() => setShowInquiryForm(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>1:1 문의하기</h3>
                <button className={styles.closeButton} onClick={() => setShowInquiryForm(false)}>×</button>
              </div>
              <div className={styles.modalBody}>
                <form onSubmit={handleInquirySubmit} className={styles.inquiryForm}>
                  <div className={styles.formGroup}>
                    <label>문의 분류</label>
                    <select 
                      value={inquiryForm.category}
                      onChange={(e) => setInquiryForm({...inquiryForm, category: e.target.value})}
                    >
                      {INQUIRY_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>제목</label>
                    <input
                      type="text"
                      value={inquiryForm.title}
                      onChange={(e) => setInquiryForm({...inquiryForm, title: e.target.value})}
                      placeholder="문의 제목을 입력해주세요"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>문의 내용</label>
                    <textarea
                      value={inquiryForm.content}
                      onChange={(e) => setInquiryForm({...inquiryForm, content: e.target.value})}
                      placeholder="문의 내용을 상세히 입력해주세요"
                      rows="6"
                      required
                    />
                  </div>
                  <div className={styles.formButtons}>
                    <button type="button" onClick={() => setShowInquiryForm(false)}>취소</button>
                    <button type="submit">등록</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      
    </div>
  );
};

export default CustomerServicePage;