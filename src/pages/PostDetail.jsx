// src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunity } from '../contexts/CommunityContext';
import { useProfile } from '../context/ProfileContext'; // useProfile 훅 가져오기
import CommentSection from '../components/community/CommentSection';
import Button from '../components/ui/Button';
import styles from './PostDetail.module.css';

// PostDetail: 단일 게시글의 상세 내용과 댓글을 보여주는 페이지 컴포넌트입니다.
const PostDetail = () => {
  // --- HOOKS & CONTEXT ---
  const { boardKey, postId } = useParams(); // URL에서 게시판 키와 게시글 ID를 가져옵니다.
  const navigate = useNavigate();
  const { boardData, actions } = useCommunity(); // CommunityContext에서 데이터와 액션 함수들을 가져옵니다.
  const { userProfile } = useProfile(); // 현재 로그인된 사용자 정보 가져오기

  // --- STATE MANAGEMENT ---
  const [post, setPost] = useState(null); // 현재 게시글 데이터
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // --- EFFECTS ---
  // postId, boardKey, boardData가 변경될 때, 해당 게시판에서 게시글을 찾습니다.
  useEffect(() => {
    setIsLoading(true);
    let foundPost = null;

    if (boardKey && boardData[boardKey]) {
      const currentBoard = boardData[boardKey];
      // 공지사항과 일반 게시글을 모두 포함하여 검색합니다.
      foundPost = [...currentBoard.notices, ...currentBoard.posts].find(p => p.id.toString() === postId);
    }

    setPost(foundPost);
    setIsLoading(false);
  }, [postId, boardKey, boardData]);

  // --- AUTHORSHIP CHECK ---
  const isAuthor = userProfile?.nickname === post?.author;

  // --- HANDLER FUNCTIONS ---
  const handleLike = () => {
    if (boardKey) {
      actions.likePost(boardKey, postId);
    }
  };

  const handleEdit = () => {
    navigate(`/community/edit/${postId}`);
  };

  const handleDelete = () => {
    if (boardKey && window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      actions.deletePost(boardKey, postId);
      alert('게시글이 삭제되었습니다.');
      navigate(`/community/${boardKey}`); // 삭제 후 해당 게시판 목록으로 이동
    }
  };

  // 날짜 문자열을 'YYYY. MM. DD. HH:mm' 형식으로 포맷하는 헬퍼 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // --- RENDER ---
  if (isLoading) {
    return <div className={styles.loading}>게시글을 불러오는 중...</div>;
  }

  if (!post || !boardKey) {
    return (
      <div className="container">
        <div className={styles.error}>
          <p>게시글을 찾을 수 없습니다.</p>
          <Button variant="primary" onClick={() => navigate('/community')}>
            커뮤니티로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.postDetail}>
        <header className={styles.postHeader}>
          <div className={styles.breadcrumb}>
            <span onClick={() => navigate('/community')} className={styles.breadcrumbLink}>
              커뮤니티
            </span>
            <span className={styles.breadcrumbSeparator}>›</span> 
            <span onClick={() => navigate(`/community/${boardKey}`)} className={styles.breadcrumbLink}>
              {boardData[boardKey]?.name}
            </span>
          </div>

          <h1 className={styles.postTitle}>{post.title}</h1>

          <div className={styles.postMeta}>
            <div className={styles.authorInfo}>
              <div className={styles.authorDetails}>
                <span className={styles.authorName}>{post.author}</span>
                <div className={styles.postStats}>
                  <span>작성: {formatDate(post.createdAt)}</span>
                  {post.updatedAt && (
                    <span>수정: {formatDate(post.updatedAt)}</span>
                  )}
                  <span>조회: {post.views}</span>
                  <span>좋아요: {post.likes}</span>
                </div>
              </div>
            </div>

            {isAuthor && (
              <div className={styles.postActions}>
                <Button variant="secondary" size="small" onClick={handleEdit}>
                  수정
                </Button>
                <Button variant="danger" size="small" onClick={handleDelete}>
                  삭제
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* HTML 컨텐츠를 그대로 렌더링하기 위해 dangerouslySetInnerHTML 사용 (XSS 공격에 주의해야 함) */}
        <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />

        <footer className={styles.postFooter}>
          <div className={styles.postInteractions}>
            <Button
              variant="secondary"
              size="medium"
              onClick={handleLike}
              className={styles.likeButton}
            >
              👍 좋아요 {post.likes}
            </Button>
          </div>

          <div className={styles.postNavigation}>
            <Button
              variant="secondary" 
              onClick={() => navigate(`/community/${boardKey}`)}
            >
              목록으로
            </Button>
          </div>
        </footer>

        {/* 댓글 섹션 컴포넌트 */}
        <CommentSection postId={postId} boardKey={boardKey} />
      </div>
    </div>
  );
};

export default PostDetail;