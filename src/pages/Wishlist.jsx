import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { productsApi } from '../api';
import ProductCard from '../components/ui/ProductCard';
import './Wishlist.css';

export default function Wishlist() {
  const { items, count } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchWishlistProducts() {
      if (items.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }
      try {
        // Fetch all products and filter to wishlisted ones
        const data = await productsApi.list();
        if (!cancelled) {
          const products = (data.products || []).filter(p => items.includes(p.id));
          setWishlistProducts(products);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist products:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchWishlistProducts();
    return () => { cancelled = true; };
  }, [items]);

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1 className="wishlist-title">
            My Wishlist
            {count > 0 && <span className="wishlist-count">({count})</span>}
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-secondary)' }}>
            Loading wishlist...
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div className="product-grid">
            {wishlistProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="wishlist-empty animate-fade-in-up">
            <span className="wishlist-empty-icon">♡</span>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love for later by clicking the heart icon on any product</p>
            <Link to="/products" className="btn btn-primary btn-lg">Explore Products</Link>
          </div>
        )}
      </div>
    </div>
  );
}
