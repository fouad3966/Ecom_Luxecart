import { useState, useEffect } from 'react';
import HeroBanner from '../components/sections/HeroBanner';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import Categories from '../components/sections/Categories';
import PromoBar from '../components/sections/PromoBar';
import Newsletter from '../components/ui/Newsletter';
import ProductCard from '../components/ui/ProductCard';
import { productsApi } from '../api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchTrending() {
      try {
        const data = await productsApi.trending();
        if (!cancelled) setTrending(data.products || []);
      } catch (err) {
        console.error('Failed to fetch trending products:', err);
      }
    }
    fetchTrending();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <HeroBanner />
      <Categories />
      <FeaturedProducts />
      <PromoBar />

      {/* Trending Section */}
      {trending.length > 0 && (
        <section className="featured-section" id="trending-products">
          <div className="container">
            <div className="featured-header">
              <div className="featured-header-left">
                <span className="featured-eyebrow">Trending now</span>
                <h2 className="section-title">Most wanted this week.</h2>
              </div>
              <Link to="/products" className="featured-view-all">
                See all <span>→</span>
              </Link>
            </div>
            <div className="product-grid">
              {trending.slice(0, 4).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
