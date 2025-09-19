// src/pages/SupportPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CommunityPage.module.css'; // 커뮤니티와 동일한 스타일 사용
import SupportBoardNav from '../components/support/SupportBoardNav';
import FAQSection from '../components/support/FAQSection';
import NoticeSection from '../components/support/NoticeSection';
import InquirySection from '../components/support/InquirySection';
import MyInquiriesSection from '../components/support/MyInquiriesSection';

const supportBoards = {
  'notices': { name: '공지사항', description: '중요한 공지사항과 업데이트 소식을 확인하세요.' },
  'faq': { name: 'FAQ', description: '자주 묻는 질문과 답변을 확인하세요.' },
  'inquiry': { name: '1:1 문의', description: '개인적인 문의사항을 등록하고 답변을 받아보세요.' },
  'my-inquiries': { name: '내 문의내역', description: '작성한 문의내역과 답변을 확인하세요.' }
};

const SupportPage = () => {
  const { boardKey = 'notices' } = useParams();
  const navigate = useNavigate();
  const [activeBoard, setActiveBoard] = useState(boardKey);

  useEffect(() => {
    setActiveBoard(boardKey);
  }, [boardKey]);

  const handleBoardChange = (newBoardKey) => {
    navigate(`/support/${newBoardKey}`);
  };

  const renderContent = () => {
    switch (activeBoard) {
      case 'notices':
        return <NoticeSection />;
      case 'faq':
        return <FAQSection />;
      case 'inquiry':
        return <InquirySection onSuccess={() => handleBoardChange('my-inquiries')} />;
      case 'my-inquiries':
        return <MyInquiriesSection />;
      default:
        return <NoticeSection />;
    }
  };

  const currentBoard = supportBoards[activeBoard] || supportBoards['notices'];

  return (
    <div className="container">
      <div className={styles.pageLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>고객센터</h2>
            <p className={styles.sidebarDescription}>
              도움이 필요하신가요? 궁금한 점을 해결해드리겠습니다.
            </p>
          </div>
          <SupportBoardNav
            boards={supportBoards}
            activeBoard={activeBoard}
            onBoardChange={handleBoardChange}
          />
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <div className={styles.boardInfo}>
              <h1 className={styles.boardTitle}>{currentBoard.name}</h1>
              <p className={styles.boardDescription}>{currentBoard.description}</p>
            </div>
          </div>

          <div className={styles.contentBody}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupportPage;