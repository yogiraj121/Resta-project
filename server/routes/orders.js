const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController"); // Path relative to server/routes

// GET /api/orders - Get all orders
router.get("/", getOrders);

// POST /api/orders - Create a new order
router.post("/", createOrder); // Route is just '/' because it's mounted at /api/orders

// PATCH /api/orders/:id - Update order status
router.patch("/:id", updateOrderStatus);

module.exports = router;
