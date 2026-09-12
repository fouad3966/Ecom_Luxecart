import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { isLoggedIn, orders } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      // First try from context (already fetched)
      const cached = orders.find(o => o.id === orderId);
      if (cached) {
        setOrder(cached);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      if (isLoggedIn) {
        try {
          const data = await ordersApi.getByNumber(orderId);
          setOrder(data.order);
        } catch (err) {
          setError('Order not found');
        }
      } else {
        setError('Please log in to view order details');
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderId, isLoggedIn, orders]);

  if (loading) {
    return (
      <div className="oc-page">
        <div className="container">
          <div className="oc-card glass-card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="oc-not-found container">
        <h2>{error || 'Order not found'}</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="oc-page">
      <div className="container">
        <div className="oc-card glass-card animate-scale-in">
          <div className="oc-success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <h1 className="oc-title">Order Confirmed!</h1>
          <p className="oc-subtitle">Thank you for your purchase. Your order has been received and is being processed.</p>

          <div className="oc-details">
            <div className="oc-detail-row">
              <span className="oc-detail-label">Order Number</span>
              <span className="oc-detail-value oc-order-id">{order.id || order.orderNumber}</span>
            </div>
            <div className="oc-detail-row">
              <span className="oc-detail-label">Date</span>
              <span className="oc-detail-value">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="oc-detail-row">
              <span className="oc-detail-label">Estimated Delivery</span>
              <span className="oc-detail-value">{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="oc-detail-row">
              <span className="oc-detail-label">Total</span>
              <span className="oc-detail-value oc-total">${order.total.toFixed(2)}</span>
            </div>
            <div className="oc-detail-row">
              <span className="oc-detail-label">Shipping To</span>
              <span className="oc-detail-value">
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
                {order.shippingInfo.address}, {order.shippingInfo.city}
              </span>
            </div>
          </div>

          <div className="oc-items">
            <h3 className="oc-items-title">Items Ordered</h3>
            {order.items.map(item => (
              <div key={item.itemKey || item.id} className="oc-item">
                <img src={item.image} alt={item.name} className="oc-item-img" />
                <div className="oc-item-info">
                  <span className="oc-item-name">{item.name}</span>
                  <span className="oc-item-variant">
                    {item.selectedColor}{item.selectedSize && ` / ${item.selectedSize}`} × {item.quantity}
                  </span>
                </div>
                <span className="oc-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="oc-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
            <Link to="/account" className="btn btn-secondary btn-lg">View Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
