const { DataTypes } = require('sequelize');
const db = require('../db/index');  // Adjust the path based on your directory structure

// Define the Shop_Inventory model
const Product_Option = db.sequelize.define('Product_Option', {
  name: {
      type: DataTypes.STRING,
      allowNull: false
  }
});

// Sync the model with the database (optional, usually done in app initialization)
// Shop_Inventory.sync(); // Uncomment this line if you want to create the table if it doesn't exist

// Export the Shop_Inventory model
module.exports = Product_Option;