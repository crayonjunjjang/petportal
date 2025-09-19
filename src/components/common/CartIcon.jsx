// src/components/common/CartIcon.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import styles from './CartIcon.module.css';

const CartIcon = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart() || { cartItems: [] };
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className={styles.cartContainer} onClick={handleCartClick}>
      <div className={styles.cartIcon}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="m1 1 4 4 1 0 13 2-3 7H7l-1.65-5H5L2 2H1"></path>
        </svg>
      </div>
      {totalItems > 0 && (
        <div className={styles.badge}>
          {totalItems > 99 ? '99+' : totalItems}
        </div>
      )}
    </div>
  );
};

export default CartIcon;