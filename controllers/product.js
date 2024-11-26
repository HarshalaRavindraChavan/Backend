const Product = require('../models/product'); // Adjust the path as necessary
const fs = require('fs');
const path = require('path'); 

const createProduct = async (req, res) => {
    const { name, description, image } = req.body;

    try {
        let image_url = null;
        if(typeof req.file !== "undefined") {
          image_url = req.file.filename;
        }

        const newProduct = await Product.create({
            name: name,
            description: description,
            image: image
        });
        
        res.status(201).json({
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};

  

// Controller function to get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll(); // Fetch all products
        res.status(200).json({
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({
            message: "Failed to retrieve products",
            error: error.message
        });
    }
};

// Controller function to get a product by ID
const getProductById = async (req, res) => {
    const { id } = req.params; // Get ID from request params
    try {
        const product = await Product.findByPk(id); // Fetch product by primary key
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).json({
            message: "Failed to retrieve product",
            error: error.message
        });
    }
};


// Controller function to update a product
const updateProduct = async (req, res) => {
    const { id } = req.params; // Get ID from request params
    console.log("id: " + id);
    console.log(req.body);

    try {
        // Update product where ID matches
        const [updated] = await Product.update(req.body, {
            where: { id: id }
        });

        if(typeof req.file !== "undefined") {
            const image_url = req.file.filename;
            // Remove saved product image
            const productToDelete = await Product.findByPk(id); // Retrieve the updated product
            console.log(productToDelete);
            if(productToDelete.image_url) {
                clearImage(productToDelete.image_url);
            }
            // Update product where ID matches
            const [updated] = await Product.update({image_url: image_url}, {
                where: { id: id }
            });
        }
        if (updated) {
            const updatedProduct = await Product.findByPk(id); // Retrieve the updated product
            return res.status(200).json({
                message: "Product updated successfully",
                data: updatedProduct
            });
        }

        // If no product was updated, send a 404 response
        res.status(404).json({
            message: "Product not found"
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};


// Controller function to delete a product (soft delete)
const deleteProduct = async (req, res) => {
    const { id } = req.params; // Get ID from request params
    try {
        // Remove saved product image
        const productToDelete = await Product.findByPk(id); // Retrieve the updated product
        if(productToDelete.image_url) {
            clearImage(productToDelete.image_url);
        }
        
        const deleted = await Product.destroy({
            where: { id: id }, // Soft delete product where ID matches
        });
        if (deleted) {
            return res.status(204).send("product deleted successfully"); // No content
        }
        res.status(404).json({
            message: "Product not found",
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message,
        });
    }
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "../uploads/product", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    getProductById,
    deleteProduct
  };