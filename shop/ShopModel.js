// shop/ShopModel.js
// shop/ShopModel.js
const { DataTypes } = require('sequelize');

// Export a function that takes sequelize and DataTypes
module.exports = (sequelize) => {
    const Shop = sequelize.define('Shop', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true, // Optional image
        }
    });

    return Shop;
};

