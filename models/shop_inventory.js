const { DataTypes } = require('sequelize');
const db = require('../db/index');  // Adjust the path based on your directory structure
const Shop = require('./shop');
const Product = require('./product');
const Product_Option = require('./product_option');

// Define the Shop_Inventory model
const Shop_Inventory = db.sequelize.define('Shop_Inventory', {
  shopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Shop
      }
  },
  productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product
      }
  },
  productOptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product_Option
      }
  },
  price: {
      type: DataTypes.FLOAT,
      allowNull: false,
  }
});

Shop.hasMany(Shop_Inventory, {
    foreignKey: 'shopId'
});
Shop_Inventory.belongsTo(Shop);

Product.hasMany(Shop_Inventory, {
    foreignKey: 'productId'
});
Shop_Inventory.belongsTo(Product);

Product_Option.hasMany(Shop_Inventory, {
    foreignKey: 'productOptionId'
});
Shop_Inventory.belongsTo(Product_Option);

// Sync the model with the database (optional, usually done in app initialization)
// Shop_Inventory.sync(); // Uncomment this line if you want to create the table if it doesn't exist

// Export the Shop_Inventory model
module.exports = Shop_Inventory;