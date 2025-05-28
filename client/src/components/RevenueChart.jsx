import React, { useState, useEffect } from "react";

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState({
    labels: [],
    data: [],
    total: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchRevenueData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchRevenueData = async (period) => {
    try {
      // TODO: Implement backend logic to filter and aggregate orders by period
      const response = await fetch("http://localhost:5000/api/orders/");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orders = await response.json();

      let aggregatedData = [];
      let labels = [];
      let totalRevenue = 0;

      const now = new Date();

      if (period === "Daily") {
        // Aggregate daily revenue for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i)); // Get last 7 days including today
          date.setHours(0, 0, 0, 0); // Set to start of the day
          return date;
        });

        const dailyRevenueMap = new Map(
          last7Days.map((date) => [date.getTime(), 0])
        );

        orders.forEach((order) => {
          const orderDate = new Date(order.orderTime);
          orderDate.setHours(0, 0, 0, 0);
          const dayTimestamp = orderDate.getTime();

          if (dailyRevenueMap.has(dayTimestamp)) {
            dailyRevenueMap.set(
              dayTimestamp,
              dailyRevenueMap.get(dayTimestamp) + order.grandTotal
            );
          }
        });

        labels = last7Days.map(
          (date) =>
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
        );
        aggregatedData = Array.from(dailyRevenueMap.values());
        totalRevenue = aggregatedData.reduce((sum, value) => sum + value, 0);
      } else if (period === "Weekly") {
        // Aggregate weekly revenue starting from Monday
        const startOfWeek = new Date(now);
        const dayOfWeek = now.getDay(); // 0 for Sunday, 6 for Saturday
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate difference to get to previous Monday
        startOfWeek.setDate(now.getDate() - diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const weeklyRevenueMap = new Map(
          Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return [date.getTime(), 0];
          })
        );

        orders.forEach((order) => {
          const orderDate = new Date(order.orderTime);
          if (orderDate >= startOfWeek && orderDate <= endOfWeek) {
            const dayTimestamp = new Date(
              orderDate.getFullYear(),
              orderDate.getMonth(),
              orderDate.getDate()
            ).getTime();
            if (weeklyRevenueMap.has(dayTimestamp)) {
              weeklyRevenueMap.set(
                dayTimestamp,
                weeklyRevenueMap.get(dayTimestamp) + order.grandTotal
              );
            }
          }
        });

        labels = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
            date.getDay() === 0 ? 6 : date.getDay() - 1
          ]; // Adjust for Monday start
        });
        aggregatedData = Array.from(weeklyRevenueMap.values());
        totalRevenue = aggregatedData.reduce((sum, value) => sum + value, 0);
      } else if (period === "Monthly") {
        // Aggregate revenue for the last 4 weeks
        const weeksToDisplay = 4;
        const weeklyData = Array(weeksToDisplay).fill(0);
        labels = Array.from(
          { length: weeksToDisplay },
          (_, i) => `Week ${i + 1}`
        );
        totalRevenue = 0;

        const endOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );

        orders.forEach((order) => {
          const orderDate = new Date(order.orderTime);
          if (orderDate <= endOfToday) {
            // Only consider orders up to the end of today
            const timeDiff = endOfToday.getTime() - orderDate.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            // Determine which week the order falls into (0-indexed from the most recent week)
            const weekIndex = Math.floor(daysDiff / 7);

            if (weekIndex < weeksToDisplay) {
              weeklyData[weeksToDisplay - 1 - weekIndex] += order.grandTotal; // Store in reverse order for labels
              totalRevenue += order.grandTotal;
            }
          }
        });

        aggregatedData = weeklyData;
      }

      setRevenueData({
        labels: labels,
        data: aggregatedData,
        total: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  // Generate SVG path for the line chart
  const generatePath = (data) => {
    if (data.length === 0) return "";
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
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fffff",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "1.2em" }}>Revenue</h3>
          {/* Removed subtitle, added total revenue display */}
          <p style={{ margin: "5px 0 0 0", fontSize: "0.9em", color: "#555" }}>
            Total Revenue: ₹{revenueData.total.toFixed(2)}
          </p>
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
                (revenueData.data.length > 1 ? revenueData.data.length - 1 : 1)
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
                  fill="#999" // Color for the weekly bars (can be adjusted)
                />
              );
            })}
          {/* Add bars for monthly view */}
          {selectedPeriod === "Monthly" &&
            revenueData.data.length === 4 &&
            revenueData.data.map((revenue, index) => {
              const maxRevenue = Math.max(...revenueData.data, 1);
              const barWidth = 400 / 4; // Divide width by 4 weeks
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
                  fill="#c5c5c5" // Color for the monthly bars (can be adjusted)
                />
              );
            })}
        </svg>
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
