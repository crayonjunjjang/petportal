// src/components/community/CommentSection.jsx

// --- 파일 역할: 게시글 상세 페이지 하단에 표시되는 '댓글' 섹션 ---
// 이 컴포넌트는 특정 게시글에 대한 댓글 목록을 보여주고,
// 사용자가 댓글을 작성, 수정, 삭제, '좋아요' 할 수 있는 기능을 제공합니다.
// `CommunityContext`와 `ProfileContext`를 사용하여 데이터와 사용자 정보를 관리합니다.

import React, { useState, useEffect } from 'react';
import { useCommunity } from '../../contexts/CommunityContext'; // 커뮤니티 데이터 및 액션
import { useProfile } from '../../context/ProfileContext'; // 사용자 프로필 및 인증 상태
import Button from '../ui/Button';
import styles from './CommentSection.module.css';

// --- CommentSection Component ---
// postId: 현재 게시글의 ID
// boardKey: 현재 게시판의 키 (e.g., 'free', 'qna')
const CommentSection = ({ postId, boardKey }) => {
  // --- STATE & HOOKS (상태 및 훅) ---
  const { boardData, actions } = useCommunity(); // 커뮤니티 컨텍스트에서 데이터와 액션 함수를 가져옴
  const { userProfile, isAuthenticated } = useProfile(); // 프로필 컨텍스트에서 사용자 정보와 로그인 상태를 가져옴
  const [comments, setComments] = useState([]); // 현재 게시글의 댓글 목록
  const [newComment, setNewComment] = useState(''); // 새로 작성 중인 댓글 내용
  const [editingComment, setEditingComment] = useState(null); // 수정 중인 댓글의 ID (null이 아니면 수정 모드)
  const [editContent, setEditContent] = useState(''); // 수정 중인 댓글의 내용

  // --- EFFECTS (데이터 동기화) ---
  // postId, boardKey, 또는 boardData가 변경될 때마다 해당 게시글의 댓글 목록을 상태에 설정합니다.
  useEffect(() => {
    const board = boardData[boardKey];
    if (board) {
      // 공지사항과 일반 게시글을 모두 포함하여 해당 post를 찾습니다.
      const post = [...board.notices, ...board.posts].find(p => p.id.toString() === postId.toString());
      if (post && post.comments) {
        setComments(post.comments);
      }
    }
  }, [postId, boardKey, boardData]);

  // --- EVENT HANDLERS (이벤트 처리 함수) ---

  // 새 댓글 작성 제출
  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    // `addComment` 액션을 호출하여 댓글을 추가합니다. 작성자는 현재 로그인된 사용자의 닉네임입니다.
    actions.addComment(boardKey, postId, newComment, userProfile.nickname);
    setNewComment(''); // 입력창 초기화
  };

  // 댓글 수정 완료
  const handleEditComment = (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    actions.updateComment(boardKey, postId, commentId, editContent);
    setEditingComment(null); // 수정 모드 종료
    setEditContent('');
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      actions.deleteComment(boardKey, postId, commentId);
    }
  };

  // 댓글 '좋아요'
  const handleLikeComment = (commentId) => {
    actions.likeComment(boardKey, postId, commentId);
  };

  // 날짜 문자열을 'YYYY. MM. DD.' 형식으로 포맷하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // --- RENDER LOGIC (렌더링 로직) ---

  // 개별 댓글을 렌더링하는 함수
  const renderComment = (comment) => {
    // 현재 로그인한 사용자가 댓글 작성자인지 확인
    const isAuthor = userProfile?.nickname === comment.author;

    return (
      <div key={comment.id} className={styles.comment}>
        <div className={styles.commentHeader}>
          <div className={styles.commentAuthor}>
            <span className={styles.authorName}>{comment.author}</span>
            <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
          </div>
          {/* 작성자일 경우에만 수정/삭제 버튼을 표시 */}
          {isAuthor && (
            <div className={styles.commentActions}>
              <button onClick={() => { setEditingComment(comment.id); setEditContent(comment.content); }} className={styles.actionButton}>수정</button>
              <button onClick={() => handleDeleteComment(comment.id)} className={styles.actionButton}>삭제</button>
            </div>
          )}
        </div>

        <div className={styles.commentContent}>
          {/* 수정 모드일 경우, 수정 폼을 표시 */}
          {editingComment === comment.id ? (
            <div className={styles.editForm}>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className={styles.editTextarea} rows={3} />
              <div className={styles.editButtons}>
                <Button variant="secondary" size="small" onClick={() => { setEditingComment(null); setEditContent(''); }}>취소</Button>
                <Button variant="primary" size="small" onClick={() => handleEditComment(comment.id)}>수정</Button>
              </div>
            </div>
          ) : (
            // 일반 모드일 경우, 댓글 내용과 '좋아요' 버튼을 표시
            <>
              <p>{comment.content}</p>
              <div className={styles.commentFooter}>
                <button onClick={() => handleLikeComment(comment.id)} className={styles.likeButton}>👍 {comment.likes}</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // 최종 컴포넌트 렌더링
  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentTitle}>댓글 {comments.length}개</h3>

      {/* 새 댓글 작성 폼 */}
      <div className={styles.commentForm}>
        <div className={styles.commentInput}>
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요..." className={styles.commentTextarea} rows={4} />
        </div>
        <div className={styles.commentSubmit}>
          <Button variant="primary" onClick={handleSubmitComment} disabled={!newComment.trim()}>댓글 작성</Button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className={styles.commentList}>
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentSection;
