import { Router } from 'express';
import { getAll, getOne, runQuery } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All order routes require authentication
router.use(authenticate);

/**
 * POST /api/orders
 * Body: { items, shippingInfo, subtotal, discount, shipping, total, coupon }
 */
router.post('/', (req, res) => {
  try {
    const { items, shippingInfo, subtotal, discount, shipping, total, coupon } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.address || !shippingInfo.city) {
      return res.status(400).json({ error: 'Shipping information is required' });
    }

    // Generate order number
    const orderNumber = `LXC-${Date.now().toString(36).toUpperCase()}`;

    // Calculate tax (8% on subtotal - discount)
    const taxableAmount = Math.max(0, subtotal - (discount || 0));
    const tax = Math.round(taxableAmount * 0.08 * 100) / 100;

    const orderResult = runQuery(
      `INSERT INTO orders (user_id, order_number, subtotal, discount, shipping, tax, total, status,
        shipping_first_name, shipping_last_name, shipping_address, shipping_city,
        shipping_state, shipping_zip, shipping_country, payment_method, coupon_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, orderNumber,
        subtotal || 0, discount || 0, shipping || 0, tax, total || 0,
        'confirmed',
        shippingInfo.firstName, shippingInfo.lastName || '',
        shippingInfo.address, shippingInfo.city,
        shippingInfo.state || '', shippingInfo.zip || '',
        shippingInfo.country || 'US', 'card',
        coupon || null,
      ]
    );

    const orderId = orderResult.lastId;

    // Insert order items
    for (const item of items) {
      runQuery(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, selected_color, selected_size)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productId || null,
          item.name,
          item.image || '',
          item.quantity,
          item.price,
          item.selectedColor || '',
          item.selectedSize || '',
        ]
      );
    }

    // Clear user's server-side cart after successful order
    runQuery('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    // Fetch the complete order
    const order = getOne('SELECT * FROM orders WHERE id = ?', [orderId]);
    const orderItems = getAll('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    res.status(201).json({
      order: {
        id: order.order_number,
        orderNumber: order.order_number,
        date: order.created_at,
        status: order.status,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        coupon: order.coupon_code,
        estimatedDelivery,
        shippingInfo: {
          firstName: order.shipping_first_name,
          lastName: order.shipping_last_name,
          address: order.shipping_address,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip,
          country: order.shipping_country,
        },
        items: orderItems.map(i => ({
          id: i.id,
          productId: i.product_id,
          name: i.product_name,
          image: i.product_image,
          quantity: i.quantity,
          price: i.price,
          selectedColor: i.selected_color,
          selectedSize: i.selected_size,
          itemKey: `${i.product_id}-${i.selected_color}-${i.selected_size}`,
          slug: '', // Will be resolved client-side if needed
        })),
      },
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * GET /api/orders
 * Returns the authenticated user's orders.
 */
router.get('/', (req, res) => {
  try {
    const orders = getAll(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const result = orders.map(order => {
      const items = getAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      const estimatedDelivery = new Date(
        new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000
      ).toISOString();

      return {
        id: order.order_number,
        orderNumber: order.order_number,
        date: order.created_at,
        status: order.status,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        coupon: order.coupon_code,
        estimatedDelivery,
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
    console.error('List orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:orderNumber
 * Returns a single order by order number (must belong to the user or user is admin).
 */
router.get('/:orderNumber', (req, res) => {
  try {
    const order = getOne('SELECT * FROM orders WHERE order_number = ?', [req.params.orderNumber]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only the owner or an admin can view
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const items = getAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    const estimatedDelivery = new Date(
      new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000
    ).toISOString();

    res.json({
      order: {
        id: order.order_number,
        orderNumber: order.order_number,
        date: order.created_at,
        status: order.status,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        coupon: order.coupon_code,
        estimatedDelivery,
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
      },
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
