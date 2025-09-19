import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { initialBoardData } from '../data/mockCommunityData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- States ---
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [boardData, setBoardData] = useState(initialBoardData);
  const [likedItems, setLikedItems] = useState([]);

  // --- Functions ---
  const handleAddToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const isItemInCart = prevItems.find(item => item.id === product.id);
      if (isItemInCart) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    toast.success('🛒 장바구니에 상품을 담았습니다!');
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleCreatePost = (boardKey, newPostData) => {
    setBoardData(prevData => {
      const targetPosts = prevData[boardKey].posts;
      const maxId = targetPosts.reduce((max, post) => (post.id > max ? post.id : max), 0);
      const newPost = {
        id: maxId + 1,
        author: '익명',
        createdAt: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        ...newPostData,
        comments: [],
      };
      return {
        ...prevData,
        [boardKey]: { ...prevData[boardKey], posts: [...targetPosts, newPost] },
      };
    });
  };

  const handleAddComment = (boardKey, postId, commentContent) => {
    const newComment = {
      id: Date.now(),
      author: '댓글러',
      content: commentContent,
      createdAt: new Date().toLocaleDateString(),
      likes: 0,
    };
    setBoardData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const targetBoard = newData[boardKey];
      const allPosts = [...targetBoard.notices, ...targetBoard.posts];
      const targetPost = allPosts.find(p => String(p.id) === String(postId));
      if (targetPost) {
        targetPost.comments.push(newComment);
      }
      return newData;
    });
  };

  const handleLikePost = (boardKey, postId) => {
      const isLiked = likedItems.includes(postId);
      setLikedItems(prev => isLiked ? prev.filter(id => id !== postId) : [...prev, postId]);
    
      setBoardData(prevBoardData => {
        const newBoardData = { ...prevBoardData };
        const targetBoard = { ...newBoardData[boardKey] };
    
        const updateLikes = (posts) => posts.map(p => {
          if (String(p.id) === String(postId)) {
            return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
          }
          return p;
        });
    
        targetBoard.posts = updateLikes(targetBoard.posts);
        targetBoard.notices = updateLikes(targetBoard.notices);
    
        return { ...newBoardData, [boardKey]: targetBoard };
      });
    };
  const handleLikeComment = (boardKey, postId, commentId) => {
    const isLiked = likedItems.includes(commentId);
  setLikedItems(prev => isLiked ? prev.filter(id => id !== commentId) : [...prev, commentId]);

  setBoardData(prevBoardData => {
    const newBoardData = { ...prevBoardData };
    const targetBoard = { ...newBoardData[boardKey] };

    const updateCommentLikes = (posts) => posts.map(p => {
      if (String(p.id) === String(postId)) {
        const updatedComments = p.comments.map(c => {
          if (String(c.id) === String(commentId)) {
            return { ...c, likes: isLiked ? c.likes - 1 : c.likes + 1 };
          } return c;
        }); return { ...p, comments: updatedComments };
      } return p;
    });
    targetBoard.posts = updateCommentLikes(targetBoard.posts);
    targetBoard.notices = updateCommentLikes(targetBoard.notices);
    return { ...newBoardData, [boardKey]: targetBoard };
  });
};

  // --- Value passed to consumers ---
  const value = {
    cartItems,
    isLoading,
    setIsLoading,
    boardData,
    actions: {
      addToCart: handleAddToCart,
      updateCartQuantity: handleUpdateQuantity,
      removeFromCart: handleRemoveItem,
      createPost: handleCreatePost,
      addComment: handleAddComment,
      likePost: handleLikePost,
      likeComment: handleLikeComment,
      likedItems,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};