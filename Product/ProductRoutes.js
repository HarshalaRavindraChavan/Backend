const express = require('express');
const router = express.Router();
const productController = require('./ProductController');

// Get all products
router.get('/', productController.getAllProducts);

// Get products by shop ID
router.get('/shop/:shopId', productController.getProductsByShopId);

// Create a new product
router.post('/', productController.createProduct);

module.exports = router;
