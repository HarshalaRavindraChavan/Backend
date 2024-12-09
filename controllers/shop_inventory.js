const Product = require('../models/product');
const Shop = require('../models/shop');
const Product_Option = require('../models/product_option');
const Shop_Inventory = require('../models/shop_inventory'); // Adjust the path as necessary

const getShopProducts = async (req, res) => {
  const { shopID } = req.params; // Get shopID from request params
  try {
    const products = await Shop_Inventory.findAll({
      where: {shopID : shopID},
      attributes: ['id','price'],
      include: [
        {
          model: Shop,
          attributes: ['shopName'],
          required: true
        },
        {
          model: Product,
          attributes: ['id','name','description','image'],
          required: true
        },
        {
          model: Product_Option,
          attributes: ['name'],
          required: true
        } 
      ]
    }); // Fetch products by shop_id
    if (!products) {
      return res.status(404).json({
          message: "Products not found"
      }); 
    }
    res.status(200).json({
        message: "Products retrieved successfully",
        data: products
    });
  } catch(error) {
    console.error('Error retrieving products for Shop:', error);
    res.status(500).json({
        message: "Failed to retrieve products for Shop",
        error: error.message
    });
  }
}

module.exports = {
  getShopProducts
}