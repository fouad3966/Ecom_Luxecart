import { Link } from 'react-router-dom';
import './PromoBar.css';

export default function PromoBar() {
  return (
    <section className="promo-section" id="promo-section">
      <div className="container">
        <div className="promo-banner">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=500&fit=crop&q=80"
            alt="End of season sale"
            className="promo-banner-img"
            loading="lazy"
          />
          <div className="promo-banner-overlay" />
          <div className="promo-banner-content">
            <span className="promo-banner-eyebrow">Limited time</span>
            <h3 className="promo-banner-title">End of season.<br/><em>Up to 40% off.</em></h3>
            <Link to="/products?category=clothing" className="promo-banner-cta">
              Shop the sale →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
