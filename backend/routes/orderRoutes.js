const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { getMyOrders, getMyOrderById } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validate');

router.get('/my', verifyToken, getMyOrders);
router.get('/:id', verifyToken, [param('id').isInt()], handleValidationErrors, getMyOrderById);

module.exports = router;
