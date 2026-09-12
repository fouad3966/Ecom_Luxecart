import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isLoggedIn } = useAuth();
  const { success, error: showError } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isLoggedIn) {
    navigate('/account');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      let result;
      if (isRegister) {
        result = await register(formData.name, formData.email, formData.password);
      } else {
        result = await login(formData.email, formData.password);
      }

      if (result.success) {
        success(isRegister ? 'Account created! Welcome to LuxeCart!' : 'Welcome back!');
        navigate('/account');
      } else {
        setFormError(result.error);
        showError(result.error);
      }
    } catch (err) {
      const msg = err.message || 'Something went wrong';
      setFormError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-layout">
          {/* Visual Panel */}
          <div className="login-visual">
            <div className="login-visual-content">
              <span className="login-visual-icon">◆</span>
              <h2 className="login-visual-title">
                {isRegister ? 'Join LuxeCart' : 'Welcome Back'}
              </h2>
              <p className="login-visual-text">
                {isRegister
                  ? 'Create an account to enjoy exclusive deals, order tracking, and a personalized shopping experience.'
                  : 'Sign in to access your account, view your orders, and continue shopping.'}
              </p>
              <div className="login-visual-features">
                <div className="login-feature">
                  <span>✦</span> Exclusive member deals
                </div>
                <div className="login-feature">
                  <span>📦</span> Track your orders
                </div>
                <div className="login-feature">
                  <span>♡</span> Save your wishlist
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="login-form-panel">
            <div className="login-form-card glass-card" id="auth-form">
              <h2 className="login-form-title">
                {isRegister ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="login-form-subtitle">
                {isRegister ? 'Fill in your details to get started' : 'Enter your credentials to access your account'}
              </p>

              <form className="login-form" onSubmit={handleSubmit}>
                {isRegister && (
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input
                      className="input-field"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      id="name-input"
                      disabled={submitting}
                    />
                  </div>
                )}

                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    id="email-input"
                    disabled={submitting}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                    id="password-input"
                    disabled={submitting}
                  />
                </div>

                {formError && (
                  <div className="login-error">{formError}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg login-submit"
                  id="auth-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
                </button>
              </form>

              <p className="login-toggle">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  className="login-toggle-btn"
                  onClick={() => { setIsRegister(!isRegister); setFormError(''); }}
                  disabled={submitting}
                >
                  {isRegister ? 'Sign In' : 'Create one'}
                </button>
              </p>

              <p className="login-demo-hint">
                💡 Demo: admin@luxecart.com / admin123 (admin) or demo@luxecart.com / demo123 (customer)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
