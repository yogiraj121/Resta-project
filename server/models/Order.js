const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  items: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
      time: { type: String }, // Assuming time is stored as a string like "15 min"
      img: { type: String }, // Assuming image URL is stored
    },
  ],
  orderType: {
    type: String,
    required: true,
    enum: ["Dine In", "Take Away"], // Restrict to these two values
  },
  tableNumber: {
    type: Number,
    required: function () {
      return this.orderType === "Dine In";
    },
  },
  numberOfGuests: {
    type: Number,
    required: function () {
      return this.orderType === "Dine In";
    },
  },
  userDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }, // Address is optional for Dine In
  },
  cookingInstructions: { type: String }, // Optional field
  itemTotal: { type: Number, required: true },
  deliveryCharge: { type: Number }, // Optional, only for Take Away
  taxes: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  assignedChef: { type: String, default: "Unassigned" }, // Default chef status
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Preparing", "Served", "Completed", "Cancelled"], // Added Served status
  },
  orderTime: { type: Date, default: Date.now }, // Timestamp for the order
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
