import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { categories, brands, colors as colorOptions, sizes as sizeOptions } from '../data/products';
import { productsApi } from '../api';
import './ProductList.css';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState(categories);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: null,
    colors: [],
    sizes: [],
    brands: [],
    sort: 'featured',
  });

  // Sync URL params to filter state
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== filters.category) {
      setFilters(prev => ({ ...prev, category: cat }));
    }
  }, [searchParams]);

  // Fetch products from API when filters change
  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = {
          category: filters.category,
          sort: filters.sort,
        };
        if (filters.priceRange) {
          params.minPrice = filters.priceRange[0];
          params.maxPrice = filters.priceRange[1];
        }
        if (filters.colors.length > 0) {
          params.colors = filters.colors;
        }
        if (filters.sizes.length > 0) {
          params.sizes = filters.sizes;
        }
        if (filters.brands.length > 0) {
          params.brand = filters.brands.join(',');
        }

        const data = await productsApi.list(params);
        if (!cancelled) {
          setProducts(data.products || []);
          if (data.categoryCounts) {
            setDynamicCategories(prev => prev.map(cat => ({
              ...cat,
              count: data.categoryCounts[cat.id] || 0
            })));
          }
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'category') {
      setSearchParams(value === 'all' ? {} : { category: value });
    }
  };

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({ category: 'all', priceRange: null, colors: [], sizes: [], brands: [], sort: 'featured' });
    setSearchParams({});
  };

  const activeFilterCount = [
    filters.category !== 'all',
    filters.colors.length > 0,
    filters.sizes.length > 0,
    filters.brands.length > 0,
    filters.priceRange !== null,
  ].filter(Boolean).length;

  const priceRanges = [
    { label: 'Under $50', value: [0, 50] },
    { label: '$50 - $100', value: [50, 100] },
    { label: '$100 - $250', value: [100, 250] },
    { label: '$250 - $500', value: [250, 500] },
    { label: '$500+', value: [500, 9999] },
  ];

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="pl-header">
          <div>
            <h1 className="pl-title">
              {filters.category !== 'all'
                ? dynamicCategories.find(c => c.id === filters.category)?.name || 'Shop'
                : 'All Products'}
            </h1>
            <p className="pl-count">{products.length} products found</p>
          </div>

          <div className="pl-header-actions">
            <button
              className="btn btn-secondary hide-desktop"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            <div className="pl-sort">
              <label className="pl-sort-label">Sort by:</label>
              <select
                className="pl-sort-select"
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                id="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pl-layout">
          {/* Sidebar Filters */}
          <aside className={`pl-sidebar ${mobileFiltersOpen ? 'sidebar-open' : ''}`} id="filter-sidebar">
            <div className="pl-sidebar-header hide-desktop">
              <h3>Filters</h3>
              <button className="btn btn-ghost" onClick={() => setMobileFiltersOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {activeFilterCount > 0 && (
              <button className="pl-clear-filters" onClick={clearFilters}>
                Clear all filters ({activeFilterCount})
              </button>
            )}

            {/* Category Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                {dynamicCategories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-chip ${filters.category === cat.id ? 'active' : ''}`}
                    onClick={() => updateFilter('category', cat.id)}
                  >
                    <span className="filter-chip-icon">{cat.icon}</span>
                    {cat.name}
                    <span className="filter-chip-count">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Price Range</h4>
              <div className="filter-options">
                {priceRanges.map((range, i) => (
                  <button
                    key={i}
                    className={`filter-chip ${filters.priceRange && filters.priceRange[0] === range.value[0] && filters.priceRange[1] === range.value[1] ? 'active' : ''}`}
                    onClick={() => updateFilter('priceRange',
                      filters.priceRange && filters.priceRange[0] === range.value[0] ? null : range.value
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Color</h4>
              <div className="filter-colors">
                {colorOptions.map(color => (
                  <button
                    key={color.name}
                    className={`filter-color-btn ${filters.colors.includes(color.name) ? 'active' : ''}`}
                    onClick={() => toggleArrayFilter('colors', color.name)}
                    title={color.name}
                  >
                    <span className="filter-color-swatch" style={{ background: color.hex }}></span>
                    <span className="filter-color-name">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Size</h4>
              <div className="filter-sizes">
                {sizeOptions.map(size => (
                  <button
                    key={size}
                    className={`filter-size-btn ${filters.sizes.includes(size) ? 'active' : ''}`}
                    onClick={() => toggleArrayFilter('sizes', size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Brand</h4>
              <div className="filter-options">
                {brands.map(brand => (
                  <label key={brand} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleArrayFilter('brands', brand)}
                    />
                    <span className="filter-checkbox-mark"></span>
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Overlay */}
          {mobileFiltersOpen && (
            <div className="pl-sidebar-overlay" onClick={() => setMobileFiltersOpen(false)} />
          )}

          {/* Product Grid */}
          <div className="pl-products">
            {loading ? (
              <div className="pl-empty">
                <p style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="product-grid">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="pl-empty">
                <span className="pl-empty-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters to find what you're looking for.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
