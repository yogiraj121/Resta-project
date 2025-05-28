const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// Get all menu items (with optional category filter)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) query.category = category;
    const items = await MenuItem.find(query).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get menu item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create menu item
router.post("/", async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update menu item
router.put("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete menu item
router.delete("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
