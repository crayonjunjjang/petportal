// src/components/support/InquirySection.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './InquirySection.module.css';

const InquirySection = ({ onSuccess }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/support/inquiry-categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('카테고리 조회 오류:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.title.trim() || !formData.content.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        return;
      }

      const response = await fetch('http://localhost:3001/api/support/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          localStorage.removeItem('authToken');
          return;
        } else if (response.status === 403) {
          alert('권한이 없습니다. 로그인 상태를 확인해주세요.');
          return;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();

      if (data.success) {
        alert('문의가 성공적으로 등록되었습니다.');
        setFormData({
          category: '',
          title: '',
          content: ''
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(data.message || '문의 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('문의 등록 오류:', error);
      alert('문의 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.loginRequired}>
        <div className={styles.loginIcon}>🔒</div>
        <h3>로그인이 필요합니다</h3>
        <p>1:1 문의를 이용하려면 먼저 로그인해주세요.</p>
        <button
          className={styles.loginButton}
          onClick={() => window.location.href = '/login'}
        >
          로그인하기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>1:1 문의</h2>
        <p className={styles.description}>
          궁금한 점이나 문제가 있으시면 언제든지 문의해주세요. 빠른 시일 내에 답변드리겠습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            문의 카테고리 <span className={styles.required}>*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">카테고리를 선택해주세요</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            제목 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
            placeholder="문의 제목을 입력해주세요"
            maxLength={200}
            required
          />
          <div className={styles.charCount}>
            {formData.title.length}/200
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            문의 내용 <span className={styles.required}>*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="문의 내용을 자세히 작성해주세요"
            rows={10}
            required
          />
        </div>

        <div className={styles.submitGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '문의 등록'}
          </button>
        </div>
      </form>

      <div className={styles.notice}>
        <h3 className={styles.noticeTitle}>📢 문의 전 확인사항</h3>
        <ul className={styles.noticeList}>
          <li>FAQ에서 답변을 찾을 수 있는지 먼저 확인해보세요.</li>
          <li>문의 내용을 구체적으로 작성하시면 더 정확한 답변을 받을 수 있습니다.</li>
          <li>답변은 평일 기준 1-2일 내에 등록됩니다.</li>
          <li>욕설, 비방 등 부적절한 내용은 답변이 제한될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default InquirySection;