import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">◆</span>
              <span className="logo-text">LuxeCart</span>
            </Link>
            <p className="footer-tagline">
              Curated fashion & lifestyle for the discerning individual.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-col-title">Shop</h4>
              <Link to="/products?category=clothing" className="footer-link">Clothing</Link>
              <Link to="/products?category=footwear" className="footer-link">Footwear</Link>
              <Link to="/products?category=accessories" className="footer-link">Accessories</Link>
              <Link to="/products?category=bags" className="footer-link">Bags</Link>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Help</h4>
              <Link to="/help" className="footer-link">Help Center</Link>
              <Link to="/shipping" className="footer-link">Shipping Info</Link>
              <Link to="/returns" className="footer-link">Returns & Exchanges</Link>
              <Link to="/size-guide" className="footer-link">Size Guide</Link>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Account</h4>
              <Link to="/login" className="footer-link">Sign In</Link>
              <Link to="/account" className="footer-link">My Orders</Link>
              <Link to="/wishlist" className="footer-link">Wishlist</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} LuxeCart. All rights reserved.
          </p>
          <div className="footer-payment">
            <span className="payment-icon">💳</span>
            <span className="payment-icon">🔒</span>
            <span className="payment-text">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
