const express = require('express');
const router = express.Router();
const { param, body } = require('express-validator');
const {
  getStats,
  getCustomers,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validate');

// Every route below requires a valid token AND a role of 'admin' re-checked in MySQL.
router.use(verifyToken, verifyAdmin);

router.get('/stats', getStats);
router.get('/customers', getCustomers);
router.get('/orders', getAllOrders);
router.put(
  '/orders/:id/status',
  [param('id').isInt(), body('status').isString().notEmpty()],
  handleValidationErrors,
  updateOrderStatus
);

module.exports = router;
