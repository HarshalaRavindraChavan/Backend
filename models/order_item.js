const { DataTypes } = require('sequelize');
const db = require('../db/index');  // Adjust the path based on your directory structure

// Define the Order_Item model
const Order_Item = db.sequelize.define('Order_Item', {
    order_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    shop_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    order_status: {
      type: DataTypes.ENUM('NEW','PROCESSING','OUT-FOR-DELIVERY','DELIVERED'),
      defaultValue: 'NEW',
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    measurement_unit: {
      type: DataTypes.TEXT,
      allowNull: true,
    },   
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },    
});

// Sync the model with the database (optional, usually done in app initialization)
// Order_Item.sync(); // Uncomment this line if you want to create the table if it doesn't exist

// Export the Order_Item model
module.exports = Order_Item;
