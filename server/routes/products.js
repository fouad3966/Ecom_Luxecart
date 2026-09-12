import { Router } from 'express';
import { getAll, getOne } from '../db/connection.js';

const router = Router();

/**
 * Parse JSON array fields from a DB product row.
 */
function formatProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    originalPrice: row.original_price,
    category: row.category,
    brand: row.brand,
    description: row.description,
    rating: row.rating,
    reviews: row.reviews_count,
    inStock: !!row.in_stock,
    isNew: !!row.is_new,
    isFeatured: !!row.is_featured,
    isTrending: !!row.is_trending,
    tags: safeJsonParse(row.tags, []),
    colors: safeJsonParse(row.colors, []),
    sizes: safeJsonParse(row.sizes, []),
    images: safeJsonParse(row.images, []),
  };
}

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * GET /api/products
 * Query params: category, brand, minPrice, maxPrice, colors, sizes, sort, q (search)
 */
router.get('/', (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, colors, sizes, sort, q } = req.query;

    let rows = getAll('SELECT * FROM products');
    let products = rows.map(formatProduct);

    // Calculate category counts before filtering
    const categoryCounts = { all: products.length };
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    // Filter by search query
    if (q) {
      const query = q.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Filter by brand(s)
    if (brand) {
      const brandList = brand.split(',');
      products = products.filter(p => brandList.includes(p.brand));
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Filter by colors
    if (colors) {
      const colorList = colors.split(',');
      products = products.filter(p => p.colors.some(c => colorList.includes(c)));
    }

    // Filter by sizes
    if (sizes) {
      const sizeList = sizes.split(',');
      products = products.filter(p => p.sizes.some(s => sizeList.includes(s)));
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured first, then by rating
        products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
    }

    res.json({ products, total: products.length, categoryCounts });
  } catch (err) {
    console.error('Products list error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/featured
 */
router.get('/featured', (req, res) => {
  try {
    const rows = getAll('SELECT * FROM products WHERE is_featured = 1');
    res.json({ products: rows.map(formatProduct) });
  } catch (err) {
    console.error('Featured products error:', err);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

/**
 * GET /api/products/trending
 */
router.get('/trending', (req, res) => {
  try {
    const rows = getAll('SELECT * FROM products WHERE is_trending = 1');
    res.json({ products: rows.map(formatProduct) });
  } catch (err) {
    console.error('Trending products error:', err);
    res.status(500).json({ error: 'Failed to fetch trending products' });
  }
});

/**
 * GET /api/products/:slug
 */
router.get('/:slug', (req, res) => {
  try {
    const row = getOne('SELECT * FROM products WHERE slug = ?', [req.params.slug]);
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product: formatProduct(row) });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
