const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

// Get all tables (with optional search/filter)
router.get("/", async (req, res) => {
  try {
    const { number, status } = req.query;
    let query = {};
    if (number) query.number = Number(number);
    if (status) query.status = status;
    const tables = await Table.find(query).sort({ number: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get table by ID
router.get("/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create table
router.post("/", async (req, res) => {
  try {
    const { name, chairs } = req.body;

    // Find the highest current table number and assign the next sequential number
    const lastTable = await Table.findOne().sort({ number: -1 });
    const nextNumber = lastTable ? lastTable.number + 1 : 1;

    const table = new Table({
      number: nextNumber,
      name: name || "Table", // Default name to "Table"
      chairs,
      status: "available", // New tables are initially available
      occupiedChairs: 0, // Initialize occupied chairs to 0
    });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update table
router.put("/:id", async (req, res) => {
  try {
    const updateData = req.body;
    const table = await Table.findById(req.params.id);

    if (!table) return res.status(404).json({ error: "Table not found" });

    // Update table fields
    if (updateData.number !== undefined) table.number = updateData.number;
    if (updateData.name !== undefined) table.name = updateData.name;
    if (updateData.chairs !== undefined) table.chairs = updateData.chairs;
    if (updateData.status !== undefined) table.status = updateData.status; // Allow explicit status update
    if (updateData.occupiedChairs !== undefined) {
      table.occupiedChairs = updateData.occupiedChairs;

      // Automatically update status based on occupied chairs
      if (table.occupiedChairs >= table.chairs) {
        table.status = "reserved";
      } else if (table.occupiedChairs === 0) {
        table.status = "available";
      } else {
        // If some chairs are occupied but not full, keep current status or set to a different one if needed
        // For now, keep current status if not full and not empty
      }
    }

    await table.save();
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete table
router.delete("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ error: "Table not found" });

    // Renumber remaining tables sequentially
    const remainingTables = await Table.find().sort({ number: 1 });
    for (let i = 0; i < remainingTables.length; i++) {
      remainingTables[i].number = i + 1;
      await remainingTables[i].save();
    }

    res.json({ message: "Table deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
