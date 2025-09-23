import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';

const mockPosts = [
  { id: 101, title: '강아지 훈련 팁', content: '앉아, 기다려 등 기본 훈련 방법', author: '펫사랑' },
  { id: 102, title: '고양이 건강 관리', content: '정기적인 건강 검진의 중요성', author: '냥집사' },
  { id: 103, title: '새로운 사료 리뷰', content: '최신 유기농 사료에 대한 솔직한 후기', author: '먹보강아지' },
  { id: 104, title: '반려동물과 여행하기', content: '준비물과 주의사항', author: '여행가' },
];

const PostsPage = () => {
  const { searchTerm } = useSearch();
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = mockPosts.filter(post =>
        post.title.toLowerCase().includes(lowercasedSearchTerm) ||
        post.content.toLowerCase().includes(lowercasedSearchTerm) ||
        post.author.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredPosts(results);
    } else {
      setFilteredPosts(mockPosts);
    }
  }, [searchTerm]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      {filteredPosts.length > 0 ? (
        <ul>
          {filteredPosts.map(post => (
            <li key={post.id} style={{ marginBottom: '10px' }}>
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
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default PostsPage;
