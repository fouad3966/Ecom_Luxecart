import { Router } from 'express';
import { getAll, getOne, runQuery } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

/**
 * GET /api/cart
 * Returns the user's cart items with product details.
 */
router.get('/', (req, res) => {
  try {
    const rows = getAll(
      `SELECT ci.*, p.name, p.slug, p.price, p.original_price, p.images
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );

    const items = rows.map(row => ({
      id: row.id,
      itemKey: `${row.product_id}-${row.selected_color || ''}-${row.selected_size || ''}`,
      productId: row.product_id,
      name: row.name,
      slug: row.slug,
      price: row.price,
      originalPrice: row.original_price,
      image: safeJsonParse(row.images, [])[0] || '',
      selectedColor: row.selected_color || '',
      selectedSize: row.selected_size || '',
      quantity: row.quantity,
    }));

    res.json({ items });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

/**
 * POST /api/cart
 * Body: { productId, quantity, selectedColor, selectedSize }
 */
router.post('/', (req, res) => {
  try {
    const { productId, quantity = 1, selectedColor = '', selectedSize = '' } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check product exists
    const product = getOne('SELECT id FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart (same product + color + size)
    const existing = getOne(
      `SELECT id, quantity FROM cart_items
       WHERE user_id = ? AND product_id = ? AND selected_color = ? AND selected_size = ?`,
      [req.user.id, productId, selectedColor, selectedSize]
    );

    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, 10);
      runQuery('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing.id]);
    } else {
      runQuery(
        `INSERT INTO cart_items (user_id, product_id, quantity, selected_color, selected_size)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, productId, Math.min(quantity, 10), selectedColor, selectedSize]
      );
    }

    // Return updated cart
    return getCartResponse(req, res);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

/**
 * PUT /api/cart/:id
 * Body: { quantity }
 */
router.put('/:id', (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItemId = parseInt(req.params.id);

    const item = getOne(
      'SELECT id FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, req.user.id]
    );
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity < 1) {
      runQuery('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
    } else {
      runQuery('UPDATE cart_items SET quantity = ? WHERE id = ?', [Math.min(quantity, 10), cartItemId]);
    }

    return getCartResponse(req, res);
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

/**
 * DELETE /api/cart/:id
 */
router.delete('/:id', (req, res) => {
  try {
    const cartItemId = parseInt(req.params.id);
    const item = getOne(
      'SELECT id FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, req.user.id]
    );
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    runQuery('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
    return getCartResponse(req, res);
  } catch (err) {
    console.error('Delete cart item error:', err);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

/**
 * POST /api/cart/merge
 * Body: { items: [{ productId, quantity, selectedColor, selectedSize }] }
 * Merges guest cart items into the authenticated user's server cart.
 */
router.post('/merge', (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    for (const item of items) {
      const existing = getOne(
        `SELECT id, quantity FROM cart_items
         WHERE user_id = ? AND product_id = ? AND selected_color = ? AND selected_size = ?`,
        [req.user.id, item.productId, item.selectedColor || '', item.selectedSize || '']
      );

      if (existing) {
        const newQty = Math.min(existing.quantity + item.quantity, 10);
        runQuery('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing.id]);
      } else {
        // Verify product exists
        const product = getOne('SELECT id FROM products WHERE id = ?', [item.productId]);
        if (product) {
          runQuery(
            `INSERT INTO cart_items (user_id, product_id, quantity, selected_color, selected_size)
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, item.productId, Math.min(item.quantity, 10), item.selectedColor || '', item.selectedSize || '']
          );
        }
      }
    }

    return getCartResponse(req, res);
  } catch (err) {
    console.error('Merge cart error:', err);
    res.status(500).json({ error: 'Failed to merge cart' });
  }
});

/**
 * Helper: Return the user's full cart.
 */
function getCartResponse(req, res) {
  const rows = getAll(
    `SELECT ci.*, p.name, p.slug, p.price, p.original_price, p.images
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?
     ORDER BY ci.created_at DESC`,
    [req.user.id]
  );

  const items = rows.map(row => ({
    id: row.id,
    itemKey: `${row.product_id}-${row.selected_color || ''}-${row.selected_size || ''}`,
    productId: row.product_id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    originalPrice: row.original_price,
    image: safeJsonParse(row.images, [])[0] || '',
    selectedColor: row.selected_color || '',
    selectedSize: row.selected_size || '',
    quantity: row.quantity,
  }));

  return res.json({ items });
}

export default router;
