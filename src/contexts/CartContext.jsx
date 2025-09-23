// C:\Users\1\Desktop\my-app\src\contexts\CartContext.jsx

// --- 파일 역할: 장바구니 상태 관리 ---
// 이 파일은 애플리케이션의 장바구니(Cart) 상태를 전역적으로 관리하고,
// 장바구니에 상품을 추가, 수량 업데이트, 제거하는 함수들을 하위 컴포넌트들에게 제공합니다.

// --- IMPORT ---
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify'; // 사용자 알림 메시지를 위한 라이브러리

// --- CONTEXT CREATION ---
// CartContext를 생성합니다. 이 Context는 장바구니 관련 상태와 함수들을 전역적으로 제공합니다.
const CartContext = createContext();

// --- CART PROVIDER COMPONENT ---
/**
 * @component CartProvider
 * @description 애플리케이션의 장바구니 상태를 관리하고, 하위 컴포넌트들에게 제공하는 프로바이더 컴포넌트입니다.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - CartProvider의 하위 컴포넌트들.
 */
export const CartProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  // `cartItems`: 장바구니에 담긴 상품들의 배열을 저장하는 상태입니다.
  // 각 상품 객체는 `id`, `name`, `price`, `quantity` 등의 속성을 가집니다.
  const [cartItems, setCartItems] = useState([]);

  // --- CONTEXT FUNCTIONS ---

  /**
   * @function addToCart
   * @description 장바구니에 상품을 추가하거나, 이미 있는 상품의 수량을 업데이트하는 함수입니다.
   * `useCallback`을 사용하여 함수가 불필요하게 재생성되는 것을 방지합니다.
   * @param {object} product - 장바구니에 추가할 상품 객체 (예: { id, name, price, ... }).
   * @param {number} quantity - 추가할 상품의 수량.
   */
  const addToCart = useCallback((product, quantity) => {
    setCartItems(prevItems => {
      // 이미 장바구니에 있는 상품인지 확인합니다.
      const isItemInCart = prevItems.find(item => item.id === product.id);

      if (isItemInCart) {
        // 이미 있는 상품이면, 해당 상품의 수량만 업데이트합니다.
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // 새로운 상품이면, 기존 배열에 새로 추가합니다.
      return [...prevItems, { ...product, quantity }];
    });
    // 사용자에게 상품이 장바구니에 추가되었음을 알림으로 표시합니다.
    toast.success('🛒 장바구니에 상품을 담았습니다!');
  }, []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 생성됩니다.

  /**
   * @function updateCartQuantity
   * @description 장바구니에 있는 특정 상품의 수량을 업데이트하는 함수입니다.
   * 수량이 0 이하가 되면 해당 상품을 장바구니에서 자동으로 제거합니다.
   * `useCallback`을 사용하여 함수가 불필요하게 재생성되는 것을 방지합니다.
   * @param {number|string} productId - 수량을 변경할 상품의 고유 ID.
   * @param {number} newQuantity - 새로 설정할 상품의 수량.
   */
  const updateCartQuantity = useCallback((productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
        // 수량이 0 이하인 아이템은 장바구니에서 제거합니다.
        .filter(item => item.quantity > 0)
    );
  }, []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 생성됩니다.

  /**
   * @function removeFromCart
   * @description 장바구니에서 특정 상품을 제거하는 함수입니다.
   * `useCallback`을 사용하여 함수가 불필요하게 재생성되는 것을 방지합니다.
   * @param {number|string} productId - 장바구니에서 제거할 상품의 고유 ID.
   */
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 생성됩니다.

  // --- CONTEXT VALUE ---
  // Context를 통해 하위 컴포넌트에 전달할 값들을 `useMemo`로 최적화하여 불필요한 렌더링을 방지합니다.
  const value = useMemo(() => ({
    cartItems,
    actions: {
      addToCart,
      updateCartQuantity,
      removeFromCart,
    },
  }), [cartItems, addToCart, updateCartQuantity, removeFromCart]); // cartItems 또는 액션 함수들이 변경될 때만 value 객체 재생성

  // CartContext.Provider를 통해 value를 하위 컴포넌트들에게 제공합니다.
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- CUSTOM HOOK: useCart ---
/**
 * @function useCart
 * @description CartContext를 쉽게 사용하기 위한 커스텀 훅입니다.
 * CartProvider 내에서 호출되지 않으면 에러를 발생시킵니다.
 * @returns {object} CartContext의 현재 값 (cartItems, actions: { addToCart, updateCartQuantity, removeFromCart })
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
