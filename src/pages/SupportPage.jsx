// src/pages/SupportPage.jsx

// --- 파일 역할: '고객센터'의 메인 페이지 ---
// 이 컴포넌트는 고객센터의 전체적인 레이아웃을 구성하고,
// URL 경로에 따라 '공지사항', 'FAQ', '1:1 문의' 등 적절한 하위 섹션을 렌더링하는 라우팅 허브 역할을 합니다.
// `CommunityPage`와 유사한 2단 레이아웃(사이드바 + 메인 콘텐츠) 구조를 가집니다.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CommunityPage.module.css'; // 커뮤니티 페이지와 동일한 레이아웃 스타일을 재사용
import SupportBoardNav from '../components/support/SupportBoardNav'; // 고객센터 사이드바 네비게이션
// 각 섹션별 컴포넌트 임포트
import FAQSection from '../components/support/FAQSection';
import NoticeSection from '../components/support/NoticeSection';
import InquirySection from '../components/support/InquirySection';
import MyInquiriesSection from '../components/support/MyInquiriesSection';

// 고객센터에서 사용될 게시판(섹션)의 정보
const supportBoards = {
  'notices': { name: '공지사항', description: '중요한 공지사항과 업데이트 소식을 확인하세요.' },
  'faq': { name: 'FAQ', description: '자주 묻는 질문과 답변을 확인하세요.' },
  'inquiry': { name: '1:1 문의', description: '개인적인 문의사항을 등록하고 답변을 받아보세요.' },
  'my-inquiries': { name: '내 문의내역', description: '작성한 문의내역과 답변을 확인하세요.' }
};

// --- SupportPage Component ---
const SupportPage = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  // URL 파라미터에서 현재 게시판 키를 가져옵니다. 없으면 'notices'를 기본값으로 사용합니다.
  const { boardKey = 'notices' } = useParams();
  const navigate = useNavigate();
  const [activeBoard, setActiveBoard] = useState(boardKey); // 현재 활성화된 게시판 상태

  // --- EFFECTS (상태 동기화) ---
  // URL의 boardKey가 변경될 때마다 activeBoard 상태를 동기화합니다.
  useEffect(() => {
    setActiveBoard(boardKey);
  }, [boardKey]);

  // --- EVENT HANDLERS (이벤트 처리 함수) ---
  // 네비게이션 메뉴에서 다른 게시판을 클릭했을 때 호출되는 함수
  const handleBoardChange = (newBoardKey) => {
    navigate(`/support/${newBoardKey}`); // URL을 변경하여 페이지를 전환합니다.
  };

  // --- RENDER LOGIC (렌더링 로직) ---
  // activeBoard 상태에 따라 적절한 섹션 컴포넌트를 렌더링하는 함수
  const renderContent = () => {
    switch (activeBoard) {
      case 'notices':
        return <NoticeSection />;
      case 'faq':
        return <FAQSection />;
      case 'inquiry':
        // 1:1 문의 작성 성공 시 '내 문의내역'으로 이동하도록 콜백 함수를 전달합니다.
        return <InquirySection onSuccess={() => handleBoardChange('my-inquiries')} />;
      case 'my-inquiries':
        return <MyInquiriesSection />;
      default:
        return <NoticeSection />; // 유효하지 않은 boardKey일 경우 기본값으로 공지사항을 보여줌
    }
  };

  // 현재 활성화된 게시판의 정보 (제목, 설명)
  const currentBoard = supportBoards[activeBoard] || supportBoards['notices'];

  // --- RENDER (최종 렌더링) ---
  return (
    <div className="container">
      <div className={styles.pageLayout}>
        {/* 왼쪽 사이드바 */}
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

        {/* 오른쪽 메인 콘텐츠 */}
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
