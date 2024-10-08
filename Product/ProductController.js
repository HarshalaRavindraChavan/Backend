const db = require('../db');
const Product = db.product;

// Get all products
exports.getAllProducts = (req, res) => {
  Product.findAll()
    .then((products) => res.status(200).json(products))
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Get products by shop ID
exports.getProductsByShopId = (req, res) => {
  const shopId = req.params.shopId;
  Product.findAll({ where: { shopId } })
    .then((products) => res.status(200).json(products))
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Create a new product
exports.createProduct = (req, res) => {
  const { name, price, img, shopId } = req.body;
  Product.create({ name, price, img, shopId })
    .then((product) => res.status(201).json(product))
    .catch((err) => res.status(500).json({ message: err.message }));
};
