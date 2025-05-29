import React, { useState, useEffect } from "react";
import styles from "../styles";

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalChefs: 4, // This is fixed since we have 4 chefs
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "https://resta-project-2.onrender.com/api/orders/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orders = await response.json();

      // Calculate statistics
      const uniqueClients = new Set();
      let totalRevenue = 0;

      orders.forEach((order) => {
        // Add to total revenue
        totalRevenue += order.grandTotal;

        // Add unique clients (using phone number as identifier)
        if (order.userDetails && order.userDetails.phone) {
          uniqueClients.add(order.userDetails.phone);
        }
      });

      setStats({
        totalChefs: 4, // Fixed number of chefs
        totalRevenue,
        totalOrders: orders.length,
        totalClients: uniqueClients.size, // Count of unique phone numbers
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Format revenue to K format if over 1000
  const formatRevenue = (amount) => {
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const statsData = [
    { icon: "👨‍🍳", value: stats.totalChefs.toString(), label: "TOTAL CHEF" },
    {
      icon: "₹",
      value: formatRevenue(stats.totalRevenue),
      label: "TOTAL REVENUE",
    },
    { icon: "📋", value: stats.totalOrders.toString(), label: "TOTAL ORDERS" },
    {
      icon: "👥",
      value: stats.totalClients.toString(),
      label: "TOTAL CLIENTS",
    },
  ];

  return (
    <div style={styles.statsCards}>
      {statsData.map((stat, i) => (
        <div style={styles.statCard} key={i}>
          <div style={styles.iconCircle}>{stat.icon}</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>{stat.value}</h3>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
