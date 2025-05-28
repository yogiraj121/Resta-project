const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  process.env.MONGO
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Root route
app.get("/", (req, res) => {
  res.send("Restaurant POS API is running");
});

// Table API routes
app.use("/api/tables", require("./routes/tables"));
// Order API routes
app.use("/api/orders", require("./routes/orders"));
// Menu API routes
app.use("/api/menu", require("./routes/menu"));
// Chef API routes
app.use("/api/chefs", require("./routes/chefs"));

// TODO: Add API routes for tables, orders, menu, chefs

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
