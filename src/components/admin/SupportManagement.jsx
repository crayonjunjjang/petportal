// src/components/admin/SupportManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminStyles from './Admin.module.css';
import { mockDataService } from '../../utils/mockDataService';

const initialInquiryData = [
  {
    id: 1,
    category: '결제',
    title: '결제 오류 문의',
    content: '신용카드 결제가 실패했습니다. 확인 부탁드립니다.',
    user: { id: 1, username: '사용자1' },
    status: 'pending',
    createdAt: '2023-01-01T10:00:00Z',
    adminResponse: '',
  },
  {
    id: 2,
    category: '서비스',
    title: '예약 변경 문의',
    content: '예약 시간을 변경하고 싶습니다. 어떻게 해야 하나요?',
    user: { id: 2, username: '사용자2' },
    status: 'answered',
    createdAt: '2023-01-02T11:00:00Z',
    adminResponse: '예약 변경은 마이페이지에서 직접 가능합니다.',
  },
  {
    id: 3,
    category: '기타',
    title: '사이트 이용 문의',
    content: '사이트 이용 중 궁금한 점이 있습니다.',
    user: { id: 1, username: '사용자1' },
    status: 'pending',
    createdAt: '2023-01-03T12:00:00Z',
    adminResponse: '',
  },
];

const initialFaqData = [
  {
    id: 1,
    category: '일반',
    question: '회원가입은 어떻게 하나요?',
    answer: '사이트 우측 상단의 회원가입 버튼을 통해 간단하게 가입할 수 있습니다.',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    category: '이용방법',
    question: '예약 취소는 어떻게 하나요?',
    answer: '마이페이지 > 예약 내역에서 취소할 수 있습니다. 취소 규정을 확인해주세요.',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    category: '결제',
    question: '결제 수단에는 어떤 것이 있나요?',
    answer: '신용카드, 계좌이체, 간편결제 등 다양한 결제 수단을 지원합니다.',
    order: 3,
    isActive: true,
  },
];

const initialNoticeData = [
  {
    id: 1,
    title: '사이트 점검 안내 (01/15)',
    content: '더 나은 서비스를 위해 1월 15일 오전 2시부터 4시까지 시스템 점검이 진행됩니다.',
    isImportant: true,
    isActive: true,
    createdAt: '2023-01-10T09:00:00Z',
  },
  {
    id: 2,
    title: '개인정보처리방침 개정 안내',
    content: '개인정보처리방침이 개정되어 안내드립니다. 자세한 내용은 공지사항을 확인해주세요.',
    isImportant: false,
    isActive: true,
    createdAt: '2023-01-05T10:00:00Z',
  },
];

