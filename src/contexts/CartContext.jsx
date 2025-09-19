// CartContext: 앱 전체에서 장바구니 상태를 공유하기 위한 Context 객체입니다.
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

// CartProvider: 장바구니 관련 상태와 로직을 관리하고, 하위 컴포넌트에 이를 제공하는 컴포넌트입니다.
export const CartProvider = ({ children }) => {
  // cartItems: 장바구니에 담긴 상품들의 배열을 저장하는 상태입니다.
  const [cartItems, setCartItems] = useState([]);

  /**
   * addToCart: 장바구니에 상품을 추가하는 함수입니다.
   * @param {object} product - 추가할 상품 객체
   * @param {number} quantity - 추가할 수량
   */
  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      // 이미 장바구니에 있는 상품인지 확인합니다.
      const isItemInCart = prevItems.find(item => item.id === product.id);

      if (isItemInCart) {
        // 이미 있는 상품이면, 수량만 업데이트합니다.
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // 새로운 상품이면, 배열에 새로 추가합니다.
      return [...prevItems, { ...product, quantity }];
    });
    // 사용자에게 상품이 추가되었음을 알림으로 보여줍니다.
    toast.success('🛒 장바구니에 상품을 담았습니다!');
  };

  /**
   * updateCartQuantity: 장바구니에 있는 상품의 수량을 업데이트하는 함수입니다.
   * @param {number|string} productId - 수량을 변경할 상품의 ID
   * @param {number} newQuantity - 새로운 수량
   */
  const updateCartQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
        // 수량이 0 이하인 아이템은 장바구니에서 제거합니다.
        .filter(item => item.quantity > 0)
    );
  };

  /**
   * removeFromCart: 장바구니에서 특정 상품을 제거하는 함수입니다.
   * @param {number|string} productId - 제거할 상품의 ID
   */
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Context를 통해 하위 컴포넌트에 전달할 값들을 객체로 묶습니다.
  const value = {
    cartItems,
    actions: {
      addToCart,
      updateCartQuantity,
      removeFromCart,
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// useCart: CartContext를 쉽게 사용하기 위한 커스텀 훅입니다.
export const useCart = () => useContext(CartContext);