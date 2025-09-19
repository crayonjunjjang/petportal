import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CartPage.module.css';
import Button from '../components/ui/Button';
import { useCart } from '../contexts/CartContext'; 
import QuantitySelector from '../components/ui/QuantitySelector';

// 상수: 배송비 및 무료 배송 기준 금액을 정의합니다.
const SHIPPING_FEE = 3000; // 기본 배송비
const FREE_SHIPPING_THRESHOLD = 50000; // 무료 배송 기준 금액

// CartPage: 장바구니에 담긴 상품 목록을 보여주고, 수량 변경 및 삭제, 결제 예상 금액을 표시하는 페이지 컴포넌트입니다.
const CartPage = () => {
  // useCart 훅을 사용하여 장바구니 상태(cartItems)와 관련 함수(actions)를 가져옵니다.
  const { cartItems, actions } = useCart();

  // 상품 소계 금액을 계산합니다. (상품 가격 * 수량의 총합)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // 배송비를 계산합니다. 소계 금액이 무료 배송 기준을 넘거나 0원이면 0원, 아니면 기본 배송비를 적용합니다.
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  
  // 최종 결제 금액을 계산합니다. (소계 + 배송비)
  const total = subtotal + shippingFee;

  // 숫자를 통화 형식(원)으로 포맷하는 헬퍼 함수입니다.
  const formatPrice = (price) => price.toLocaleString();

  return (
    <div className="container">
      <header className={styles.pageHeader}>
        <h1>장바구니</h1>
      </header>
      
      {/* 장바구니에 상품이 없는 경우 */}
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>장바구니에 담긴 상품이 없습니다.</p>
          <Link to="/pet-supplies">
            <Button variant="primary" size="large">쇼핑 계속하기</Button>
          </Link>
        </div>
      ) : (
        // 장바구니에 상품이 있는 경우
        <div className={styles.cartLayout}>
          {/* 상품 목록 섹션 */}
          <div className={styles.itemList}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.item}>
                <img src={item.image} alt={item.name} />
                <div className={styles.itemInfo}>
                  <p className={styles.brand}>{item.brand}</p>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.price}>{formatPrice(item.price)}원</p>
                </div>
                <div className={styles.itemControls}>
                  {/* 재사용 가능한 QuantitySelector 컴포넌트를 사용하여 수량을 조절합니다. */}
                  <QuantitySelector
                    quantity={item.quantity}
                    onDecrement={() => actions.updateCartQuantity(item.id, item.quantity - 1)}
                    onIncrement={() => actions.updateCartQuantity(item.id, item.quantity + 1)}
                    onQuantityChange={(newQuantity) => actions.updateCartQuantity(item.id, newQuantity)}
                  />
                  <p className={styles.itemTotal}>{formatPrice(item.price * item.quantity)}원</p>
                  {/* 상품 제거 버튼 */}
                  <button onClick={() => actions.removeFromCart(item.id)} className={styles.removeButton}>×</button>
                </div>
              </div>
            ))}
          </div>

          {/* 결제 예상 금액 요약 섹션 */}
          <aside className={styles.summary}>
            <h2>결제 예상 금액</h2>
            <div className={styles.summaryRow}>
              <span>상품 금액</span>
              <span>{formatPrice(subtotal)}원</span>
            </div>
            <div className={styles.summaryRow}>
              <span>배송비</span>
              <span>{shippingFee > 0 ? `${formatPrice(shippingFee)}원` : '무료'}</span>
            </div>
            {/* 무료 배송까지 남은 금액을 표시합니다. */}
            {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD &&
              <p className={styles.shippingInfo}>
                {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}원 추가 주문 시 무료배송
              </p>
            }
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>총 결제 예상 금액</span>
              <span>{formatPrice(total)}원</span>
            </div>
            <Button variant="primary" size="large" className={styles.orderButton}>주문하기</Button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;