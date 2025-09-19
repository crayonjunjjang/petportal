// src/pages/CommunityPage.jsx
import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import communityStyles from './CommunityPage.module.css';
import layoutStyles from './commonLayout.module.css';

import { useCommunity } from '../contexts/CommunityContext';
import BoardNav from '../components/community/BoardNav';
import Board from '../components/community/Board';
import Button from '../components/ui/Button';
import Pagination from '../components/common/Pagination';

// boardsMeta: 각 게시판의 메타데이터(이름, 설명)를 정의하는 객체입니다.
const boardsMeta = {
  'free-talk': { name: '자유게시판', description: '반려동물에 대한 이야기를 자유롭게 나눠보세요.' },
  'pet-showcase': { name: '펫 자랑 게시판', description: '사랑스러운 반려동물의 사진과 영상을 마음껏 자랑해주세요.' },
  'info-share': { name: '정보공유 게시판', description: '사료, 간식, 병원, 꿀팁 등 유용한 정보를 공유해요.' },
  'qna': { name: 'Q&A 게시판', description: '반려동물을 키우면서 궁금한 점을 물어보세요.' },
  'adoption': { name: '나눔/분양 게시판', description: '따뜻한 마음을 나눠주세요.' },
  'meetups': { name: '산책/모임 게시판', description: '지역별 산책 친구, 정기 모임을 찾아보세요.' },
  'missing': { name: '실종/보호 게시판', description: '소중한 가족을 찾습니다.' },
  'reviews': { name: '펫 동반 장소 후기', description: '함께 갈 수 있는 멋진 장소를 추천해주세요.' },
};

const POSTS_PER_PAGE = 5; // 페이지 당 보여줄 게시글 수

// CommunityPage: 커뮤니티의 메인 페이지로, 게시판 목록과 선택된 게시판의 게시글들을 보여줍니다.
const CommunityPage = () => {
  // --- HOOKS & CONTEXT ---
  // useParams를 통해 URL에서 현재 활성화된 게시판의 키(boardKey)를 가져옵니다. 기본값은 'free-talk'.
  const { boardKey: activeBoardKey = 'free-talk' } = useParams();
  // useCommunity 훅으로 CommunityContext의 전체 게시판 데이터(boardData)를 가져옵니다.
  const { boardData } = useCommunity();
  
  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [searchTerm, setSearchTerm] = useState(''); // 검색어

  // --- DERIVED DATA ---
  // 현재 활성화된 게시판의 데이터와 메타데이터를 가져옵니다.
  const activeBoardData = boardData[activeBoardKey];
  const activeBoardMeta = boardsMeta[activeBoardKey];

  // useMemo를 사용하여 검색어(searchTerm)가 변경될 때만 필터링을 다시 실행합니다.
  const filteredPosts = useMemo(() => {
    if (!activeBoardData) return [];
    return activeBoardData.posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeBoardData, searchTerm]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // --- HANDLER FUNCTIONS ---
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.searchInput.value;
    setSearchTerm(searchInput);
    setCurrentPage(1); // 검색 시 1페이지로 초기화
  };

  // --- RENDER ---
  // 유효하지 않은 boardKey일 경우 에러 메시지 표시
  if (!activeBoardData || !activeBoardMeta) {
      return <div>게시판을 찾을 수 없습니다.</div>;
  }

  return (
    <div className={layoutStyles.pageContainer}>
      <main className={layoutStyles.pageLayout}>
        {/* 사이드바: 게시판 네비게이션 */}
        <div className={layoutStyles.sidebar}>
          <BoardNav
            boards={boardsMeta}
            activeBoard={activeBoardKey}
          />
        </div>
        
        {/* 메인 컨텐츠: 선택된 게시판의 내용 */}
        <div className={layoutStyles.mainContent}>
          <header className={communityStyles.boardHeader}>
            <h1>{activeBoardMeta.name}</h1>
            <p>{activeBoardMeta.description}</p>
          </header>
          
          {/* 글쓰기 버튼 및 검색 바 */}
          <div className={communityStyles.boardControls}>
            <form className={communityStyles.searchBar} onSubmit={handleSearch}>
              <input type="text" name="searchInput" placeholder="궁금한 내용을 검색해보세요." />
              <Button type="submit" variant="secondary" size="medium">검색</Button>
            </form>
            <Link to={`/community/${activeBoardKey}/new`}>
              <Button variant="primary" size="medium">글쓰기</Button>
            </Link>
          </div>
          
          {/* 게시글 목록 (공지사항과 일반 게시글) */}
          <Board
            notices={activeBoardData.notices || []}
            posts={paginatedPosts}
            boardKey={activeBoardKey}
          />
          
          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;