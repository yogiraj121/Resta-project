import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles";

// Use the correct API URLs
const API_URL = "https://resta-project-2.onrender.com/api";
const TABLES_URL = `${API_URL}/tables`;
const ORDERS_URL = `${API_URL}/orders`;

const TablesManager = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newChairs, setNewChairs] = useState(3);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  // Fetch tables from API
  const fetchTables = async () => {
    try {
      const response = await axios.get(TABLES_URL);
      setTables(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching tables:", err);
      setError(err.response?.data?.error || "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  // Update table status and reset chairs
  const updateTableStatus = async (tableNumber) => {
    try {
      // Find the table by number
      const table = tables.find((t) => t.number === tableNumber);
      if (!table) {
        console.log(`Table ${tableNumber} not found in local state`);
        return;
      }

      // Update the table status using the table number
      const response = await axios.put(`${TABLES_URL}/number/${tableNumber}`, {
        status: "available",
        occupiedChairs: 0,
      });

      // Update local state immediately
      setTables((prevTables) =>
        prevTables.map((t) =>
          t.number === tableNumber
            ? { ...t, status: "available", occupiedChairs: 0 }
            : t
        )
      );

      console.log(`Table ${tableNumber} updated successfully`);
      return response.data;
    } catch (err) {
      console.error(`Error updating table ${tableNumber}:`, err);
      throw err;
    }
  };

  // Check for completed orders and update table status
  const checkCompletedOrders = async () => {
    try {
      // Get all orders
      const response = await axios.get(ORDERS_URL);
      const orders = response.data;

      // Filter for served or completed dine-in orders
      const completedOrders = orders.filter(
        (order) =>
          (order.status === "Served" || order.status === "Completed") &&
          order.orderType === "Dine In"
      );

      console.log(`Found ${completedOrders.length} completed orders`);

      // Update tables based on completed orders
      for (const order of completedOrders) {
        if (order.tableNumber) {
          try {
            await updateTableStatus(order.tableNumber);
          } catch (err) {
            console.error(`Error updating table ${order.tableNumber}:`, err);
            // Continue with next order even if one fails
            continue;
          }
        }
      }
    } catch (err) {
      console.error("Error checking completed orders:", err);
    }
  };

  // Initial fetch and setup polling
  useEffect(() => {
    fetchTables();

    // Set up polling for completed orders
    const interval = setInterval(() => {
      checkCompletedOrders();
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, []); // Remove tables dependency to prevent infinite loop

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;

    setActionLoading(true);
    setActionError("");
    try {
      await axios.delete(`${TABLES_URL}/${id}`);
      fetchTables();
    } catch (err) {
      setActionError(err.response?.data?.error || "Failed to delete table");
    }
    setActionLoading(false);
  };

  const handleAdd = () => {
    setShowAdd(true);
    setActionError("");
  };

  const handleCreate = async () => {
    setActionLoading(true);
    setActionError("");
    try {
      await axios.post(TABLES_URL, {
        name: "Table",
        chairs: newChairs,
        status: "available",
      });
      fetchTables();
      setShowAdd(false);
      setNewChairs(3);
    } catch (err) {
      setActionError(err.response?.data?.error || "Failed to add table");
    }
    setActionLoading(false);
  };

  // Filtered tables
  const filteredTables = tables.filter((t) => {
    const matchesSearch =
      !search ||
      t.number.toString().includes(search) ||
      (t.name && t.name.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div
      style={{
        ...styles.mainContent,
        background: "#f7faf8",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search by number or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            fontSize: 16,
            padding: "8px 16px",
            borderRadius: 8,
            border: "1.5px solid #d6dbd8",
          }}
        />
      </div>
      <h2 style={{ ...styles.sectionTitle, marginBottom: 30 }}>Tables</h2>

      {/* Action Error Message */}
      {actionError && (
        <div
          style={{
            color: "#d32f2f",
            background: "#ffebee",
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 16,
            border: "1px solid #ffcdd2",
          }}
        >
          {actionError}
        </div>
      )}

      {/* Search & Filter */}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          Loading tables...
        </div>
      ) : error ? (
        <div
          style={{
            color: "#d32f2f",
            background: "#ffebee",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #ffcdd2",
          }}
        >
          {error}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 24,
            background: "white",
            padding: 32,
            borderRadius: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {filteredTables.map((table) => (
            <div
              key={table._id}
              style={{
                background: table.status === "reserved" ? "#4CAF50" : "#f3f6f4",
                border: "1.5px solid #d6dbd8",
                borderRadius: 12,
                padding: 0,
                minHeight: 100,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                fontSize: 20,
                fontWeight: 500,
                color: table.status === "reserved" ? "white" : "#222",
              }}
            >
              {/* Show delete button only when table is empty (no occupied chairs) */}
              {table.occupiedChairs === 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    cursor: "pointer",
                    fontSize: 18,
                    color: table.status === "reserved" ? "white" : "#444",
                    opacity: 0.7,
                  }}
                  title="Delete"
                  onClick={() => handleDelete(table._id)}
                >
                  🗑️
                </span>
              )}
              <div
                style={{
                  padding: "18px 0 0 18px",
                  fontSize: 18,
                  color: table.status === "reserved" ? "white" : "#222",
                }}
              >
                {table.name || "Table"}
              </div>
              <div
                style={{
                  padding: "0 0 0 18px",
                  fontSize: 28,
                  fontWeight: 700,
                  color: table.status === "reserved" ? "white" : "#222",
                }}
              >
                {String(table.number).padStart(2, "0")}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 14,
                  fontSize: 14,
                  color: table.status === "reserved" ? "white" : "#444",
                  opacity: 0.7,
                }}
              >
                <span title="Chair count">
                  🪑 {String(table.occupiedChairs || 0).padStart(2, "0")}/
                  {String(table.chairs).padStart(2, "0")}
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 14,
                  fontSize: 13,
                  color:
                    table.status === "reserved"
                      ? "#fff"
                      : table.status === "reserved"
                      ? "#c00"
                      : "#388e3c",
                  fontWeight: 600,
                }}
              >
                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
              </div>
            </div>
          ))}

          {/* Add Table Card */}
          <div
            style={{
              border: "2px dashed #bfc7c2",
              borderRadius: 12,
              minHeight: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#bfc7c2",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={handleAdd}
          >
            +
          </div>
        </div>
      )}

      {/* Add Table Form */}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 40,
            transform: "translateX(-50%)",
            background: "white",
            borderRadius: 20,
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            padding: 32,
            minWidth: 260,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Removed table name input */}
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            Add New Table
          </div>
          <div style={{ fontSize: 15, color: "#888", margin: "10px 0 4px 0" }}>
            Chairs
          </div>
          <select
            value={newChairs}
            onChange={(e) => setNewChairs(Number(e.target.value))}
            style={{
              fontSize: 18,
              padding: "6px 18px",
              borderRadius: 8,
              border: "1.5px solid #d6dbd8",
              marginBottom: 18,
              outline: "none",
            }}
          >
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {String(n).padStart(2, "0")}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              onClick={() => setShowAdd(false)}
              style={{
                flex: 1,
                background: "#fff",
                color: "#444",
                border: "none",
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 2px 8px #0001",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={actionLoading}
              style={{
                flex: 1,
                background: "#444",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 2px 8px #0001",
                cursor: actionLoading ? "not-allowed" : "pointer",
                opacity: actionLoading ? 0.7 : 1,
              }}
            >
              {actionLoading ? "Adding..." : "Add Table"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesManager;
