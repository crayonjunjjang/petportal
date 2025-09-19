import React, { useState } from 'react';
import styles from './Comments.module.css';
import Button from '../ui/Button';

// 개별 댓글 아이템을 위한 컴포넌트
const CommentItem = ({ comment, onLikeComment, likedItems }) => {
  const isCommentLiked = likedItems && likedItems.includes(comment.id);
  
  const handleLike = () => {
    onLikeComment(comment.id); 
  };

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <div className={styles.commentAuthor}>
          <div className={styles.authorAvatar}>{comment.author.charAt(0)}</div>
          <strong>{comment.author}</strong>
        </div>
        <span className={styles.commentDate}>{comment.createdAt}</span>
      </div>
      <div className={styles.commentContent}>{comment.content}</div>
      <div className={styles.commentActions}>
      <button onClick={handleLike} className={isCommentLiked ? styles.liked : ''} >
          {isCommentLiked ? '' : ''} 좋아요 {comment.likes || 0}
        </button>      </div>
    </div>
  );
};


const Comments = ({ comments, onAddComment, onLikeComment, likedItems }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className={styles.commentsContainer}>
      <h3>댓글 ({(comments || []).length})</h3>
      
      <div className={styles.commentForm}>
        <textarea
          placeholder="따뜻한 댓글을 남겨주세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          likedItems={likedItems}
        />
        <Button variant="primary" size="medium" onClick={handleSubmit}>
          등록
        </Button>
      </div>

      <div className={styles.commentList}>
        {comments && comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} onLikeComment={onLikeComment} likedItems={likedItems}/>
        ))}
      </div>
    </div>
  );
};

export default Comments;