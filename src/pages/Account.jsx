import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Account.css';

export default function Account() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin, orders, logout, refreshOrders } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      refreshOrders();
    }
  }, [isLoggedIn, refreshOrders]);

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          {/* Profile Sidebar */}
          <div className="account-sidebar glass-card" id="account-sidebar">
            <div className="account-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <h2 className="account-name">{displayName}</h2>
            <p className="account-email">{user.email}</p>
            <p className="account-member-since">
              Member since {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>

            <div className="account-stats">
              <div className="account-stat">
                <span className="account-stat-value">{orders.length}</span>
                <span className="account-stat-label">Orders</span>
              </div>
              <div className="account-stat">
                <span className="account-stat-value">${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}</span>
                <span className="account-stat-label">Spent</span>
              </div>
            </div>

            {isAdmin && (
              <Link to="/admin" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem', background: 'var(--gold)', color: 'var(--bg-dark)', border: 'none' }}>
                Admin Dashboard
              </Link>
            )}

            <button className="btn btn-secondary account-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>

          {/* Main Content */}
          <div className="account-main">
            <h1 className="account-title">My Orders</h1>

            {orders.length > 0 ? (
              <div className="account-orders">
                {orders.map(order => (
                  <div key={order.id} className="account-order glass-card">
                    <div className="account-order-header">
                      <div>
                        <span className="account-order-id">{order.id}</span>
                        <span className="account-order-date">
                          {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="account-order-status">
                        <span className={`badge badge-${order.status === 'delivered' ? 'emerald' : order.status === 'cancelled' ? 'rose' : 'gold'}`}>
                          {order.status}
                        </span>
                        <span className="account-order-total">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="account-order-items">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.itemKey || item.id} className="account-order-item">
                          <img src={item.image} alt={item.name} />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="account-order-more">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="account-order-footer">
                      <span className="account-order-delivery">
                        Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <Link to={`/order-confirmation/${order.id}`} className="btn btn-ghost btn-sm">
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="account-empty animate-fade-in-up">
                <span className="account-empty-icon">📦</span>
                <h3>No orders yet</h3>
                <p>Your order history will appear here</p>
                <Link to="/products" className="btn btn-primary">Start Shopping</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
