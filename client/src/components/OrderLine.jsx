import React, { useState, useEffect } from "react";
import styles from "../styles";
import orderLineStyles from "./OrderLine.module.css";

const OrderLine = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://resta-project-2.onrender.com/api/orders"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      // Sort orders by orderTime (oldest first)
      data.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));

      // Check for orders that have already reached their time limit
      const updatedOrders = data.map((order) => {
        if (order.status === "Pending") {
          const remainingTime = getRemainingTime(order);
          const ongoingTime = getOngoingTime(order);
          const totalPrepTime = getTotalPreparationTime(order);

          if (
            remainingTime === 0 ||
            (ongoingTime && ongoingTime.totalSeconds >= totalPrepTime * 60)
          ) {
            // Update the status in the backend
            updateOrderStatus(order._id, "Served");
            // Update the status locally
            return { ...order, status: "Served" };
          }
        }
        return order;
      });

      setOrders(updatedOrders);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `https://resta-project-2.onrender.com/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Calculate total preparation time for an order
  const getTotalPreparationTime = (order) => {
    if (!order.items || order.items.length === 0) return 0;

    // Get the maximum preparation time from all items
    const maxTime = Math.max(
      ...order.items.map((item) => {
        // Convert time string (e.g., "15 min") to minutes
        const timeStr = item.time || "0 min";
        const minutes = parseInt(timeStr);
        return isNaN(minutes) ? 0 : minutes;
      })
    );

    return maxTime;
  };

  // Calculate remaining time for an order
  const getRemainingTime = (order) => {
    if (!order.orderTime) return null;

    const startTime = new Date(order.orderTime);
    const preparationTime = getTotalPreparationTime(order);
    const endTime = new Date(startTime.getTime() + preparationTime * 60000); // Convert minutes to milliseconds
    const now = new Date();

    if (now >= endTime) return 0;
    return Math.ceil((endTime - now) / 1000); // Return seconds remaining
  };

  // Calculate ongoing time for an order
  const getOngoingTime = (order) => {
    if (!order.orderTime) return null;

    const startTime = new Date(order.orderTime);
    const now = new Date();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return {
      display: `${minutes}:${seconds.toString().padStart(2, "0")}`,
      totalSeconds: elapsedSeconds,
    };
  };

  // Check and update order statuses based on preparation time
  useEffect(() => {
    const checkPreparationTimes = () => {
      orders.forEach((order) => {
        if (order.status === "Pending" || order.status === "Preparing") {
          // If remaining time is 0, the order is ready for pickup/serving.
          // We don't update status automatically here, just let the timer run out.
          // Visual indication will be handled in the rendering logic.
        }
      });
    };

    const interval = setInterval(checkPreparationTimes, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={orderLineStyles.loadingContainer}>
        <div className={orderLineStyles.loadingText}>Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={orderLineStyles.errorContainer}>
        <div className={orderLineStyles.errorText}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={orderLineStyles.orderLineContainer}>
      <div className={orderLineStyles.mainContentArea}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: 30 }}>Order Line</h2>
        <div className={orderLineStyles.ordersGrid}>
          {orders.map((order, index) => {
            // Determine visual status based on actual status and remaining time
            const visualStatus =
              (order.status === "Pending" || order.status === "Preparing") &&
              getRemainingTime(order) <= 0 // Use <= 0 to be safe with potential small negative results
                ? order.orderType === "Dine In"
                  ? "Served"
                  : "Completed" // Visually treat as Served/Completed if timer is done but status is Pending/Preparing
                : order.status; // Otherwise, use the actual status

            const remainingTime = getRemainingTime(order);
            const minutes = remainingTime ? Math.floor(remainingTime / 60) : 0;
            const seconds = remainingTime ? remainingTime % 60 : 0;

            return (
              <div
                key={order._id}
                className={`${orderLineStyles.orderCard} ${
                  order.orderType === "Dine In"
                    ? order.status === "Pending"
                      ? orderLineStyles.dineInPending
                      : orderLineStyles.dineInServed
                    : order.status === "Completed"
                    ? orderLineStyles.takeAwayCompleted
                    : orderLineStyles.takeAwayNotPicked
                }`}
              >
                {/* Header */}
                <div className={orderLineStyles.orderCardHeader}>
                  <div className={orderLineStyles.orderCardHeaderContent}>
                    <div className={orderLineStyles.orderCardHeaderIcon}>
                      🍽️
                    </div>
                    <span className={orderLineStyles.orderCardHeaderText}>
                      # {orders.length - index}
                    </span>
                  </div>
                  <div className={orderLineStyles.orderCardStatus}>
                    {order.orderType === "Dine In" &&
                      order.status === "Pending" && (
                        <>
                          <div>Dine In</div>
                          <div className={orderLineStyles.orderCardTime}>
                            Ongoing:{minutes}:
                            {seconds.toString().padStart(2, "0")}
                          </div>
                        </>
                      )}
                    {order.orderType === "Dine In" &&
                      (order.status === "Served" ||
                        order.status === "Completed") && (
                        <>
                          <div>Done</div>
                          <div className={orderLineStyles.orderCardTime}>
                            Served
                          </div>
                        </>
                      )}
                    {order.orderType === "Take Away" &&
                      order.status !== "Completed" && (
                        <>
                          <div>Take Away</div>
                          <div className={orderLineStyles.orderCardTime}>
                            Not Picked up
                          </div>
                        </>
                      )}
                    {order.orderType === "Take Away" &&
                      order.status === "Completed" && (
                        <>
                          <div>Take Away</div>
                          <div className={orderLineStyles.orderCardTime}>
                            Picked up
                          </div>
                        </>
                      )}
                  </div>
                </div>

                {/* Info */}
                <div className={orderLineStyles.orderCardInfo}>
                  <div className={orderLineStyles.orderCardInfoTitle}>
                    {order.orderType === "Dine In"
                      ? `Table-${order.tableNumber}`
                      : "Take Away"}
                    <span className={orderLineStyles.orderCardInfoSubtitle}>
                      {new Date(order.orderTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={orderLineStyles.orderCardInfoText}>
                    {order.items.reduce((total, item) => total + item.qty, 0)}{" "}
                    Items
                  </div>
                </div>

                {/* Items */}
                <div className={orderLineStyles.orderCardItems}>
                  {order.items.map((item) => (
                    <div key={item._id}>
                      {item.qty}x {item.name}
                      {item.notes && (
                        <div className={orderLineStyles.orderCardItemNote}>
                          Note: {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                  {order.cookingInstructions && (
                    <div className={orderLineStyles.orderCardItemInstructions}>
                      Instructions: {order.cookingInstructions}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className={orderLineStyles.orderCardFooter} />
                <div className={orderLineStyles.orderCardFooterContent}>
                  {/* Processing Button (Pending Visual Status - Only for Dine In) */}
                  {visualStatus === "Pending" &&
                    order.orderType === "Dine In" && (
                      <div className={orderLineStyles.orderCardButton}>
                        Processing ⏳
                      </div>
                    )}

                  {/* Order Done Button (Appears for all other states) */}
                  {!(
                    visualStatus === "Pending" && order.orderType === "Dine In"
                  ) && (
                    <div className={orderLineStyles.orderCardButton}>
                      Order Done {order.orderType === "Take Away" ? "✅" : "✅"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderLine;
