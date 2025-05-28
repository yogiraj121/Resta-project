import React, { useState, useEffect } from "react";
import styles from "../styles";

const OrderSummary = () => {
  const [stats, setStats] = useState({
    served: 0,
    dineIn: 0,
    takeAway: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchOrderStats(selectedPeriod);
  }, [selectedPeriod]);

  const fetchOrderStats = async (period) => {
    try {
      const response = await fetch(
        "https://resta-project-2.onrender.com/api/orders/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orders = await response.json();

      const now = new Date();
      let filteredOrders = orders;

      if (period === "Daily") {
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        filteredOrders = orders.filter(
          (order) => new Date(order.orderTime) >= startOfDay
        );
      } else if (period === "Weekly") {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        filteredOrders = orders.filter(
          (order) => new Date(order.orderTime) >= startOfWeek
        );
      } else if (period === "Monthly") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredOrders = orders.filter(
          (order) => new Date(order.orderTime) >= startOfMonth
        );
      }

      const orderSummary = filteredOrders.reduce(
        (acc, order) => {
          if (order.status === "Served" || order.status === "Completed") {
            acc.served++;
          }
          if (order.orderType === "Dine In") {
            acc.dineIn++;
          } else if (order.orderType === "Take Away") {
            acc.takeAway++;
          }
          return acc;
        },
        { served: 0, dineIn: 0, takeAway: 0 }
      );

      setStats(orderSummary);
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  const total = stats.served + stats.dineIn + stats.takeAway;
  const servedPercent = total ? Math.round((stats.served / total) * 100) : 0;
  const dineInPercent = total ? Math.round((stats.dineIn / total) * 100) : 0;
  const takeAwayPercent = total
    ? Math.round((stats.takeAway / total) * 100)
    : 0;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectPeriod = (period) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
  };

  return (
    <div style={styles.orderSummary}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>Order Summary</h3>
        </div>
        <div
          style={{
            padding: "8px 15px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            fontSize: "0.9em",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={toggleDropdown}
        >
          <span>{selectedPeriod}</span>
          <span style={{ marginLeft: "5px" }}>▼</span>
          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "35px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                zIndex: 1,
                minWidth: "100px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => selectPeriod("Daily")}
              >
                Daily
              </div>
              <div
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => selectPeriod("Weekly")}
              >
                Weekly
              </div>
              <div
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => selectPeriod("Monthly")}
              >
                Monthly
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.orderNumbers}>
        <div style={styles.orderNumber}>
          <h3 style={styles.orderValue}>{stats.served}</h3>
          <p style={styles.orderType}>Served</p>
        </div>
        <div style={styles.orderNumber}>
          <h3 style={styles.orderValue}>{stats.dineIn}</h3>
          <p style={styles.orderType}>Dine In</p>
        </div>
        <div style={styles.orderNumber}>
          <h3 style={styles.orderValue}>{stats.takeAway}</h3>
          <p style={styles.orderType}>Take Away</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Donut Chart */}
        <div
          style={{
            width: "100px",
            height: "100px",
            position: "relative",
            marginRight: "20px",
          }}
        >
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#eee"
              strokeWidth="8"
            />

            {/* Served segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="8"
              strokeDasharray={`${(servedPercent / 100) * 251} 251`}
              transform="rotate(-90 50 50)"
            />

            {/* Dine In segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#2196F3"
              strokeWidth="8"
              strokeDasharray={`${(dineInPercent / 100) * 251} 251`}
              transform={`rotate(${(servedPercent / 100) * 360 - 90} 50 50)`}
            />

            {/* Take Away segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#FFC107"
              strokeWidth="8"
              strokeDasharray={`${(takeAwayPercent / 100) * 251} 251`}
              transform={`rotate(${
                ((servedPercent + dineInPercent) / 100) * 360 - 90
              } 50 50)`}
            />
          </svg>
        </div>

        {/* Legend and Progress Bars */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: "100px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#4CAF50",
                  borderRadius: "3px",
                  marginRight: "8px",
                }}
              ></div>
              <span>Served</span>
            </div>
            <span style={{ minWidth: "50px" }}>({servedPercent}%)</span>
            <div
              style={{
                flex: 1,
                backgroundColor: "#eee",
                height: "8px",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  width: `${servedPercent}%`,
                  backgroundColor: "#4CAF50",
                  height: "100%",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: "100px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#2196F3",
                  borderRadius: "3px",
                  marginRight: "8px",
                }}
              ></div>
              <span>Dine In</span>
            </div>
            <span style={{ minWidth: "50px" }}>({dineInPercent}%)</span>
            <div
              style={{
                flex: 1,
                backgroundColor: "#eee",
                height: "8px",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  width: `${dineInPercent}%`,
                  backgroundColor: "#2196F3",
                  height: "100%",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: "100px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#FFC107",
                  borderRadius: "3px",
                  marginRight: "8px",
                }}
              ></div>
              <span>Take Away</span>
            </div>
            <span style={{ minWidth: "50px" }}>({takeAwayPercent}%)</span>
            <div
              style={{
                flex: 1,
                backgroundColor: "#eee",
                height: "8px",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  width: `${takeAwayPercent}%`,
                  backgroundColor: "#FFC107",
                  height: "100%",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
