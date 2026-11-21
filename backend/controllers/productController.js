const db = require('../config/db');

const SORT_MAP = {
  price_asc: 'price ASC',
  price_desc: 'price DESC',
  newest: 'created_at DESC',
  name_asc: 'name ASC'
};

// Supports optional ?search=&category=&minPrice=&maxPrice=&sort= query params.
// All values are still bound as parameters (never string-concatenated into SQL),
// so this stays safe from SQL injection even with user-supplied search text.
async function getAllProducts(req, res) {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (minPrice) {
      conditions.push('price >= ?');
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      conditions.push('price <= ?');
      params.push(Number(maxPrice));
    }

    let sql = 'SELECT * FROM products';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY ' + (SORT_MAP[sort] || 'created_at DESC');

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Distinct category list, used to populate the category filter / homepage tiles.
async function getCategories(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category <> '' ORDER BY category ASC"
    );
    res.json(rows.map((r) => r.category));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getProductById(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, price, category, image_url, stock } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || '', price, category || '', image_url || '', stock || 0]
    );
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { name, description, price, category, image_url, stock } = req.body;
    const [result] = await db.query(
      'UPDATE products SET name=?, description=?, price=?, category=?, image_url=?, stock=? WHERE id=?',
      [name, description || '', price, category || '', image_url || '', stock || 0, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  getAllProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
