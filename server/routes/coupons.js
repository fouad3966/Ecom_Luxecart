import { Router } from 'express';
import { getOne } from '../db/connection.js';

const router = Router();

/**
 * POST /api/coupons/validate
 * Body: { code, subtotal }
 * Validates a coupon code and returns the discount details.
 */
router.post('/validate', (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const coupon = getOne(
      'SELECT * FROM coupons WHERE code = ? AND is_active = 1',
      [code.toUpperCase()]
    );

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(410).json({ error: 'This coupon has expired' });
    }

    // Check minimum order
    if (coupon.min_order > 0 && subtotal < coupon.min_order) {
      return res.status(400).json({
        error: `Minimum order of $${coupon.min_order.toFixed(2)} required for this coupon`,
      });
    }

    res.json({
      coupon: {
        code: coupon.code,
        type: coupon.discount_type,
        value: coupon.discount_value,
        minOrder: coupon.min_order,
        description: getCouponDescription(coupon),
      },
    });
  } catch (err) {
    console.error('Validate coupon error:', err);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

function getCouponDescription(coupon) {
  switch (coupon.discount_type) {
    case 'percentage':
      return `${coupon.discount_value}% off your order`;
    case 'fixed':
      return `$${coupon.discount_value} off your order`;
    case 'freeShipping':
      return 'Free shipping on your order';
    default:
      return 'Discount applied';
  }
}

export default router;
