const db = require('../config/db');

async function getStats(req, res) {
  try {
    const [[{ totalProducts }]] = await db.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[{ totalCustomers }]] = await db.query(
      "SELECT COUNT(*) AS totalCustomers FROM users WHERE role = 'customer'"
    );
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ revenue }]] = await db.query(
      "SELECT COALESCE(SUM(total), 0) AS revenue FROM orders WHERE status != 'cancelled'"
    );

    res.json({ totalProducts, totalCustomers, totalOrders, revenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getCustomers(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getAllOrders(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT o.id, o.total, o.status, o.created_at,
              u.name AS customer_name, u.email AS customer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const ALLOWED_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [
      status,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { getStats, getCustomers, getAllOrders, updateOrderStatus };
