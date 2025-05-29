import React, { useState, useEffect } from "react";

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState({
    labels: [],
    data: [],
    total: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueData(selectedPeriod);
    const interval = setInterval(() => fetchRevenueData(selectedPeriod), 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchRevenueData = async (period) => {
    try {
      console.log("Fetching revenue data for period:", period);
      const response = await fetch(
        `http://localhost:5000/api/orders/revenue?period=${period}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch revenue data");
      }

      const data = await response.json();
      console.log("Received revenue data:", data);

      if (!data.labels || !data.data) {
        throw new Error("Invalid data format received from server");
      }

      setRevenueData(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setError(error.message);
    }
  };

  // Generate SVG path for the line chart
  const generatePath = (data) => {
    if (!data || data.length === 0) return "";
    const maxRevenue = Math.max(...data, 1); // Avoid division by zero
    const points = data.map((revenue, index) => {
      const x = (index * 400) / (data.length > 1 ? data.length - 1 : 1); // Distribute points across the width
      const y = 200 - (revenue / maxRevenue) * 180; // Scale revenue to chart height
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectPeriod = (period) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
  };

  // Determine the index of the last data point for shading
  const lastDataIndex =
    revenueData.data.length > 0 ? revenueData.data.length - 1 : -1;

  return (
    <div style={{ background: "white", padding: 32, borderRadius: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Revenue</h3>
          {error && (
            <p style={{ color: "red", fontSize: "0.8em", margin: "5px 0 0 0" }}>
              {error}
            </p>
          )}
          {revenueData.total > 0 && (
            <p
              style={{ fontSize: "0.9em", color: "#666", margin: "5px 0 0 0" }}
            >
              Total: ₹{revenueData.total.toFixed(2)}
            </p>
          )}
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

      <div style={{ position: "relative", width: "100%", height: "200px" }}>
        {revenueData.data.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "#666",
            }}
          >
            No data available
          </div>
        ) : (
          <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%" }}>
            {/* Shaded area for the last data point */}
            {lastDataIndex !== -1 && selectedPeriod === "Daily" && (
              <rect
                x={
                  (lastDataIndex * 400) /
                    (revenueData.data.length > 1
                      ? revenueData.data.length - 1
                      : 1) -
                  400 /
                    (revenueData.data.length > 1
                      ? revenueData.data.length - 1
                      : 1) /
                    2
                }
                y="0"
                width={
                  400 /
                  (revenueData.data.length > 1
                    ? revenueData.data.length - 1
                    : 1)
                }
                height="200"
                fill="rgba(0,0,0,0.05)"
              />
            )}
            <path
              d={generatePath(revenueData.data)}
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            {/* Add bars for daily view */}
            {selectedPeriod === "Daily" &&
              revenueData.data.length > 0 &&
              revenueData.labels.length === 7 &&
              revenueData.data.map((revenue, index) => {
                const maxRevenue = Math.max(...revenueData.data, 1);
                const barWidth = 400 / 7; // Divide width by 7 days
                const x = index * barWidth + barWidth / 4; // Position bar with some spacing
                const barHeight = (revenue / maxRevenue) * 180; // Scale height
                const y = 200 - barHeight; // Position from bottom

                return (
                  <rect
                    key={index}
                    x={x}
                    y={y}
                    width={barWidth / 2} // Make bars half the width for spacing
                    height={barHeight}
                    fill="#666" // Color for the bars
                  />
                );
              })}
            {/* Add bars for weekly view */}
            {selectedPeriod === "Weekly" &&
              revenueData.data.length === 7 &&
              revenueData.data.map((revenue, index) => {
                const maxRevenue = Math.max(...revenueData.data, 1);
                const barWidth = 400 / 7; // Divide width by 7 weeks
                const x = index * barWidth + barWidth / 4; // Position bar with some spacing
                const barHeight = (revenue / maxRevenue) * 180; // Scale height
                const y = 200 - barHeight; // Position from bottom

                return (
                  <rect
                    key={index}
                    x={x}
                    y={y}
                    width={barWidth / 2} // Make bars half the width for spacing
                    height={barHeight}
                    fill="#999" // Color for the weekly bars
                  />
                );
              })}
            {/* Add bars for monthly view */}
            {selectedPeriod === "Monthly" &&
              revenueData.data.length === 7 &&
              revenueData.data.map((revenue, index) => {
                const maxRevenue = Math.max(...revenueData.data, 1);
                const barWidth = 400 / 7; // Divide width by 7 months
                const x = index * barWidth + barWidth / 4; // Position bar with some spacing
                const barHeight = (revenue / maxRevenue) * 180; // Scale height
                const y = 200 - barHeight; // Position from bottom

                return (
                  <rect
                    key={index}
                    x={x}
                    y={y}
                    width={barWidth / 2} // Make bars half the width for spacing
                    height={barHeight}
                    fill="#c5c5c5" // Color for the monthly bars
                  />
                );
              })}
          </svg>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "5px",
          }}
        >
          {revenueData.labels.map((label, i) => (
            <span key={i} style={{ fontSize: "0.8em" }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
