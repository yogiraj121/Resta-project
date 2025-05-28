import React from "react";
import { Navigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

const ProtectedRoute = ({ children }) => {
  const { selectedItems } = useOrder();

  if (selectedItems.length === 0) {
    // Redirect to menu if no items are selected
    return <Navigate to="/m" replace />;
  }

  return children;
};

export default ProtectedRoute;
