import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles";

const API_URL = "http://localhost:5000/api/tables";

const TablesCard = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(API_URL);
        setTables(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load tables");
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) return <div>Loading tables...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={styles.tablesCard}>
      <h3 style={styles.cardTitle}>Tables</h3>
      <div style={styles.tableLegend}>
        <div style={styles.legendItem}>
          <div style={styles.reservedIndicator}></div>
          <span>Reserved</span>
        </div>
        <div style={styles.legendItem}>
          <div style={styles.availableIndicator}></div>
          <span>Available</span>
        </div>
      </div>
      <div style={styles.tablesGrid}>
        {tables.map((table) => {
          const isReserved = table?.status === "reserved";
          return (
            <div
              key={table._id}
              style={{
                ...styles.tableBox,
                backgroundColor: isReserved ? "#4CAF50" : "white",
                color: isReserved ? "white" : "#333",
              }}
            >
              <div style={styles.tableTop}>Table</div>
              <div style={styles.tableNumber}>
                {table.number.toString().padStart(2, "0")}
              </div>
              {table?.chairs && (
                <div style={{ fontSize: "10px", marginTop: "2px" }}>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablesCard;
