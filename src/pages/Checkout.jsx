import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Checkout.css';

const steps = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, discount, shipping, total, appliedCoupon, clearCart } = useCart();
  const { isLoggedIn, user, addOrder } = useAuth();
  const { success, error: showError } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  if (items.length === 0) {
    return (
      <div className="checkout-empty container">
        <h2>No items to checkout</h2>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const validateShipping = () => {
    const errors = {};
    if (!shippingInfo.firstName.trim()) errors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) errors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim() || !shippingInfo.email.includes('@')) errors.email = 'Valid email is required';
    if (!shippingInfo.address.trim()) errors.address = 'Address is required';
    if (!shippingInfo.city.trim()) errors.city = 'City is required';
    if (!shippingInfo.state.trim()) errors.state = 'State is required';
    if (!shippingInfo.zip.trim()) errors.zip = 'ZIP code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = () => {
    const errors = {};
    if (!paymentInfo.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) errors.cardNumber = 'Enter a valid 16-digit card number';
    if (!paymentInfo.cardName.trim()) errors.cardName = 'Cardholder name is required';
    if (!paymentInfo.expiry.match(/^\d{2}\/\d{2}$/)) errors.expiry = 'Enter expiry as MM/YY';
    if (!paymentInfo.cvv.match(/^\d{3,4}$/)) errors.cvv = 'Enter a valid CVV';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (validateShipping()) {
        setCurrentStep(1);
        setFormErrors({});
      }
    } else if (currentStep === 1) {
      if (validatePayment()) {
        setCurrentStep(2);
        setFormErrors({});
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (placingOrder) return;
    setPlacingOrder(true);

    try {
      const order = await addOrder({
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })),
        shippingInfo,
        subtotal,
        discount,
        shipping,
        total,
        coupon: appliedCoupon?.code || null,
      });
      clearCart();
      success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      showError(err.message || 'Failed to place order. Please try again.');
      setPlacingOrder(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
    return v.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        {/* Step Indicator */}
        <div className="checkout-steps">
          {steps.map((step, i) => (
            <div key={step} className={`checkout-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}>
              <div className="step-circle">
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span className="step-label">{step}</span>
              {i < steps.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Form Area */}
          <div className="checkout-form-area">
            {/* Step 1: Shipping */}
            {currentStep === 0 && (
              <div className="checkout-form glass-card animate-fade-in" id="shipping-form">
                <h2 className="checkout-form-title">Shipping Information</h2>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">First Name *</label>
                    <input
                      className={`input-field ${formErrors.firstName ? 'input-error' : ''}`}
                      value={shippingInfo.firstName}
                      onChange={e => setShippingInfo(p => ({ ...p, firstName: e.target.value }))}
                      placeholder="John"
                    />
                    {formErrors.firstName && <span className="input-error-text">{formErrors.firstName}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">Last Name *</label>
                    <input
                      className={`input-field ${formErrors.lastName ? 'input-error' : ''}`}
                      value={shippingInfo.lastName}
                      onChange={e => setShippingInfo(p => ({ ...p, lastName: e.target.value }))}
                      placeholder="Doe"
                    />
                    {formErrors.lastName && <span className="input-error-text">{formErrors.lastName}</span>}
                  </div>
                  <div className="input-group full-width">
                    <label className="input-label">Email *</label>
                    <input
                      type="email"
                      className={`input-field ${formErrors.email ? 'input-error' : ''}`}
                      value={shippingInfo.email}
                      onChange={e => setShippingInfo(p => ({ ...p, email: e.target.value }))}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && <span className="input-error-text">{formErrors.email}</span>}
                  </div>
                  <div className="input-group full-width">
                    <label className="input-label">Phone</label>
                    <input
                      className="input-field"
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="input-group full-width">
                    <label className="input-label">Address *</label>
                    <input
                      className={`input-field ${formErrors.address ? 'input-error' : ''}`}
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo(p => ({ ...p, address: e.target.value }))}
                      placeholder="123 Main Street, Apt 4B"
                    />
                    {formErrors.address && <span className="input-error-text">{formErrors.address}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">City *</label>
                    <input
                      className={`input-field ${formErrors.city ? 'input-error' : ''}`}
                      value={shippingInfo.city}
                      onChange={e => setShippingInfo(p => ({ ...p, city: e.target.value }))}
                      placeholder="New York"
                    />
                    {formErrors.city && <span className="input-error-text">{formErrors.city}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">State *</label>
                    <input
                      className={`input-field ${formErrors.state ? 'input-error' : ''}`}
                      value={shippingInfo.state}
                      onChange={e => setShippingInfo(p => ({ ...p, state: e.target.value }))}
                      placeholder="NY"
                    />
                    {formErrors.state && <span className="input-error-text">{formErrors.state}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">ZIP Code *</label>
                    <input
                      className={`input-field ${formErrors.zip ? 'input-error' : ''}`}
                      value={shippingInfo.zip}
                      onChange={e => setShippingInfo(p => ({ ...p, zip: e.target.value }))}
                      placeholder="10001"
                    />
                    {formErrors.zip && <span className="input-error-text">{formErrors.zip}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">Country</label>
                    <select
                      className="input-field"
                      value={shippingInfo.country}
                      onChange={e => setShippingInfo(p => ({ ...p, country: e.target.value }))}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                    </select>
                  </div>
                </div>

                <div className="checkout-form-actions">
                  <Link to="/cart" className="btn btn-ghost">← Back to Cart</Link>
                  <button className="btn btn-primary btn-lg" onClick={handleNext}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <div className="checkout-form glass-card animate-fade-in" id="payment-form">
                <h2 className="checkout-form-title">Payment Information</h2>
                <div className="payment-notice">
                  <span>🔒</span> This is a demo. No real payment is processed.
                </div>
                <div className="form-grid">
                  <div className="input-group full-width">
                    <label className="input-label">Card Number *</label>
                    <input
                      className={`input-field ${formErrors.cardNumber ? 'input-error' : ''}`}
                      value={paymentInfo.cardNumber}
                      onChange={e => setPaymentInfo(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                    />
                    {formErrors.cardNumber && <span className="input-error-text">{formErrors.cardNumber}</span>}
                  </div>
                  <div className="input-group full-width">
                    <label className="input-label">Cardholder Name *</label>
                    <input
                      className={`input-field ${formErrors.cardName ? 'input-error' : ''}`}
                      value={paymentInfo.cardName}
                      onChange={e => setPaymentInfo(p => ({ ...p, cardName: e.target.value }))}
                      placeholder="John Doe"
                    />
                    {formErrors.cardName && <span className="input-error-text">{formErrors.cardName}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">Expiry Date *</label>
                    <input
                      className={`input-field ${formErrors.expiry ? 'input-error' : ''}`}
                      value={paymentInfo.expiry}
                      onChange={e => setPaymentInfo(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {formErrors.expiry && <span className="input-error-text">{formErrors.expiry}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">CVV *</label>
                    <input
                      type="password"
                      className={`input-field ${formErrors.cvv ? 'input-error' : ''}`}
                      value={paymentInfo.cvv}
                      onChange={e => setPaymentInfo(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="•••"
                      maxLength={4}
                    />
                    {formErrors.cvv && <span className="input-error-text">{formErrors.cvv}</span>}
                  </div>
                </div>

                <div className="checkout-form-actions">
                  <button className="btn btn-ghost" onClick={() => setCurrentStep(0)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handleNext}>
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 2 && (
              <div className="checkout-form glass-card animate-fade-in" id="review-form">
                <h2 className="checkout-form-title">Review Your Order</h2>

                <div className="review-section">
                  <h4 className="review-section-title">Shipping To</h4>
                  <p className="review-text">
                    {shippingInfo.firstName} {shippingInfo.lastName}<br />
                    {shippingInfo.address}<br />
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}<br />
                    {shippingInfo.country}
                  </p>
                </div>

                <div className="review-section">
                  <h4 className="review-section-title">Payment Method</h4>
                  <p className="review-text">
                    💳 •••• •••• •••• {paymentInfo.cardNumber.slice(-4)}<br />
                    {paymentInfo.cardName}
                  </p>
                </div>

                <div className="review-section">
                  <h4 className="review-section-title">Items ({items.length})</h4>
                  <div className="review-items">
                    {items.map(item => (
                      <div key={item.itemKey} className="review-item">
                        <img src={item.image} alt={item.name} className="review-item-img" />
                        <div className="review-item-info">
                          <span className="review-item-name">{item.name}</span>
                          <span className="review-item-variant">
                            {item.selectedColor && `${item.selectedColor}`}
                            {item.selectedSize && ` / ${item.selectedSize}`}
                            {` × ${item.quantity}`}
                          </span>
                        </div>
                        <span className="review-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="checkout-form-actions">
                  <button className="btn btn-ghost" onClick={() => setCurrentStep(1)}>← Back</button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    id="place-order-btn"
                  >
                    {placingOrder ? 'Placing Order...' : `🛒 Place Order — $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar glass-card">
            <h3 className="checkout-sidebar-title">Order Summary</h3>
            <div className="checkout-sidebar-items">
              {items.map(item => (
                <div key={item.itemKey} className="checkout-sidebar-item">
                  <div className="checkout-sidebar-item-img-wrap">
                    <img src={item.image} alt={item.name} />
                    <span className="checkout-sidebar-item-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-sidebar-item-info">
                    <span className="checkout-sidebar-item-name">{item.name}</span>
                    <span className="checkout-sidebar-item-variant">
                      {item.selectedColor}{item.selectedSize && ` / ${item.selectedSize}`}
                    </span>
                  </div>
                  <span className="checkout-sidebar-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-sidebar-totals">
              <div className="checkout-sidebar-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="checkout-sidebar-row discount-row">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="checkout-sidebar-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="checkout-sidebar-row total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
