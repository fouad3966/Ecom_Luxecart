import { useState, useEffect } from 'react';
import ProductCard from '../ui/ProductCard';
import { productsApi } from '../../api';
import { Link } from 'react-router-dom';
import './FeaturedProducts.css';

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchFeatured() {
      try {
        const data = await productsApi.featured();
        if (!cancelled) setFeatured(data.products || []);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      }
    }
    fetchFeatured();
    return () => { cancelled = true; };
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="featured-section" id="featured-products">
      <div className="container">
        <div className="featured-header">
          <div className="featured-header-left">
            <span className="featured-eyebrow">Curated picks</span>
            <h2 className="section-title">Editors' favorites.</h2>
          </div>
          <Link to="/products" className="featured-view-all">
            View all products <span>→</span>
          </Link>
        </div>

        <div className="product-grid">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
