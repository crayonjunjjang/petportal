import React, { createContext, useState, useContext } from 'react';
import { initialBoardData } from '../data/mockCommunityData';

// CommunityContext: 앱 전체의 커뮤니티 관련 데이터(게시글, 댓글 등)와 액션 함수들을 공유하기 위한 Context입니다.
const CommunityContext = createContext();

// CommunityProvider: 커뮤니티 관련 상태를 관리하고, 하위 컴포넌트에 상태와 액션을 제공하는 컴포넌트입니다.
export const CommunityProvider = ({ children }) => {
  // boardData: 전체 게시판의 데이터를 담고 있는 상태입니다. mock 데이터로 초기화됩니다.
  const [boardData, setBoardData] = useState(initialBoardData);
  // likedItems: 사용자가 '좋아요'를 누른 게시글/댓글의 ID를 저장하는 배열입니다. (중복 '좋아요' 방지용)
  const [likedItems, setLikedItems] = useState([]);

  // --- ACTION FUNCTIONS ---
  // 이 함수들은 setBoardData를 사용하여 상태를 업데이트하며, 불변성을 유지하는 것이 중요합니다.

  /**
   * createPost: 새로운 게시글을 생성합니다.
   * @param {string} boardKey - 게시글을 추가할 게시판의 키
   * @param {object} newPostData - 새 게시글 데이터 (title, content 등)
   */
  const createPost = (boardKey, newPostData) => {
    setBoardData(prevData => {
        const targetPosts = prevData[boardKey].posts;
        // 새 게시글 ID를 기존 ID의 최대값 + 1로 설정합니다.
        const maxId = targetPosts.reduce((max, post) => (post.id > max ? post.id : max), 0);
        const newPost = {
          id: maxId + 1,
          author: '익명', // 기본 작성자
          createdAt: new Date().toISOString().split('T')[0],
          views: 0,
          likes: 0,
          ...newPostData,
          comments: [],
        };
        // 불변성을 유지하며 상태를 업데이트합니다.
        return {
          ...prevData,
          [boardKey]: { ...prevData[boardKey], posts: [...targetPosts, newPost] },
        };
      });
    };

  /**
   * updatePost: 기존 게시글을 수정합니다.
   * @param {string} boardKey - 수정할 게시글이 있는 게시판의 키
   * @param {string|number} postId - 수정할 게시글의 ID
   * @param {object} updatedData - 수정될 데이터 (title, content 등)
   */
  const updatePost = (boardKey, postId, updatedData) => {
    setBoardData(prevData => {
      const newBoardData = { ...prevData };
      const postIndex = newBoardData[boardKey].posts.findIndex(p => p.id.toString() === postId.toString());
      if (postIndex > -1) {
        newBoardData[boardKey].posts[postIndex] = {
          ...newBoardData[boardKey].posts[postIndex],
          ...updatedData,
          updatedAt: new Date().toISOString(), // 수정 시각 기록
        };
      }
      return newBoardData;
    });
  };

  /**
   * deletePost: 게시글을 삭제합니다.
   * @param {string} boardKey - 삭제할 게시글이 있는 게시판의 키
   * @param {string|number} postId - 삭제할 게시글의 ID
   */
  const deletePost = (boardKey, postId) => {
    setBoardData(prevData => {
      const newBoardData = { ...prevData };
      newBoardData[boardKey].posts = newBoardData[boardKey].posts.filter(p => p.id.toString() !== postId.toString());
      return newBoardData;
    });
  };

  /**
   * addComment: 특정 게시글에 댓글을 추가합니다.
   * @param {string} boardKey - 게시판 키
   * @param {string|number} postId - 댓글을 추가할 게시글 ID
   * @param {string} commentContent - 댓글 내용
   */
  const addComment = (boardKey, postId, commentContent) => {
    const newComment = {
        id: Date.now(), // 댓글 ID는 현재 시간으로 간단히 생성
        author: '댓글러',
        content: commentContent,
        createdAt: new Date().toLocaleDateString(),
        likes: 0,
      };
      setBoardData(prevData => {
        // 깊은 복사를 통해 중첩된 객체의 불변성을 보장합니다.
        const newData = JSON.parse(JSON.stringify(prevData));
        const targetBoard = newData[boardKey];
        // 공지사항과 일반 게시글 모두에서 해당 post를 찾습니다.
        const allPosts = [...targetBoard.notices, ...targetBoard.posts];
        const targetPost = allPosts.find(p => String(p.id) === String(postId));
        if (targetPost) {
          if (!targetPost.comments) targetPost.comments = [];
          targetPost.comments.push(newComment);
        }
        return newData;
      });
    };

  const updateComment = (boardKey, postId, commentId, updatedContent) => {
    setBoardData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const post = [...newData[boardKey].notices, ...newData[boardKey].posts].find(p => p.id.toString() === postId.toString());
      if (post && post.comments) {
        const commentIndex = post.comments.findIndex(c => c.id.toString() === commentId.toString());
        if (commentIndex > -1) {
          post.comments[commentIndex].content = updatedContent;
        }
      }
      return newData;
    });
  };

  const deleteComment = (boardKey, postId, commentId) => {
    setBoardData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const post = [...newData[boardKey].notices, ...newData[boardKey].posts].find(p => p.id.toString() === postId.toString());
      if (post && post.comments) {
        post.comments = post.comments.filter(c => c.id.toString() !== commentId.toString());
      }
      return newData;
    });
  };

  const toggleLike = (itemId) => {
      const isLiked = likedItems.includes(itemId);
      setLikedItems(prev => isLiked ? prev.filter(id => id !== itemId) : [...prev, itemId]);
      return !isLiked;
    };
  
    const likePost = (boardKey, postId) => {
      const shouldLike = toggleLike(postId);
      setBoardData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        const board = newData[boardKey];
        const allPosts = [...board.notices, ...board.posts];
        const targetPost = allPosts.find(p => String(p.id) === String(postId));
        if (targetPost) {
          targetPost.likes += (shouldLike ? 1 : -1);
        }
        return newData;
      });
    };
  
    const likeComment = (boardKey, postId, commentId) => {
      const shouldLike = toggleLike(commentId);
      setBoardData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        const board = newData[boardKey];
        const allPosts = [...board.notices, ...board.posts];
        const targetPost = allPosts.find(p => String(p.id) === String(postId));
        if (targetPost && targetPost.comments) {
          const targetComment = targetPost.comments.find(c => String(c.id) === String(commentId));
          if (targetComment) {
            targetComment.likes += (shouldLike ? 1 : -1);
          }
        }
        return newData;
      });
    };

  const value = {
    boardData,
    likedItems,
    actions: {
      createPost,
      updatePost,
      deletePost,
      addComment,
      updateComment,
      deleteComment,
      likePost,
      likeComment,
    },
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

// useCommunity: CommunityContext를 쉽게 사용하기 위한 커스텀 훅입니다.
export const useCommunity = () => useContext(CommunityContext);