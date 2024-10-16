const Shop = require('../models/shop'); // Ensure correct import
const db = require('../db/index'); // Adjust path as necessary
;
// Get all shops
exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.findAll();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch shops" });
    }
};

// Get shop by ID
exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.findByPk(req.params.id);
        if (shop) {
            res.status(200).json(shop);
        } else {
            res.status(404).json({ error: "Shop not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch shop" });
    }
};

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        // Validate request body
        const { name, address, rating, img } = req.body;
        if (!name || !address || !rating) {
            return res.status(400).json({ error: 'Name, address, and rating are required' });
        }

        // Create a new shop
        const newShop = await Shop.create({
            name,
            address,
            rating,
            img: img || null, // Use img only if provided
        });

        res.status(201).json(newShop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create shop', details: error.message });
    }
};