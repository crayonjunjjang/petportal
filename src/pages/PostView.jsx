// src/pages/PostView.jsx

// --- 파일 역할: 단일 게시글을 보여주는 상세 페이지 (대체 버전) ---
// 이 컴포넌트는 `PostDetail.jsx`와 유사하게 특정 게시글의 내용과 댓글을 보여줍니다.
// 차이점은 `CommunityContext` 대신 `mockDataService`를 직접 사용하여 데이터를 가져오고,
// 댓글 기능 등을 자체적으로 처리한다는 점입니다.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 인증 컨텍스트
import styles from './PostView.module.css';
import { mockDataService } from '../utils/mockDataService'; // 목 데이터 서비스

// --- PostView Component ---
const PostView = () => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const { postId } = useParams(); // URL에서 게시글 ID를 가져옵니다.
  const navigate = useNavigate();
  const { user } = useAuth(); // 현재 로그인된 사용자 정보
  const [post, setPost] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const [newComment, setNewComment] = useState(''); // 새로 작성 중인 댓글 내용

  // --- EFFECTS (데이터 로딩) ---
  // postId가 변경될 때마다 게시글과 댓글 데이터를 다시 불러옵니다.
  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  // 게시글과 댓글 데이터를 비동기적으로 가져오는 함수
  const fetchPostAndComments = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. 게시글 데이터 가져오기
      const postResponse = await mockDataService.getById('posts', parseInt(postId));
      if (postResponse.success) {
        setPost(postResponse.data);
      } else {
        setError(postResponse.message || '게시글을 불러오는데 실패했습니다.');
        setLoading(false);
        return;
      }

      // 2. 댓글 데이터 가져오기
      const commentsResponse = await mockDataService.getAll('comments');
      if (commentsResponse.success) {
        // 현재 게시글에 해당하는 댓글만 필터링하고, 작성 시간순으로 정렬합니다.
        const filteredComments = commentsResponse.data.filter(comment => comment.postId === parseInt(postId));
        setComments(filteredComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      } else {
        setError(commentsResponse.message || '댓글을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error fetching post or comments:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // --- EVENT HANDLERS (이벤트 처리 함수) ---

  // '좋아요' 버튼 클릭 처리
  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!post) return;

    try {
      // '좋아요' 수를 1 증가시키는 로직 (데모용)
      const updatedPost = { ...post, likes: post.likes + 1 };
      const response = await mockDataService.update('posts', post.id, updatedPost);
      if (response.success) {
        setPost(response.data); // 화면에 즉시 반영
      } else {
        alert(response.message || '좋아요 처리에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error liking post:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // 새 댓글 추가 처리
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (!post) return;

    try {
      const commentData = {
        postId: post.id,
        content: newComment,
        authorId: user.id,
        author_name: user.nickname || user.email.split('@')[0],
        createdAt: new Date().toISOString(),
        parentCommentId: null, // 데모에서는 대댓글 미지원
      };
      const response = await mockDataService.create('comments', commentData);
      if (response.success) {
        setNewComment(''); // 입력창 초기화
        fetchPostAndComments(); // 댓글 목록 새로고침
      } else {
        alert(response.message || '댓글 추가에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('댓글 추가에 실패했습니다.');
    }
  };

  // --- RENDER (렌더링) ---
  if (loading) return <div className={styles.container}>게시글을 불러오는 중...</div>;
  if (error) return <div className={styles.container} style={{ color: 'red' }}>오류: {error}</div>;
  if (!post) return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      {/* 게시글 헤더 */}
      <div className={styles.postHeader}>
        <h1>{post.title}</h1>
        <div className={styles.postMeta}>
          <span>작성자: {post.author_name}</span>
          <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
          <span>조회수: {post.views}</span>
          <span>좋아요: {post.likes}</span>
        </div>
      </div>
      {/* 게시글 본문 */}
      <div className={styles.postContent}>
        <p>{post.content}</p>
      </div>
      {/* 게시글 액션 버튼 */}
      <div className={styles.postActions}>
        <button onClick={handleLike} className={styles.likeButton}>❤️ 좋아요 ({post.likes})</button>
        <button onClick={() => navigate(-1)} className={styles.backButton}>목록으로</button>
      </div>

      {/* 댓글 섹션 */}
      <div className={styles.commentsSection}>
        <h3>댓글 ({comments.length})</h3>
        <form onSubmit={handleAddComment} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows="3"
            required
          ></textarea>
          <button type="submit" className={styles.submitCommentButton}>댓글 달기</button>
        </form>
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentMeta}>
                <span>{comment.author_name}</span>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostView;