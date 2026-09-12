import { Router } from 'express';
import { getAll, getOne, runQuery } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

/**
 * GET /api/wishlist
 * Returns list of product IDs in the user's wishlist.
 */
router.get('/', (req, res) => {
  try {
    const rows = getAll(
      'SELECT product_id FROM wishlist_items WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    const productIds = rows.map(r => r.product_id);
    res.json({ items: productIds });
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

/**
 * POST /api/wishlist
 * Body: { productId }
 */
router.post('/', (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check product exists
    const product = getOne('SELECT id FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already wishlisted
    const existing = getOne(
      'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (!existing) {
      runQuery(
        'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
        [req.user.id, productId]
      );
    }

    // Return updated wishlist
    const rows = getAll(
      'SELECT product_id FROM wishlist_items WHERE user_id = ?',
      [req.user.id]
    );
    res.json({ items: rows.map(r => r.product_id) });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

/**
 * DELETE /api/wishlist/:productId
 */
router.delete('/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    runQuery(
      'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    const rows = getAll(
      'SELECT product_id FROM wishlist_items WHERE user_id = ?',
      [req.user.id]
    );
    res.json({ items: rows.map(r => r.product_id) });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

export default router;
