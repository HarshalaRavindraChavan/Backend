const { DataTypes } = require('sequelize');
const db = require('../db/index');  // Adjust the path based on your directory structure

// Define the Product model
const Product = db.sequelize.define('Product', {
    shop_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
});

// Sync the model with the database (optional, usually done in app initialization)
// Product.sync(); // Uncomment this line if you want to create the table if it doesn't exist

// Export the Product model
module.exports = Product;
