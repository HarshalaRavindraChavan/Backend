const { DataTypes } = require('sequelize');
const db = require('../db/index');  // Adjust the path based on your directory structure

// Define the Shop model
const Shop = db.sequelize.define('Shop', {
    shopName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shopLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    shopImage: {
        type: DataTypes.STRING,  // Store the image URL or path
        allowNull: true,
    },
    
});

// Sync the model with the database (optional, usually done in app initialization)
// Shop.sync(); // Uncomment this line if you want to create the table if it doesn't exist

// Export the Shop model
module.exports = Shop;
