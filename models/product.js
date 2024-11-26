const { DataTypes } = require('sequelize');
const db = require('../db/index');  // Adjust the path based on your directory structure

// Define the Product model
const Product = db.sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// Sync the model with the database (optional, usually done in app initialization)
// Product.sync(); // Uncomment this line if you want to create the table if it doesn't exist

// Export the Product model
module.exports = Product;
