const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// Fast path: trusts the role claim already inside the JWT. Kept for backward
// compatibility but no longer used on sensitive admin routes (see verifyAdmin below).
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Server-side admin check: re-reads the user's CURRENT role from MySQL on every
// request instead of trusting the role claim baked into the token at login time.
// This means demoting an admin in the database takes effect immediately, even if
// that admin still has a valid, unexpired JWT.
async function verifyAdmin(req, res, next) {
  try {
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { verifyToken, requireAdmin, verifyAdmin };
