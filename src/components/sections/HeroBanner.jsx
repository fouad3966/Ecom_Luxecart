import { Link } from 'react-router-dom';
import './HeroBanner.css';

export default function HeroBanner() {
  return (
    <section className="hero" id="hero-banner">
      <div className="hero-bg">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-grain" />
      </div>

      <div className="container hero-inner">
        <div className="hero-left">
          <div className="hero-tag animate-fade-in">
            <span className="hero-tag-dot" />
            New Season Arrivals
          </div>
          <h1 className="hero-headline animate-fade-in-up delay-1">
            Elevate Your<br />
            <span className="hero-headline-accent">Everyday</span> Style
          </h1>
          <p className="hero-sub animate-fade-in-up delay-2">
            Premium fashion curated for those who appreciate 
            quality, craftsmanship, and timeless design.
          </p>
          <div className="hero-btns animate-fade-in-up delay-3">
            <Link to="/products" className="hero-btn-main">
              Shop Collection
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/products?category=clothing" className="hero-btn-ghost">
              View Lookbook
            </Link>
          </div>

          <div className="hero-proof animate-fade-in-up delay-4">
            <div className="hero-avatars">
              <div className="hero-avatar" style={{ background: '#7c3aed' }}>A</div>
              <div className="hero-avatar" style={{ background: '#ec4899' }}>M</div>
              <div className="hero-avatar" style={{ background: '#f59e0b' }}>S</div>
              <div className="hero-avatar" style={{ background: '#10b981' }}>K</div>
            </div>
            <div className="hero-proof-text">
              <strong>4.9★</strong> from 50k+ happy customers
            </div>
          </div>
        </div>

        <div className="hero-right animate-fade-in-up delay-2">
          <div className="hero-showcase">
            <Link to="/product/midnight-leather-jacket" className="hero-card hero-card-main">
              <img
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop"
                alt="Premium Leather Jacket"
                className="hero-card-img"
              />
              <div className="hero-card-overlay">
                <span className="hero-card-tag">Best Seller</span>
                <div className="hero-card-info">
                  <span className="hero-card-name">Leather Jacket</span>
                  <span className="hero-card-price">$349</span>
                </div>
              </div>
            </Link>
            <div className="hero-stack">
              <Link to="/product/velocity-pro-sneakers" className="hero-card hero-card-sm">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop"
                  alt="Runner Pro Sneakers"
                  className="hero-card-img"
                />
                <div className="hero-card-overlay">
                  <div className="hero-card-info">
                    <span className="hero-card-name">Sneakers</span>
                    <span className="hero-card-price">$189</span>
                  </div>
                </div>
              </Link>
              <Link to="/product/chronograph-elite-watch" className="hero-card hero-card-sm">
                <img
                  src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=750&fit=crop"
                  alt="Chronograph Elite Watch"
                  className="hero-card-img"
                />
                <div className="hero-card-overlay">
                  <div className="hero-card-info">
                    <span className="hero-card-name">Watch</span>
                    <span className="hero-card-price">$599</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="hero-strip">
        <div className="container hero-strip-inner">
          <div className="hero-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Free shipping over $100
          </div>
          <div className="hero-strip-sep">·</div>
          <div className="hero-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            30-day free returns
          </div>
          <div className="hero-strip-sep">·</div>
          <div className="hero-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure checkout
          </div>
          <div className="hero-strip-sep">·</div>
          <div className="hero-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Ethically sourced
          </div>
        </div>
      </div>
    </section>
  );
}
