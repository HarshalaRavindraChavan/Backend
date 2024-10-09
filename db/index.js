const dbConfig = require('./config');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    port: dbConfig.DBPORT,
    logging: false,
});

// Test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully");
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });

// Initialize models
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
//db.Shop = require('../shop/ShopModel.js')(sequelize, DataTypes); RNZ_temp_comment
//db.Product = require('../Product/ProductModel.js')(sequelize, DataTypes);  // Ensure this is uncommented RNZ_temp_comment

// Define relationships
//db.Shop.hasMany(db.Product, { as: 'products' });    RNZ_temp_comment
//db.Product.belongsTo(db.Shop, { foreignKey: 'shopId', as: 'shop' }); RNZ_temp_comment

// Auto sync models without forcing
sequelize
    .sync()
    .then(() => {
        console.log("Yes, re-sync done!!");
    })
    .catch((err) => {
        console.log("Unable to sync the database:", err);
    });

module.exports = db;

// const { Sequelize, DataTypes } = require('sequelize');
// const dbConfig = require('./config');

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.DIALECT,
//     port: dbConfig.DBPORT,
//     logging: false,
// });

// const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// // Sync models and export
// sequelize.sync().then(() => {
//     console.log("Database synchronized.");
// }).catch((err) => {
//     console.error("Error syncing database:", err);
// });

// module.exports = db;
