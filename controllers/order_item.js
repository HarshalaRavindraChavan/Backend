const Order_Item = require('../models/order_item'); // Adjust the path as necessary

const createOrderItems = async (req, res) => {
  const { order } = req.body;
  try {
      // Delete prev order items for an order creating new
      // let orderItems = Order_Item.delete({
      //   where: 
      // });

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