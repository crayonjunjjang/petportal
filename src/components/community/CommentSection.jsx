import React, { useState, useEffect } from 'react';
import { useCommunity } from '../../contexts/CommunityContext';
import Button from '../ui/Button';
import styles from './CommentSection.module.css';

const CommentSection = ({ postId, boardKey }) => {
  const { boardData, actions } = useCommunity();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const board = boardData[boardKey];
    if (board) {
      const post = [...board.notices, ...board.posts].find(p => p.id.toString() === postId.toString());
      if (post && post.comments) {
        setComments(post.comments);
      }
    }
  }, [postId, boardKey, boardData]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    actions.addComment(boardKey, postId, newComment);
    setNewComment('');
  };

  const handleEditComment = (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    actions.updateComment(boardKey, postId, commentId, editContent);
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      actions.deleteComment(boardKey, postId, commentId);
    }
  };

  const handleLikeComment = (commentId) => {
    actions.likeComment(boardKey, postId, commentId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const renderComment = (comment) => (
    <div key={comment.id} className={styles.comment}>
      <div className={styles.commentHeader}>
        <div className={styles.commentAuthor}>
          <span className={styles.authorName}>{comment.author}</span>
          <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
        </div>
        <div className={styles.commentActions}>
          <button
            onClick={() => {
              setEditingComment(comment.id);
              setEditContent(comment.content);
            }}
            className={styles.actionButton}
          >
            수정
          </button>
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className={styles.actionButton}
          >
            삭제
          </button>
        </div>
      </div>

      <div className={styles.commentContent}>
        {editingComment === comment.id ? (
          <div className={styles.editForm}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={styles.editTextarea}
              rows={3}
            />
            <div className={styles.editButtons}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setEditingComment(null);
                  setEditContent('');
                }}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => handleEditComment(comment.id)}
              >
                수정
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p>{comment.content}</p>
            <div className={styles.commentFooter}>
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={styles.likeButton}
              >
                👍 {comment.likes}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentTitle}>댓글 {comments.length}개</h3>

      <div className={styles.commentForm}>
        <div className={styles.commentInput}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className={styles.commentTextarea}
            rows={4}
          />
        </div>
        <div className={styles.commentSubmit}>
          <Button
            variant="primary"
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            댓글 작성
          </Button>
        </div>
      </div>

      <div className={styles.commentList}>
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentSection;
