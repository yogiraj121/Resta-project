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

  // Get the count of orders for today
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const count = await Order.countDocuments({
    orderTime: { $gte: today },
  });

  // Generate order number in format: YYMMDD-XXXX
  const sequence = (count + 1).toString().padStart(4, "0");
  return `${year}${month}${day}-${sequence}`;
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

    // User details might be optional or handled differently depending on Take Away vs Dine In
    // Keeping the check for now, but consider if user details are strictly required for Take Away
    if (
      !orderData.userDetails ||
      !orderData.userDetails.name ||
      !orderData.userDetails.phone
    ) {
      // Relaxing this validation for now based on user feedback, assuming it's not strictly required for all order types
      // return res.status(400).json({ message: "User details must include name and phone" });
    }

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
    let numberOfGuestsForOrder = orderData.numberOfGuests; // Use provided guest count if available

    // For Dine In orders, handle table assignment and guests
    if (orderData.orderType === "Dine In") {
      numberOfGuestsForOrder = numberOfGuestsForOrder || 1; // Default guests to 1 if not provided

      // If table number is not provided, find an available table
      if (!orderData.tableNumber) {
        const availableTable = await Table.findOne({
          status: "available",
          chairs: { $gte: numberOfGuestsForOrder }, // Table must have enough chairs
        }).sort({ number: 1 }); // Get the lowest numbered available table

        if (!availableTable) {
          return res.status(400).json({
            message: `No available tables for ${numberOfGuestsForOrder} guests`,
          });
        }

        tableNumberForOrder = availableTable.number;

        // Update the found table's occupied chairs and status
        availableTable.occupiedChairs += numberOfGuestsForOrder;
        if (availableTable.occupiedChairs >= availableTable.chairs) {
          availableTable.status = "reserved"; // Set to reserved when full
        } else {
          // Optionally set to 'occupied' or similar if needed when partially filled
          // For now, keep as 'available' until full based on schema
        }
        await availableTable.save();
      } else {
        // If table number is provided, validate and update the specified table
        const table = await Table.findOne({ number: orderData.tableNumber });
        if (!table) {
          return res.status(400).json({
            message: `Table ${orderData.tableNumber} not found`,
          });
        }

        // Check if table has enough available chairs
        const availableChairs = table.chairs - table.occupiedChairs;
        if (availableChairs < numberOfGuestsForOrder) {
          return res.status(400).json({
            message: `Table ${table.number} only has ${availableChairs} available chairs`,
          });
        }

        // Update table's occupied chairs and status
        table.occupiedChairs += numberOfGuestsForOrder;
        if (table.occupiedChairs >= table.chairs) {
          table.status = "reserved"; // Set to reserved when full
        } else {
          // Optionally set to 'occupied' or similar if needed when partially filled
          // For now, keep as 'available' until full based on schema
        }
        await table.save();

        tableNumberForOrder = orderData.tableNumber;
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
      status: "Pending", // Initial status
      // Use the determined table number and guests
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
