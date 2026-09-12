import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsApi } from '../api';
import ProductCard from '../components/ui/ProductCard';
import './Search.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    async function search() {
      setLoading(true);
      try {
        const data = await productsApi.list({ q: query });
        if (!cancelled) setResults(data.products || []);
      } catch (err) {
        console.error('Search failed:', err);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    search();
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1 className="search-title">
            {query ? (
              <>Search results for "<span className="search-query-highlight">{query}</span>"</>
            ) : (
              'Search Products'
            )}
          </h1>
          <p className="search-count">
            {loading ? 'Searching...' : `${results.length} ${results.length === 1 ? 'product' : 'products'} found`}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="product-grid">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : !loading && query ? (
          <div className="search-empty animate-fade-in-up">
            <span className="search-empty-icon">🔍</span>
            <h2>No results found</h2>
            <p>Try different keywords or browse our collections</p>
            <div className="search-suggestions">
              <span className="search-suggestion-label">Try searching for:</span>
              <div className="search-suggestion-tags">
                <Link to="/search?q=jacket" className="search-tag">Jacket</Link>
                <Link to="/search?q=sneakers" className="search-tag">Sneakers</Link>
                <Link to="/search?q=watch" className="search-tag">Watch</Link>
                <Link to="/search?q=leather" className="search-tag">Leather</Link>
                <Link to="/search?q=hoodie" className="search-tag">Hoodie</Link>
              </div>
            </div>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Browse All Products</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
