import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './PostView.module.css';
import { mockDataService } from '../utils/mockDataService';

const PostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const fetchPostAndComments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch post
      const postResponse = await mockDataService.getById('posts', parseInt(postId));
      if (postResponse.success) {
        setPost(postResponse.data);
      } else {
        setError(postResponse.message || '게시글을 불러오는데 실패했습니다.');
        setLoading(false);
        return;
      }

      // Fetch comments
      const commentsResponse = await mockDataService.getAll('comments');
      if (commentsResponse.success) {
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

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!post) return;

    try {
      // Mock like/unlike logic
      const updatedPost = { ...post, likes: post.likes + 1 }; // Always increment for simplicity
      const response = await mockDataService.update('posts', post.id, updatedPost);
      if (response.success) {
        setPost(response.data);
      } else {
        alert(response.message || '좋아요 처리에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error liking post:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

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
        parentCommentId: null, // For simplicity, no nested comments in mock
      };
      const response = await mockDataService.create('comments', commentData);
      if (response.success) {
        setNewComment('');
        fetchPostAndComments(); // Refresh comments
      } else {
        alert(response.message || '댓글 추가에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('댓글 추가에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={styles.container}>게시글을 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.container} style={{ color: 'red' }}>오류: {error}</div>;
  }

  if (!post) {
    return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.postHeader}>
        <h1>{post.title}</h1>
        <div className={styles.postMeta}>
          <span>작성자: {post.author_name}</span>
          <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
          <span>조회수: {post.views}</span>
          <span>좋아요: {post.likes}</span>
        </div>
      </div>
      <div className={styles.postContent}>
        <p>{post.content}</p>
      </div>
      <div className={styles.postActions}>
        <button onClick={handleLike} className={styles.likeButton}>❤️ 좋아요 ({post.likes})</button>
        <button onClick={() => navigate(-1)} className={styles.backButton}>목록으로</button>
      </div>

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
