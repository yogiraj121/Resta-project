const express = require("express");
const router = express.Router();
const Chef = require("../models/Chef");

// Get all chefs
router.get("/", async (req, res) => {
  try {
    const chefs = await Chef.find().sort({ name: 1 });
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get chef by ID
router.get("/:id", async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (!chef) return res.status(404).json({ error: "Chef not found" });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create chef
router.post("/", async (req, res) => {
  try {
    const chef = new Chef(req.body);
    await chef.save();
    res.status(201).json(chef);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update chef
router.put("/:id", async (req, res) => {
  try {
    const chef = await Chef.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!chef) return res.status(404).json({ error: "Chef not found" });
    res.json(chef);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete chef
router.delete("/:id", async (req, res) => {
  try {
    const chef = await Chef.findByIdAndDelete(req.params.id);
    if (!chef) return res.status(404).json({ error: "Chef not found" });
    res.json({ message: "Chef deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment ordersTaken for a chef
router.post("/:id/increment", async (req, res) => {
  try {
    const chef = await Chef.findByIdAndUpdate(
      req.params.id,
      { $inc: { ordersTaken: 1 } },
      { new: true }
    );
    if (!chef) return res.status(404).json({ error: "Chef not found" });
    res.json(chef);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
