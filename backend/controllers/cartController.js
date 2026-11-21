const db = require('../config/db');

async function getCart(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT c.id as cart_item_id, c.quantity, p.* FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function addToCart(req, res) {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id) {
      return res.status(400).json({ message: 'product_id is required' });
    }
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );
    if (existing.length > 0) {
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity || 1, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity || 1]
      );
    }
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function removeFromCart(req, res) {
  try {
    await db.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function checkout(req, res) {
  const conn = await db.getConnection();
  try {
    const { shippingName, shippingPhone, shippingAddress, shippingCity, shippingZip } = req.body;

    await conn.beginTransaction();

    // FOR UPDATE locks these product rows until commit/rollback, so two concurrent
    // checkouts can't both read the same stock number and both succeed.
    const [items] = await conn.query(
      `SELECT c.product_id, c.quantity, p.price, p.name, p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?
       FOR UPDATE`,
      [req.user.id]
    );

    if (items.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    for (const item of items) {
      if (item.quantity > item.stock) {
        await conn.rollback();
        return res.status(400).json({
          message: `Not enough stock for "${item.name}". Only ${item.stock} left.`
        });
      }
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [orderResult] = await conn.query(
      `INSERT INTO orders
         (user_id, total, status, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_zip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, total, 'pending', shippingName, shippingPhone, shippingAddress, shippingCity, shippingZip]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await conn.commit();
    res.status(201).json({ message: 'Order placed', orderId, total });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
}

module.exports = { getCart, addToCart, removeFromCart, checkout };
