import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Cart.css';

export default function Cart() {
  const { items, itemCount, subtotal, discount, shipping, total, isFreeShipping, appliedCoupon, couponError, addItem, removeItem, updateQuantity, applyCoupon, removeCoupon, clearCouponError } = useCart();
  const { success } = useToast();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      if (!couponError) {
        success('Coupon applied successfully!');
      }
      setCouponCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty container">
        <div className="cart-empty-content animate-fade-in-up">
          <span className="cart-empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart <span className="cart-count">({itemCount} items)</span></h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.itemKey} className="cart-item glass-card animate-fade-in">
                <Link to={`/product/${item.slug}`} className="cart-item-image-wrap">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                </Link>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <Link to={`/product/${item.slug}`} className="cart-item-name">{item.name}</Link>
                      <div className="cart-item-variants">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => { removeItem(item.itemKey); success('Item removed from cart'); }}
                      aria-label="Remove item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="cart-item-quantity">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                      >+</button>
                    </div>
                    <div className="cart-item-price">
                      <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                      {item.quantity > 1 && (
                        <span className="cart-item-unit">${item.price.toFixed(2)} each</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary glass-card" id="order-summary">
            <h3 className="cart-summary-title">Order Summary</h3>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="cart-summary-row cart-summary-discount">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="cart-free-ship">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {!isFreeShipping && subtotal < 100 && (
                <div className="cart-freeship-notice">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
            </div>

            {/* Coupon */}
            <div className="cart-coupon">
              {appliedCoupon ? (
                <div className="cart-coupon-applied">
                  <div>
                    <span className="badge badge-emerald">{appliedCoupon.code}</span>
                    <span className="cart-coupon-desc">{appliedCoupon.description}</span>
                  </div>
                  <button className="cart-coupon-remove" onClick={() => { removeCoupon(); success('Coupon removed'); }}>×</button>
                </div>
              ) : (
                <form className="cart-coupon-form" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); clearCouponError(); }}
                    className={`input-field ${couponError ? 'input-error' : ''}`}
                    id="coupon-input"
                  />
                  <button type="submit" className="btn btn-secondary">Apply</button>
                </form>
              )}
              {couponError && <span className="input-error-text">{couponError}</span>}
            </div>

            <div className="cart-summary-total">
              <span>Total</span>
              <span className="cart-total-value">${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-lg cart-checkout-btn" id="checkout-btn">
              Proceed to Checkout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>

            <p className="cart-secure">🔒 Your information is safe and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
