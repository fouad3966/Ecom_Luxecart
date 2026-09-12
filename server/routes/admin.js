import { Router } from 'express';
import { getAll, getOne, runQuery } from '../db/connection.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(requireAdmin);

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

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

/**
 * GET /api/admin/stats
 */
router.get('/stats', (req, res) => {
  try {
    const totalRevenue = getOne('SELECT COALESCE(SUM(total), 0) as value FROM orders') || { value: 0 };
    const totalOrders = getOne('SELECT COUNT(*) as value FROM orders') || { value: 0 };
    const totalProducts = getOne('SELECT COUNT(*) as value FROM products') || { value: 0 };
    const totalCustomers = getOne("SELECT COUNT(*) as value FROM users WHERE role = 'customer'") || { value: 0 };
    const avgOrder = totalOrders.value > 0 ? totalRevenue.value / totalOrders.value : 0;

    res.json({
      stats: {
        totalRevenue: totalRevenue.value,
        totalOrders: totalOrders.value,
        totalProducts: totalProducts.value,
        totalCustomers: totalCustomers.value,
        avgOrderValue: Math.round(avgOrder * 100) / 100,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * GET /api/admin/orders
 */
router.get('/orders', (req, res) => {
  try {
    const orders = getAll('SELECT * FROM orders ORDER BY created_at DESC');
    const result = orders.map(order => {
      const items = getAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      const user = getOne('SELECT email, first_name, last_name FROM users WHERE id = ?', [order.user_id]);

      return {
        id: order.order_number,
        orderNumber: order.order_number,
        dbId: order.id,
        date: order.created_at,
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax,
        coupon: order.coupon_code,
        customer: user ? {
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        } : null,
        shippingInfo: {
          firstName: order.shipping_first_name,
          lastName: order.shipping_last_name,
          address: order.shipping_address,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip,
          country: order.shipping_country,
        },
        items: items.map(i => ({
          id: i.id,
          productId: i.product_id,
          name: i.product_name,
          image: i.product_image,
          quantity: i.quantity,
          price: i.price,
          selectedColor: i.selected_color,
          selectedSize: i.selected_size,
          itemKey: `${i.product_id}-${i.selected_color}-${i.selected_size}`,
        })),
      };
    });

    res.json({ orders: result });
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * PUT /api/admin/orders/:id/status
 * Body: { status }
 */
router.put('/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = getOne('SELECT id FROM orders WHERE order_number = ?', [req.params.id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    runQuery('UPDATE orders SET status = ? WHERE id = ?', [status, order.id]);
    res.json({ success: true, status });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

/**
 * GET /api/admin/products
 */
router.get('/products', (req, res) => {
  try {
    const rows = getAll('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ products: rows.map(formatProduct) });
  } catch (err) {
    console.error('Admin products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * POST /api/admin/products
 * Body: full product object
 */
router.post('/products', (req, res) => {
  try {
    const p = req.body;
    if (!p.name || !p.price || !p.brand || !p.description) {
      return res.status(400).json({ error: 'Name, price, brand, and description are required' });
    }

    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const existing = getOne('SELECT id FROM products WHERE slug = ?', [slug]);
    if (existing) {
      return res.status(409).json({ error: 'A product with this slug already exists' });
    }

    const result = runQuery(
      `INSERT INTO products (name, slug, price, original_price, category, brand, description,
        images, colors, sizes, rating, reviews_count, in_stock, is_new, is_featured, is_trending, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.name, slug,
        parseFloat(p.price) || 0,
        p.originalPrice ? parseFloat(p.originalPrice) : null,
        p.category || 'clothing',
        p.brand,
        p.description,
        JSON.stringify(p.images || []),
        JSON.stringify(p.colors || []),
        JSON.stringify(p.sizes || []),
        parseFloat(p.rating) || 4.5,
        parseInt(p.reviews) || 0,
        p.inStock !== false ? 1 : 0,
        p.isNew ? 1 : 0,
        p.isFeatured ? 1 : 0,
        p.isTrending ? 1 : 0,
        JSON.stringify(p.tags || []),
      ]
    );

    const created = getOne('SELECT * FROM products WHERE id = ?', [result.lastId]);
    res.status(201).json({ product: formatProduct(created) });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/admin/products/:id
 * Body: full product object
 */
router.put('/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = getOne('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const p = req.body;
    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check slug uniqueness (exclude current product)
    const slugConflict = getOne('SELECT id FROM products WHERE slug = ? AND id != ?', [slug, id]);
    if (slugConflict) {
      return res.status(409).json({ error: 'A product with this slug already exists' });
    }

    runQuery(
      `UPDATE products SET
        name = ?, slug = ?, price = ?, original_price = ?, category = ?, brand = ?, description = ?,
        images = ?, colors = ?, sizes = ?, rating = ?, reviews_count = ?,
        in_stock = ?, is_new = ?, is_featured = ?, is_trending = ?, tags = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        p.name, slug,
        parseFloat(p.price) || 0,
        p.originalPrice ? parseFloat(p.originalPrice) : null,
        p.category || 'clothing',
        p.brand || '',
        p.description || '',
        JSON.stringify(p.images || []),
        JSON.stringify(p.colors || []),
        JSON.stringify(p.sizes || []),
        parseFloat(p.rating) || 4.5,
        parseInt(p.reviews) || 0,
        p.inStock !== false ? 1 : 0,
        p.isNew ? 1 : 0,
        p.isFeatured ? 1 : 0,
        p.isTrending ? 1 : 0,
        JSON.stringify(p.tags || []),
        id,
      ]
    );

    const updated = getOne('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ product: formatProduct(updated) });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/admin/products/:id
 */
router.delete('/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = getOne('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    runQuery('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

/**
 * GET /api/admin/coupons
 */
router.get('/coupons', (req, res) => {
  try {
    const rows = getAll('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ coupons: rows });
  } catch (err) {
    console.error('Admin coupons error:', err);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

export default router;
