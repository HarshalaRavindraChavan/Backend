const express = require('express');
const router = express.Router();
const shopController = require('./ShopController');
// const shopRoutes = require('../shop/ShopRoutes');
// Get all shops
router.get('/', shopController.getAllShops);

// Get shop by ID
router.get('/:id', shopController.getShopById);

// Create a new shop
router.post('/', shopController.createShop);

module.exports = router;
