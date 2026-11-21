const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const {
  getAllProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validate');

const productValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 150 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').optional().isString().isLength({ max: 100 }),
  body('image_url').optional().isString().isLength({ max: 255 }),
  body('description').optional().isString()
];

const listValidators = [
  query('search').optional().isString().trim().isLength({ max: 150 }),
  query('category').optional().isString().trim().isLength({ max: 100 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'newest', 'name_asc'])
];

// NOTE: '/categories' must be declared before '/:id' or Express would never reach it
// (both are single path segments, and '/:id' would match "categories" as an id).
router.get('/categories', getCategories);
router.get('/', listValidators, handleValidationErrors, getAllProducts);
router.get('/:id', [param('id').isInt()], handleValidationErrors, getProductById);
router.post('/', verifyToken, verifyAdmin, productValidators, handleValidationErrors, createProduct);
router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  [param('id').isInt(), ...productValidators],
  handleValidationErrors,
  updateProduct
);
router.delete('/:id', verifyToken, verifyAdmin, [param('id').isInt()], handleValidationErrors, deleteProduct);

module.exports = router;
