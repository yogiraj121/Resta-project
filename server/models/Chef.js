const mongoose = require("mongoose");

const ChefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ordersTaken: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chef", ChefSchema);
