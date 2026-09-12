import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const { success } = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.colors[0], product.sizes[0]);
    success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="product-card glass-card animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
      id={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="product-card-image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="product-card-badges">
          {product.isNew && <span className="badge badge-violet">New</span>}
          {discountPercent && <span className="badge badge-rose">-{discountPercent}%</span>}
        </div>

        {/* Quick Actions Overlay */}
        <div className="product-card-overlay">
          <button
            className="product-card-action-btn"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Add to Cart
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          className={`product-card-wishlist ${wishlisted ? 'wishlisted' : ''}`}
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="product-card-info">
        <span className="product-card-brand">{product.brand}</span>
        <h3 className="product-card-name">{product.name}</h3>
        
        <div className="product-card-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
            ))}
          </div>
          <span className="rating-count">({product.reviews})</span>
        </div>

        <div className="product-card-price">
          <span className="current-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
