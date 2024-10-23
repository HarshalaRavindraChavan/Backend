const Shop = require('./ShopModel'); // Adjust the path as necessary



const createShop = async (req, res) => {
    const { shopName, shopLocation, address, pincode, mobileNumber, emailAddress, shopImage } = req.body;

    try {
        const newShop = await Shop.create({
            shopName: shopName,
            shopLocation: shopLocation,
            address: address,
            pincode: pincode,
            mobileNumber: mobileNumber,
            emailAddress: emailAddress,
            shopImage: shopImage
        });

        res.status(201).json({
            message: "Shop created successfully",
            data: newShop
        });
    } catch (error) {
        console.error('Error creating shop:', error);
        res.status(500).json({
            message: "Failed to create shop",
            error: error.message
        });
    }
};

  

// Controller function to get all shops
const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.findAll(); // Fetch all shops
        res.status(200).json({
            message: "Shops retrieved successfully",
            data: shops
        });
    } catch (error) {
        console.error('Error retrieving shops:', error);
        res.status(500).json({
            message: "Failed to retrieve shops",
            error: error.message
        });
    }
};

// Controller function to get a shop by ID
const getShopById = async (req, res) => {
    const { id } = req.params; // Get ID from request params
    try {
        const shop = await Shop.findByPk(id); // Fetch shop by primary key
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found"
            });
        }
        res.status(200).json({
            message: "Shop retrieved successfully",
            data: shop
        });
    } catch (error) {
        console.error('Error retrieving shop:', error);
        res.status(500).json({
            message: "Failed to retrieve shop",
            error: error.message
        });
    }
};


// Controller function to update a shop
const updateShop = async (req, res) => {
    const { id } = req.params; // Get ID from request params

    try {
        // Update shop where ID matches
        const [updated] = await Shop.update(req.body, {
            where: { id: id }
        });

        if (updated) {
            const updatedShop = await Shop.findByPk(id); // Retrieve the updated shop
            return res.status(200).json({
                message: "Shop updated successfully",
                data: updatedShop
            });
        }

        // If no shop was updated, send a 404 response
        res.status(404).json({
            message: "Shop not found"
        });
    } catch (error) {
        console.error('Error updating shop:', error);
        res.status(500).json({
            message: "Failed to update shop",
            error: error.message
        });
    }
};


// Controller function to delete a shop (soft delete)
const deleteShop = async (req, res) => {
    const { id } = req.params; // Get ID from request params
    try {
        const deleted = await Shop.destroy({
            where: { id: id }, // Soft delete shop where ID matches
        });
        if (deleted) {
            return res.status(204).send("shop deleted successfully"); // No content
        }
        res.status(404).json({
            message: "Shop not found",
        });
    } catch (error) {
        console.error('Error deleting shop:', error);
        res.status(500).json({
            message: "Failed to delete shop",
            error: error.message,
        });
    }
};


module.exports = {
    createShop ,
    getAllShops,
    getShopById,
    updateShop,
    deleteShop
  };