// C:\Users\1\Desktop\my-app\src\contexts\CommunityContext.jsx

// --- 파일 역할: 커뮤니티 게시판 데이터 및 액션 관리 ---
// 이 파일은 애플리케이션의 커뮤니티 게시판(게시글, 댓글, 좋아요 등) 관련 데이터를 전역적으로 관리하고,
// 게시글 생성, 수정, 삭제, 댓글 추가, 좋아요 토글 등의 액션 함수들을 하위 컴포넌트들에게 제공합니다.
// 현재는 목업 데이터를 기반으로 동작하며, 실제 백엔드 연동 시 API 호출로 대체되어야 합니다.

// --- IMPORT ---
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { initialBoardData } from '../data/mockCommunityData'; // 커뮤니티 게시판의 초기 목업 데이터

// --- CONTEXT CREATION ---
// CommunityContext를 생성합니다. 이 Context는 커뮤니티 관련 상태와 함수들을 전역적으로 제공합니다.
const CommunityContext = createContext();

// --- COMMUNITY PROVIDER COMPONENT ---
/**
 * @component CommunityProvider
 * @description 애플리케이션의 커뮤니티 게시판 상태를 관리하고, 하위 컴포넌트들에게 제공하는 프로바이더 컴포넌트입니다.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - CommunityProvider의 하위 컴포넌트들.
 */
