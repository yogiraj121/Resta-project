import React, { useState, useEffect } from "react";
import styles from "../styles";

const ChefTable = () => {
  const [chefStats, setChefStats] = useState([]);

  useEffect(() => {
    fetchChefStats();
  }, []);

  const fetchChefStats = async () => {
    try {
      const response = await fetch(
        "https://resta-project-2.onrender.com/api/orders/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orders = await response.json();

      // Count orders per chef
      const chefOrderCounts = orders.reduce((acc, order) => {
        const chef = order.assignedChef;
        if (chef) {
          acc[chef] = (acc[chef] || 0) + 1;
        }
        return acc;
      }, {});

      // Convert to array and sort by order count
      const stats = Object.entries(chefOrderCounts)
        .map(([name, orders]) => ({ name, orders: orders.toString() }))
        .sort((a, b) => parseInt(b.orders) - parseInt(a.orders));

      setChefStats(stats);
    } catch (error) {
      console.error("Error fetching chef stats:", error);
    }
  };

  return (
    <div style={styles.chefTable}>
      <div style={styles.tableHeader}>
        <div style={styles.headerCell}>Chef Name</div>
        <div style={styles.headerCell}>Orders Taken</div>
      </div>
      {chefStats.map((chef, i) => (
        <div style={styles.tableRow} key={i}>
          <div style={styles.tableCell}>{chef.name}</div>
          <div style={styles.tableCell}>{chef.orders}</div>
        </div>
      ))}
    </div>
  );
};

export default ChefTable;
