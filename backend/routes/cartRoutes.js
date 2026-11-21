const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getCart, addToCart, removeFromCart, checkout } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validate');

const addToCartValidators = [
  body('product_id').isInt({ min: 1 }).withMessage('product_id must be a positive integer'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be a positive integer')
];

const checkoutValidators = [
  body('shippingName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 150 }),
  body('shippingPhone').trim().notEmpty().withMessage('Phone number is required').isLength({ max: 30 }),
  body('shippingAddress').trim().notEmpty().withMessage('Address is required').isLength({ max: 255 }),
  body('shippingCity').trim().notEmpty().withMessage('City is required').isLength({ max: 100 }),
  body('shippingZip').trim().notEmpty().withMessage('ZIP/postal code is required').isLength({ max: 20 })
];

router.get('/', verifyToken, getCart);
router.post('/', verifyToken, addToCartValidators, handleValidationErrors, addToCart);
router.delete('/:id', verifyToken, removeFromCart);
router.post('/checkout', verifyToken, checkoutValidators, handleValidationErrors, checkout);

module.exports = router;
