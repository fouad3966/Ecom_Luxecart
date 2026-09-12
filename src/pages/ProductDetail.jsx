import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../api';
import { reviews as staticReviews } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ui/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const { success } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    let cancelled = false;
    async function fetchProduct() {
      setLoading(true);
      setSelectedImage(0);
      setSelectedColor('');
      setSelectedSize('');
      setQuantity(1);
      try {
        const data = await productsApi.getBySlug(slug);
        if (!cancelled) {
          setProduct(data.product);
          // Fetch related products
          const relatedData = await productsApi.list({ category: data.product.category });
          if (!cancelled) {
            setRelatedProducts(
              (relatedData.products || []).filter(p => p.slug !== slug).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProduct();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="pd-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: 'var(--space-16) 0', color: 'var(--text-secondary)' }}>
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found container">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  // Use static reviews filtered by product ID (reviews would ideally come from API too)
  const reviews = staticReviews.filter(r => r.productId === product.id);
  const wishlisted = isWishlisted(product.id);

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      success('Please select a size');
      return;
    }
    addItem(product, quantity, selectedColor || product.colors[0], selectedSize || product.sizes[0]);
    success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      success('Please select a size');
      return;
    }
    addItem(product, quantity, selectedColor || product.colors[0], selectedSize || product.sizes[0]);
    navigate('/cart');
  };

  return (
    <div className="pd-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="pd-breadcrumb-sep">/</span>
          <Link to="/products">Shop</Link>
          <span className="pd-breadcrumb-sep">/</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <span className="pd-breadcrumb-sep">/</span>
          <span className="pd-breadcrumb-current">{product.name}</span>
        </nav>

        <div className="pd-main">
          {/* Image Gallery */}
          <div className="pd-gallery">
            <div className="pd-main-image-wrap">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="pd-main-image"
              />
              {discountPercent && (
                <span className="badge badge-rose pd-discount-badge">-{discountPercent}%</span>
              )}
              {product.isNew && (
                <span className="badge badge-violet pd-new-badge">New</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="pd-thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumbnail ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pd-info">
            <div className="pd-meta">
              <span className="pd-brand">{product.brand}</span>
              <div className="pd-rating-row">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                <span className="pd-rating-text">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-price-row">
              <span className="pd-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="pd-original-price">${product.originalPrice.toFixed(2)}</span>
                  <span className="badge badge-rose">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                </>
              )}
            </div>

            <p className="pd-description">{product.description}</p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="pd-option-group">
                <label className="pd-option-label">
                  Color: <strong>{selectedColor || product.colors[0]}</strong>
                </label>
                <div className="pd-color-options">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`pd-color-btn ${(selectedColor || product.colors[0]) === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="pd-option-group">
                <label className="pd-option-label">
                  Size: <strong>{selectedSize || 'Select a size'}</strong>
                </label>
                <div className="pd-size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`pd-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-option-group">
              <label className="pd-option-label">Quantity</label>
              <div className="pd-quantity">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span className="pd-qty-value">{quantity}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              <button className="btn btn-primary btn-lg pd-add-btn" onClick={handleAddToCart} id="add-to-cart-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Add to Cart
              </button>
              <button className="btn btn-outline btn-lg" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button
                className={`btn btn-icon btn-secondary pd-wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
                onClick={() => {
                  toggleItem(product.id);
                  success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                }}
                aria-label="Toggle wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pd-trust">
              <div className="pd-trust-item">
                <span>🚚</span> Free shipping over $100
              </div>
              <div className="pd-trust-item">
                <span>↩️</span> 30-day returns
              </div>
              <div className="pd-trust-item">
                <span>🔒</span> Secure checkout
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="pd-tabs">
          <div className="pd-tab-nav">
            <button
              className={`pd-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >Description</button>
            <button
              className={`pd-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >Reviews ({reviews.length})</button>
          </div>

          <div className="pd-tab-content">
            {activeTab === 'description' && (
              <div className="pd-desc-content animate-fade-in">
                <p>{product.description}</p>
                <div className="pd-features">
                  <h4>Features</h4>
                  <ul>
                    <li>Premium materials sourced from the finest suppliers</li>
                    <li>Expert craftsmanship with attention to every detail</li>
                    <li>Designed for comfort and durability</li>
                    <li>Eco-friendly packaging and sustainable practices</li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="pd-reviews animate-fade-in">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="pd-review glass-card">
                    <div className="pd-review-header">
                      <div className="pd-review-avatar">{review.user.charAt(0)}</div>
                      <div>
                        <span className="pd-review-user">{review.user}</span>
                        <span className="pd-review-date">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="stars" style={{ marginLeft: 'auto' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="pd-review-comment">{review.comment}</p>
                  </div>
                )) : (
                  <p className="pd-no-reviews">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pd-related">
            <h2 className="section-title">You May Also Like</h2>
            <div className="product-grid">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
