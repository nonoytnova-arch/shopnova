const db = require('../config/db');

// Returns the logged-in customer's own orders only (never another user's).
async function getMyOrders(req, res) {
  try {
    const [orders] = await db.query(
      'SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Returns one order's details, including line items, but only if it belongs
// to the logged-in user — a customer can never fetch someone else's order by id.
async function getMyOrderById(req, res) {
  try {
    const [orders] = await db.query(
      `SELECT id, total, status, created_at,
              shipping_name, shipping_phone, shipping_address, shipping_city, shipping_zip
       FROM orders WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await db.query(
      `SELECT oi.product_id, oi.quantity, oi.price, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ ...orders[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { getMyOrders, getMyOrderById };
