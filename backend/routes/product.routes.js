const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller');

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

// Protected routes
router.post('/', authController.protect, authController.restrictTo('seller', 'admin', 'owner'), productController.createProduct);
router.patch('/:id', authController.protect, productController.updateProduct);
router.delete('/:id', authController.protect, productController.deleteProduct);

module.exports = router;
