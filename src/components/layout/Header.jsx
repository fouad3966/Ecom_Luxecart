import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isLoggedIn, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Promo Bar */}
      <div className="promo-bar">
        <div className="container promo-bar-content">
          <span>✦ Free shipping on orders over $100 — Use code <strong>LUXE10</strong> for 10% off ✦</span>
        </div>
      </div>

      <header className={`header ${scrolled ? 'header-scrolled' : ''}`} id="main-header">
        <div className="container header-content">
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle hide-desktop" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Logo */}
          <Link to="/" className="logo" id="logo-link">
            <span className="logo-icon">◆</span>
            <span className="logo-text">LuxeCart</span>
          </Link>

          {/* Navigation */}
          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`} id="main-nav">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>Shop</Link>
            <Link to="/products?category=clothing" className={`nav-link ${location.search.includes('clothing') ? 'active' : ''}`}>Clothing</Link>
            <Link to="/products?category=accessories" className={`nav-link ${location.search.includes('accessories') ? 'active' : ''}`}>Accessories</Link>
            <Link to="/products?category=footwear" className={`nav-link ${location.search.includes('footwear') ? 'active' : ''}`}>Footwear</Link>
            {isAdmin && (
              <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} style={{ color: 'var(--gold)' }}>
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Search Toggle */}
            <button 
              className="header-action-btn" 
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              id="search-toggle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="header-action-btn" aria-label="Wishlist" id="wishlist-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            {/* Account */}
            <Link to={isLoggedIn ? '/account' : '/login'} className="header-action-btn" aria-label="Account" id="account-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="header-action-btn cart-btn" aria-label="Cart" id="cart-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {itemCount > 0 && <span className="action-badge cart-badge">{itemCount}</span>}
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        <div className={`search-overlay ${searchOpen ? 'search-open' : ''}`}>
          <div className="container">
            <form className="search-form" onSubmit={handleSearch}>
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                className="search-input"
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-input"
              />
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
    </>
  );
}
