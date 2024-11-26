const Order = require('../models/order'); // Adjust the path as necessary

const createOrder = async (req, res) => {
  const { user_id, shop_id, notes } = req.body;

  try {
      // Remove once implemented
      let temp_user_id = 1; // This should be customer's id only
      const newOrder = await Order.create({
          user_id: temp_user_id,
          shop_id: shop_id,
          notes: notes
      });
      
      res.status(201).json({
          message: "Order created successfully",
          data: newOrder
      });
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
          message: "Failed to create order",
          error: error.message
      });
  }
};

// Controller function to get all orders
const getAllOrders = async (req, res) => {
  try {
      const orders = await Order.findAll(); // Fetch all orders
      res.status(200).json({
          message: "Shops retrieved successfully",
          data: orders
      });
  } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({
          message: "Failed to retrieve orders",
          error: error.message
      });
  }
};

// Controller function to get a order by ID
const getOrderById = async (req, res) => {
  const { id } = req.params; // Get ID from request params
  try {
      const order = await Order.findByPk(id); // Fetch order by primary key
      if (!order) {
          return res.status(404).json({
              message: "Order not found"
          });
      }
      res.status(200).json({
          message: "Order retrieved successfully",
          data: order
      });
  } catch (error) {
      console.error('Error retrieving order:', error);
      res.status(500).json({
          message: "Failed to retrieve order",
          error: error.message
      });
  }
};

// Controller function to update a order
const updateOrder = async (req, res) => {
  const { id } = req.params; // Get ID from request params

  try {
      // Update order where ID matches
      const [updated] = await Shop.update(req.body, {
          where: { id: id }
      });

      if (updated) {
          const updatedOrder = await Order.findByPk(id); // Retrieve the updated order
          return res.status(200).json({
              message: "Order updated successfully",
              data: updatedOrder
          });
      }

      // If no order was updated, send a 404 response
      res.status(404).json({
          message: "Order not found"
      });
  } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
          message: "Failed to update order",
          error: error.message
      });
  }
};

// Controller function to delete a order (soft delete)
const deleteOrder = async (req, res) => {
  const { id } = req.params; // Get ID from request params
  try {
      const deleted = await Order.destroy({
          where: { id: id }, // Soft delete order where ID matches
      });
      if (deleted) {
          return res.status(204).send("Order deleted successfully"); // No content
      }
      res.status(404).json({
          message: "Order not found",
      });
  } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({
          message: "Failed to delete order",
          error: error.message,
      });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};