const Order = require("../models/Order");
const Table = require("../models/Table");

// Simple list of chefs (can be expanded later)
const chefs = ["Chef Gordon", "Chef Julia", "Chef Jamie", "Chef Bobby"];

// Function to get a random chef
const getRandomChef = () => {
  const randomIndex = Math.floor(Math.random() * chefs.length);
  return chefs[randomIndex];
};

// Function to generate order number
const generateOrderNumber = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const prefix = `${year}${month}${day}`;

  // Start a session for transaction
  const session = await Order.startSession();
  try {
    let orderNumber;
    await session.withTransaction(async () => {
      // Get the latest order number for today
      const latestOrder = await Order.findOne(
        { orderNumber: new RegExp(`^${prefix}`) },
        { orderNumber: 1 },
        { session }
      ).sort({ orderNumber: -1 });

      let sequence = 1;
      if (latestOrder) {
        // Extract the sequence number from the latest order
        const latestSequence = parseInt(latestOrder.orderNumber.split("-")[1]);
        sequence = latestSequence + 1;
      }

      // Generate new order number
      orderNumber = `${prefix}-${sequence.toString().padStart(4, "0")}`;
    });

    return orderNumber;
  } finally {
    await session.endSession();
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderTime: -1 }) // Sort by order time, newest first
      .limit(50); // Limit to 50 most recent orders

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Controller function to create a new order
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Log the incoming order data
    console.log("Incoming order data:", JSON.stringify(orderData, null, 2));

    // Validate required fields (items, orderType, userDetails, totals)
    if (
      !orderData.items ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    if (
      !orderData.orderType ||
      !["Dine In", "Take Away"].includes(orderData.orderType)
    ) {
      return res.status(400).json({
        message: "Invalid order type. Must be 'Dine In' or 'Take Away'",
      });
    }

    // Validate user details
    if (
      !orderData.userDetails ||
      !orderData.userDetails.name ||
      !orderData.userDetails.phone
    ) {
      return res
        .status(400)
        .json({ message: "User details must include name and phone" });
    }

    // Validate totals
    if (
      typeof orderData.itemTotal !== "number" ||
      typeof orderData.taxes !== "number" ||
      typeof orderData.grandTotal !== "number"
    ) {
      return res.status(400).json({
        message:
          "Invalid totals. itemTotal, taxes, and grandTotal must be numbers",
      });
    }

    let tableNumberForOrder = null;
    let numberOfGuestsForOrder = orderData.numberOfGuests || 1; // Default to 1 guest if not provided

    // For Dine In orders, handle table assignment
    if (orderData.orderType === "Dine In") {
      try {
        // First check if any tables exist
        const tableCount = await Table.countDocuments();
        if (tableCount === 0) {
          // Create a default table if none exist
          const defaultTable = new Table({
            number: 1,
            chairs: 4,
            occupiedChairs: 0,
            status: "available",
          });
          await defaultTable.save();
          tableNumberForOrder = 1;
        } else {
          // Find an available table
          const availableTable = await Table.findOne({
            status: "available",
            chairs: { $gte: numberOfGuestsForOrder },
          }).sort({ number: 1 });

          if (!availableTable) {
            return res.status(400).json({
              message: `No available tables for ${numberOfGuestsForOrder} guests`,
            });
          }

          tableNumberForOrder = availableTable.number;
          availableTable.occupiedChairs += numberOfGuestsForOrder;
          if (availableTable.occupiedChairs >= availableTable.chairs) {
            availableTable.status = "reserved";
          }
          await availableTable.save();
        }
      } catch (tableError) {
        console.error("Error handling table assignment:", tableError);
        return res.status(500).json({
          message: "Error assigning table",
          error: tableError.message,
        });
      }
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Assign a random chef
    const assignedChef = getRandomChef();

    // Create a new order instance
    const newOrder = new Order({
      ...orderData,
      orderNumber,
      assignedChef,
      status: "Pending",
      ...(orderData.orderType === "Dine In" && {
        tableNumber: tableNumberForOrder,
        numberOfGuests: numberOfGuestsForOrder,
      }),
    });

    // Save the order to the database
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !["Pending", "Preparing", "Served", "Completed", "Cancelled"].includes(
        status
      )
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the order using findByIdAndUpdate to only update the status
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true, runValidators: false }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the updated order
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