const SupportManagement = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    mockDataService.initialize('inquiries', initialInquiryData);
    mockDataService.initialize('faqs', initialFaqData);
    mockDataService.initialize('notices', initialNoticeData);
    fetchData();
  }, [activeTab, isAdminAuthenticated]);

  const fetchData = async () => {
    if (!isAdminAuthenticated) {
      setInquiries([]);
      setFaqs([]);
      setNotices([]);
      return;
    }

    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'inquiries':
          response = await mockDataService.getAll('inquiries');
          if (response.success) {
            setInquiries(response.data);
          }
          break;
        case 'faqs':
          response = await mockDataService.getAll('faqs');
          if (response.success) {
            setFaqs(response.data);
          }
          break;
        case 'notices':
          response = await mockDataService.getAll('notices');
          if (response.success) {
            setNotices(response.data);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Failed to load support center data:', error);
      if (activeTab === 'inquiries') setInquiries([]);
      if (activeTab === 'faqs') setFaqs([]);
      if (activeTab === 'notices') setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (activeTab === 'faqs') {
        if (editingItem) {
          response = await mockDataService.update('faqs', editingItem.id, formData);
        } else {
          response = await mockDataService.create('faqs', { ...formData, createdAt: new Date().toISOString() });
        }
      } else if (activeTab === 'notices') {
        if (editingItem) {
          response = await mockDataService.update('notices', editingItem.id, formData);
        } else {
          response = await mockDataService.create('notices', { ...formData, createdAt: new Date().toISOString() });
        }
      } else if (activeTab === 'inquiries') {
        if (!editingItem) return;
        // For inquiries, we only update adminResponse and status
        response = await mockDataService.update('inquiries', editingItem.id, { 
          adminResponse: formData.adminResponse,
          status: formData.status,
        });
      }

      if (response.success) {
        await fetchData();
        setEditingItem(null);
        setFormData({});
        alert(editingItem ? 'Updated successfully.' : 'Created successfully.');
      } else {
        alert(response.message || 'An error occurred while processing the request.');
      }
    } catch (error) {
      console.error('Failed to save support center data:', error);
      alert('An error occurred while processing the request.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      let response;
      if (activeTab === 'faqs') {
        response = await mockDataService.remove('faqs', id);
      } else if (activeTab === 'notices') {
        response = await mockDataService.remove('notices', id);
      }

      if (response.success) {
        await fetchData();
        alert('Deleted successfully.');
      } else {
        alert(response.message || 'An error occurred while processing the request.');
      }
    } catch (error) {
      console.error('Failed to delete support center data:', error);
      alert('An error occurred while processing the request.');
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderInquiries = () => (
    <div>
      <h3>1:1 문의 관리</h3>
      {loading ? (
        <div className={adminStyles.loading}>로딩 중...</div>
      ) : (
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry.id}>
                  <td>{inquiry.category}</td>
                  <td>{inquiry.title}</td>
                  <td>{inquiry.user?.username || '사용자없음'}</td>
                  <td>
                    <span className={`${adminStyles.badge} ${
                      inquiry.status === 'pending' ? adminStyles.badgePending :
                      inquiry.status === 'answered' ? adminStyles.badgeAnswered :
                      adminStyles.badgeClosed
                    }`}>
                      {inquiry.status === 'pending' ? '답변대기' :
                       inquiry.status === 'answered' ? '답변완료' : '문의종료'}
                    </span>
                  </td>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => startEdit(inquiry)}
                      className={adminStyles.editButton}
                    >
                      {inquiry.status === 'pending' ? '답변하기' : '수정하기'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingItem && (
        <div className={adminStyles.modal}>
          <div className={adminStyles.modalContent}>
            <h4>문의 답변</h4>
            <div className={adminStyles.modalSection}>
              <strong>문의 내용:</strong>
              <p>{editingItem.content}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={adminStyles.formGroup}>
                <label>답변 내용:</label>
                <textarea
                  value={formData.adminResponse || ''}
                  onChange={(e) => setFormData({...formData, adminResponse: e.target.value})}
                  required
                  rows={6}
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>상태:</label>
                <select
                  value={formData.status || 'answered'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="answered">답변완료</option>
                  <option value="closed">문의종료</option>
                </select>
              </div>
              <div className={adminStyles.modalButtons}>
                <button type="submit" className={adminStyles.submitButton}>저장</button>
                <button type="button" onClick={() => setEditingItem(null)} className={adminStyles.cancelButton}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderFAQs = () => (
    <div>
      <div className={adminStyles.sectionHeader}>
        <h3>FAQ 관리</h3>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({ category: '일반', question: '', answer: '', order: 0, isActive: true });
          }}
          className={adminStyles.addButton}
        >
          FAQ 추가
        </button>
      </div>

      {loading ? (
        <div className={adminStyles.loading}>로딩 중...</div>
      ) : (
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>카테고리</th>
                <th>질문</th>
                <th>순서</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map(faq => (
                <tr key={faq.id}>
                  <td>{faq.category}</td>
                  <td>{faq.question}</td>
                  <td>{faq.order}</td>
                  <td>
                    <span className={`${adminStyles.badge} ${faq.isActive ? adminStyles.badgeActive : adminStyles.badgeInactive}`}>
                      {faq.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => startEdit(faq)} className={adminStyles.editButton}>수정</button>
                    <button onClick={() => handleDelete(faq.id)} className={adminStyles.deleteButton}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editingItem || formData.question !== undefined) && (
        <div className={adminStyles.modal}>
          <div className={adminStyles.modalContent}>
            <h4>{editingItem ? 'FAQ 수정' : 'FAQ 추가'}</h4>
            <form onSubmit={handleSubmit}>
              <div className={adminStyles.formGroup}>
                <label>카테고리:</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="일반">일반</option>
                  <option value="이용방법">이용방법</option>
                  <option value="결제">결제</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className={adminStyles.formGroup}>
                <label>질문:</label>
                <input
                  type="text"
                  value={formData.question || ''}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  required
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>답변:</label>
                <textarea
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  required
                  rows={4}
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>순서:</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  활성화
                </label>
              </div>
              <div className={adminStyles.modalButtons}>
                <button type="submit" className={adminStyles.submitButton}>저장</button>
                <button type="button" onClick={() => {setEditingItem(null); setFormData({});}} className={adminStyles.cancelButton}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderNotices = () => (
    <div>
      <div className={adminStyles.sectionHeader}>
        <h3>공지사항 관리</h3>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({ title: '', content: '', isImportant: false, isActive: true });
          }}
          className={adminStyles.addButton}
        >
          공지 추가
        </button>
      </div>

      {loading ? (
        <div className={adminStyles.loading}>로딩 중...</div>
      ) : (
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>제목</th>
                <th>중요</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.map(notice => (
                <tr key={notice.id}>
                  <td>{notice.title}</td>
                  <td>
                    <span className={`${adminStyles.badge} ${notice.isImportant ? adminStyles.badgeImportant : adminStyles.badgeNormal}`}>
                      {notice.isImportant ? '중요' : '일반'}
                    </span>
                  </td>
                  <td>
                    <span className={`${adminStyles.badge} ${notice.isActive ? adminStyles.badgeActive : adminStyles.badgeInactive}`}>
                      {notice.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td>{formatDate(notice.createdAt)}</td>
                  <td>
                    <button onClick={() => startEdit(notice)} className={adminStyles.editButton}>수정</button>
                    <button onClick={() => handleDelete(notice.id)} className={adminStyles.deleteButton}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editingItem || formData.title !== undefined) && (
        <div className={adminStyles.modal}>
          <div className={adminStyles.modalContent}>
            <h4>{editingItem ? '공지사항 수정' : '공지사항 추가'}</h4>
            <form onSubmit={handleSubmit}>
              <div className={adminStyles.formGroup}>
                <label>제목:</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>내용:</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows={6}
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isImportant || false}
                    onChange={(e) => setFormData({...formData, isImportant: e.target.checked})}
                  />
                  중요 공지
                </label>
              </div>
              <div className={adminStyles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  활성화
                </label>
              </div>
              <div className={adminStyles.modalButtons}>
                <button type="submit" className={adminStyles.submitButton}>저장</button>
                <button type="button" onClick={() => {setEditingItem(null); setFormData({});}} className={adminStyles.cancelButton}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={adminStyles.managementContainer}>
      <div className={adminStyles.tabContainer}>
        <button
          className={`${adminStyles.tab} ${activeTab === 'inquiries' ? adminStyles.activeTab : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          1:1 문의
        </button>
        <button
          className={`${adminStyles.tab} ${activeTab === 'faqs' ? adminStyles.activeTab : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          FAQ
        </button>
        <button
          className={`${adminStyles.tab} ${activeTab === 'notices' ? adminStyles.activeTab : ''}`}
          onClick={() => setActiveTab('notices')}
        >
          공지사항
        </button>
      </div>

      <div className={adminStyles.tabContent}>
        {activeTab === 'inquiries' && renderInquiries()}
        {activeTab === 'faqs' && renderFAQs()}
        {activeTab === 'notices' && renderNotices()}
      </div>
    </div>
  );
};

export default SupportManagement;