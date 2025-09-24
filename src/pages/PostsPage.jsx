// src/pages/PostsPage.jsx

// --- 파일 역할: 검색 결과 등, 특정 조건에 맞는 게시글 목록을 보여주는 페이지 ---
// 이 컴포넌트는 `SearchContext`로부터 검색어(searchTerm)를 받아,
// 미리 정의된 목(mock) 데이터인 `mockPosts`에서 해당 검색어를 포함하는 게시글을 필터링하여 보여줍니다.
// 주로 전역 검색 기능의 결과 페이지로 사용될 수 있습니다.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext'; // 전역 검색어 상태를 가져오기 위한 훅

// 임시 게시글 데이터. 실제 애플리케이션에서는 API를 통해 받아옵니다.
const mockPosts = [
  { id: 101, title: '강아지 훈련 팁', content: '앉아, 기다려 등 기본 훈련 방법', author: '펫사랑' },
  { id: 102, title: '고양이 건강 관리', content: '정기적인 건강 검진의 중요성', author: '냥집사' },
  { id: 103, title: '새로운 사료 리뷰', content: '최신 유기농 사료에 대한 솔직한 후기', author: '먹보강아지' },
  { id: 104, title: '반려동물과 여행하기', content: '준비물과 주의사항', author: '여행가' },
];

// --- PostsPage Component ---
const PostsPage = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const { searchTerm } = useSearch(); // SearchContext에서 현재 검색어를 가져옵니다.
  const [filteredPosts, setFilteredPosts] = useState(mockPosts); // 화면에 표시할 필터링된 게시글 목록

  // --- EFFECTS (데이터 필터링) ---
  // searchTerm이 변경될 때마다 게시글 목록을 다시 필터링합니다.
  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      // 제목, 내용, 작성자에 검색어가 포함된 게시글만 필터링합니다.
      const results = mockPosts.filter(post =>
        post.title.toLowerCase().includes(lowercasedSearchTerm) ||
        post.content.toLowerCase().includes(lowercasedSearchTerm) ||
        post.author.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredPosts(results);
    } else {
      // 검색어가 없으면 전체 게시글을 보여줍니다.
      setFilteredPosts(mockPosts);
    }
  }, [searchTerm]);

  // --- RENDER (렌더링) ---
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      {filteredPosts.length > 0 ? (
        // 필터링된 게시글이 있을 경우, 목록을 렌더링합니다.
        <ul>
          {filteredPosts.map(post => (
            <li key={post.id} style={{ marginBottom: '10px' }}>
              {/* 각 게시글은 상세 페이지로 연결되는 링크를 가집니다. */}
              <Link to={`/community/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <strong>{post.title}</strong> (작성자: {post.author})
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#555' }}>
                  {post.content}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        // 필터링된 게시글이 없을 경우, 메시지를 표시합니다.
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default PostsPage;