export const CommunityProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  // `boardData`: 전체 게시판의 데이터를 담고 있는 상태입니다. `mockCommunityData`로 초기화됩니다.
  // 각 게시판(예: 'free-talk', 'qna')은 `posts`와 `notices` 배열을 가집니다.
  const [boardData, setBoardData] = useState(initialBoardData);
  // `likedItems`: 사용자가 '좋아요'를 누른 게시글/댓글의 ID를 저장하는 배열입니다.
  // 이는 중복 '좋아요'를 방지하고, UI에서 '좋아요' 상태를 표시하는 데 사용됩니다.
  const [likedItems, setLikedItems] = useState([]);

  // --- ACTION FUNCTIONS ---
  // 이 함수들은 `setBoardData`를 사용하여 상태를 업데이트하며, 불변성을 유지하는 것이 중요합니다.
  // 현재는 로컬 상태만 업데이트하지만, 실제 백엔드 연동 시에는 API 호출 로직이 추가되어야 합니다.

  /**
   * @function createPost
   * @description 새로운 게시글을 생성하여 특정 게시판에 추가합니다.
   * @param {string} boardKey - 게시글을 추가할 게시판의 키 (예: 'free-talk').
   * @param {object} newPostData - 새 게시글 데이터 (title, content 등).
   * @param {string} newPostData.title - 게시글 제목.
   * @param {string} newPostData.content - 게시글 내용 (HTML).
   * @param {string} [newPostData.author='익명'] - 작성자 (기본값: '익명').
   */
  const createPost = useCallback((boardKey, newPostData) => {
    setBoardData(prevData => {
        const targetPosts = prevData[boardKey].posts; // 대상 게시판의 현재 게시글 목록
        // 새 게시글 ID를 기존 게시글 ID의 최대값 + 1로 설정합니다.
        // (주의: `Date.now()`나 `maxId + 1`은 실제 환경에서 ID 충돌 가능성이 있으므로, 백엔드에서 고유 ID를 생성해야 합니다.)
        const maxId = targetPosts.reduce((max, post) => (post.id > max ? post.id : max), 0);
        const newPost = {
          id: maxId + 1,
          author: newPostData.author || '익명', // 전달된 작성자 사용 또는 기본값 '익명'
          createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
          views: 0,
          likes: 0,
          ...newPostData, // 전달된 다른 데이터 (title, content 등) 병합
          comments: [], // 새 게시글은 초기 댓글이 없습니다.
        };
        // 불변성을 유지하며 상태를 업데이트합니다.
        // 대상 게시판의 `posts` 배열에 새 게시글을 추가합니다.
        return {
          ...prevData,
          [boardKey]: { ...prevData[boardKey], posts: [...targetPosts, newPost] },
        };
      });
    }, []); // 의존성 배열 비어있음

  /**
   * @function updatePost
   * @description 기존 게시글을 수정합니다.
   * @param {string} boardKey - 수정할 게시글이 있는 게시판의 키.
   * @param {string|number} postId - 수정할 게시글의 ID.
   * @param {object} updatedData - 수정될 데이터 (title, content 등).
   */
  const updatePost = useCallback((boardKey, postId, updatedData) => {
    setBoardData(prevData => {
      // 상태의 불변성을 위해 새로운 객체를 생성합니다.
      const newBoardData = { ...prevData };
      // 대상 게시판의 게시글 목록에서 수정할 게시글의 인덱스를 찾습니다.
      const postIndex = newBoardData[boardKey].posts.findIndex(p => p.id.toString() === postId.toString());
      if (postIndex > -1) {
        // 해당 게시글을 새로운 데이터로 업데이트하고, 수정 시각을 기록합니다.
        newBoardData[boardKey].posts[postIndex] = {
          ...newBoardData[boardKey].posts[postIndex],
          ...updatedData,
          updatedAt: new Date().toISOString(), // 수정 시각 기록 (ISO 8601 형식)
        };
      }
      return newBoardData;
    });
  }, []); // 의존성 배열 비어있음

  /**
   * @function deletePost
   * @description 게시글을 삭제합니다.
   * @param {string} boardKey - 삭제할 게시글이 있는 게시판의 키.
   * @param {string|number} postId - 삭제할 게시글의 ID.
   */
  const deletePost = useCallback((boardKey, postId) => {
    setBoardData(prevData => {
      const newBoardData = { ...prevData };
      // 대상 게시판의 게시글 목록에서 해당 게시글을 필터링하여 제거합니다.
      newBoardData[boardKey].posts = newBoardData[boardKey].posts.filter(p => p.id.toString() !== postId.toString());
      return newBoardData;
    });
  }, []); // 의존성 배열 비어있음

  /**
   * @function addComment
   * @description 특정 게시글에 댓글을 추가합니다.
   * @param {string} boardKey - 댓글을 추가할 게시글이 있는 게시판의 키.
   * @param {string|number} postId - 댓글을 추가할 게시글의 ID.
   * @param {string} commentContent - 댓글 내용.
   * @param {string} [author='댓글러'] - 댓글 작성자 (기본값: '댓글러').
   */
  const addComment = useCallback((boardKey, postId, commentContent, author = '댓글러') => {
    const newComment = {
        id: Date.now(), // 댓글 ID는 현재 시간으로 간단히 생성 (주의: 충돌 가능성)
        author: author, // 전달된 작성자 사용 또는 기본값 '댓글러'
        content: commentContent,
        createdAt: new Date().toISOString(), // ISO 8601 형식으로 생성 시각 기록
        likes: 0,
      };
      setBoardData(prevData => {
        // 경고: `JSON.parse(JSON.stringify(prevData))`는 깊은 복사를 위한 비효율적이고 잠재적으로 문제가 있는 방법입니다.
        // 복잡한 객체나 함수/Date 객체를 포함하는 경우 데이터 손실이 발생할 수 있습니다.
        // 불변성 유지를 위해 더 나은 방법(예: Immer 라이브러리 또는 수동 불변 업데이트)을 고려해야 합니다.
        const newData = JSON.parse(JSON.stringify(prevData));
        const targetBoard = newData[boardKey];
        // 공지사항과 일반 게시글 모두에서 해당 post를 찾습니다.
        const allPosts = [...targetBoard.notices, ...targetBoard.posts];
        const targetPost = allPosts.find(p => String(p.id) === String(postId));
        if (targetPost) {
          if (!targetPost.comments) targetPost.comments = []; // comments 배열이 없으면 초기화
          targetPost.comments.push(newComment); // 새 댓글 추가
        }
        return newData;
      });
    }, []); // 의존성 배열 비어있음

  /**
   * @function updateComment
   * @description 특정 게시글의 댓글을 수정합니다.
   * @param {string} boardKey - 댓글이 있는 게시판의 키.
   * @param {string|number} postId - 댓글이 속한 게시글의 ID.
   * @param {string|number} commentId - 수정할 댓글의 ID.
   * @param {string} updatedContent - 수정될 댓글 내용.
   */
  const updateComment = useCallback((boardKey, postId, commentId, updatedContent) => {
    setBoardData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); // 깊은 복사 (위 경고 참조)
      const post = [...newData[boardKey].notices, ...newData[boardKey].posts].find(p => p.id.toString() === postId.toString());
      if (post && post.comments) {
        const commentIndex = post.comments.findIndex(c => c.id.toString() === commentId.toString());
        if (commentIndex > -1) {
          post.comments[commentIndex].content = updatedContent; // 댓글 내용 업데이트
        }
      }
      return newData;
    });
  }, []); // 의존성 배열 비어있음

  /**
   * @function deleteComment
   * @description 특정 게시글의 댓글을 삭제합니다.
   * @param {string} boardKey - 댓글이 있는 게시판의 키.
   * @param {string|number} postId - 댓글이 속한 게시글의 ID.
   * @param {string|number} commentId - 삭제할 댓글의 ID.
   */
  const deleteComment = useCallback((boardKey, postId, commentId) => {
    setBoardData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); // 깊은 복사 (위 경고 참조)
      const post = [...newData[boardKey].notices, ...newData[boardKey].posts].find(p => p.id.toString() === postId.toString());
      if (post && post.comments) {
        post.comments = post.comments.filter(c => c.id.toString() !== commentId.toString()); // 해당 댓글 제거
      }
      return newData;
    });
  }, []); // 의존성 배열 비어있음

  /**
   * @function toggleLike
   * @description 게시글 또는 댓글의 '좋아요' 상태를 토글하고, `likedItems` 배열을 업데이트합니다.
   * @param {string|number} itemId - '좋아요' 상태를 토글할 항목의 ID (게시글 또는 댓글).
   * @returns {boolean} '좋아요'가 새로 추가되었으면 true, 제거되었으면 false.
   */
  const toggleLike = useCallback((itemId) => {
      const isLiked = likedItems.includes(itemId);
      setLikedItems(prev => isLiked ? prev.filter(id => id !== itemId) : [...prev, itemId]);
      return !isLiked; // 좋아요가 새로 눌렸는지(true) 취소되었는지(false) 반환
    }, [likedItems]); // likedItems가 변경될 때마다 함수 재생성
  
  /**
   * @function likePost
   * @description 특정 게시글의 '좋아요' 수를 업데이트합니다.
   * `toggleLike` 함수를 사용하여 `likedItems` 상태를 관리하고, 게시글의 `likes` 수를 증감시킵니다.
   * @param {string} boardKey - 게시글이 있는 게시판의 키.
   * @param {string|number} postId - '좋아요' 수를 업데이트할 게시글의 ID.
   */
  const likePost = useCallback((boardKey, postId) => {
      const shouldLike = toggleLike(postId); // 좋아요 상태 토글 및 결과 반환
      setBoardData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData)); // 깊은 복사 (위 경고 참조)
        const board = newData[boardKey];
        const allPosts = [...board.notices, ...board.posts]; // 공지사항과 게시글 모두에서 찾기
        const targetPost = allPosts.find(p => String(p.id) === String(postId));
        if (targetPost) {
          targetPost.likes += (shouldLike ? 1 : -1); // 좋아요 상태에 따라 likes 수 증감
        }
        return newData;
      });
    }, [toggleLike]); // toggleLike 함수가 변경될 때마다 함수 재생성
  
  /**
   * @function likeComment
   * @description 특정 댓글의 '좋아요' 수를 업데이트합니다.
   * `toggleLike` 함수를 사용하여 `likedItems` 상태를 관리하고, 댓글의 `likes` 수를 증감시킵니다.
   * @param {string} boardKey - 댓글이 있는 게시판의 키.
   * @param {string|number} postId - 댓글이 속한 게시글의 ID.
   * @param {string|number} commentId - '좋아요' 수를 업데이트할 댓글의 ID.
   */
  const likeComment = useCallback((boardKey, postId, commentId) => {
      const shouldLike = toggleLike(commentId); // 좋아요 상태 토글 및 결과 반환
      setBoardData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData)); // 깊은 복사 (위 경고 참조)
        const board = newData[boardKey];
        const allPosts = [...board.notices, ...board.posts];
        const targetPost = allPosts.find(p => String(p.id) === String(postId));
        if (targetPost && targetPost.comments) {
          const targetComment = targetPost.comments.find(c => String(c.id) === String(commentId));
          if (targetComment) {
            targetComment.likes += (shouldLike ? 1 : -1); // 좋아요 상태에 따라 likes 수 증감
          }
        }
        return newData;
      });
    }, [toggleLike]); // toggleLike 함수가 변경될 때마다 함수 재생성

  // --- CONTEXT VALUE ---
  // Context Provider를 통해 하위 컴포넌트에 전달할 값들을 `useMemo`로 최적화합니다.
  const value = useMemo(() => ({
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
  }), [
    boardData, likedItems,
    createPost, updatePost, deletePost, addComment, updateComment, deleteComment,
    likePost, likeComment
  ]);

  // CommunityContext.Provider를 통해 value를 하위 컴포넌트들에게 제공합니다.
  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

// --- CUSTOM HOOK: useCommunity ---
/**
 * @function useCommunity
 * @description CommunityContext를 쉽게 사용하기 위한 커스텀 훅입니다.
 * CommunityProvider 내에서 호출되지 않으면 에러를 발생시킵니다.
 * @returns {object} CommunityContext의 현재 값 (boardData, likedItems, actions: { ... })
 */
export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
