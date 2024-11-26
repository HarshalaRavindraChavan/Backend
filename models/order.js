const { DataTypes } = require('sequelize');
const db = require('../db/index');  // Adjust the path based on your directory structure

// Define the Order model
const Order = db.sequelize.define('Order', {
    user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    shop_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    order_status: {
      type: DataTypes.ENUM('NEW','PROCESSING','OUT-FOR-DELIVERY','DELIVERED'),
      defaultValue: 'NEW',
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETE'),
      defaultValue: 'PENDING',
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },    
});

// Sync the model with the database (optional, usually done in app initialization)
// Order.sync(); // Uncomment this line if you want to create the table if it doesn't exist

// Export the Order model
module.exports = Order;
