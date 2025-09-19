// src/components/support/FAQSection.jsx
import React, { useState, useEffect } from 'react';
import styles from './FAQSection.module.css';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchFAQs();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/support/faq-categories');
      const data = await response.json();
      if (data.success) {
        setCategories(['전체', ...data.data]);
      }
    } catch (error) {
      console.error('카테고리 조회 오류:', error);
    }
  };

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const url = selectedCategory && selectedCategory !== '전체'
        ? `http://localhost:3001/api/support/faqs?category=${encodeURIComponent(selectedCategory)}`
        : 'http://localhost:3001/api/support/faqs';

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setFaqs(data.data);
      }
    } catch (error) {
      console.error('FAQ 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (faqId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>FAQ를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>자주 묻는 질문</h2>
        <p className={styles.description}>
          자주 묻는 질문들을 확인해보세요. 원하는 답변을 찾지 못하셨다면 1:1 문의를 이용해주세요.
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${
              (selectedCategory === category ||
               (selectedCategory === '' && category === '전체'))
                ? styles.active : ''
            }`}
            onClick={() => setSelectedCategory(category === '전체' ? '' : category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ 목록 */}
      <div className={styles.faqList}>
        {faqs.length === 0 ? (
          <div className={styles.empty}>
            <p>등록된 FAQ가 없습니다.</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <button
                className={styles.questionButton}
                onClick={() => toggleExpand(faq.id)}
              >
                <div className={styles.questionHeader}>
                  <span className={styles.questionIcon}>Q</span>
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.category}>{faq.category}</span>
                </div>
                <span className={`${styles.expandIcon} ${
                  expandedItems.has(faq.id) ? styles.expanded : ''
                }`}>
                  ▼
                </span>
              </button>

              {expandedItems.has(faq.id) && (
                <div className={styles.answer}>
                  <div className={styles.answerHeader}>
                    <span className={styles.answerIcon}>A</span>
                  </div>
                  <div className={styles.answerContent}>
                    {faq.answer.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQSection;