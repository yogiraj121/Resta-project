const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  name: { type: String },
  chairs: { type: Number, default: 4 },
  occupiedChairs: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["reserved", "available", "unavailable"],
    default: "available",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Table", TableSchema);
