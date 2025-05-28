import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TablesManager from "./components/TablesManager";
import OrderLine from "./components/OrderLine";
import styles from "./styles";
import MobileMenu from "./components/MobileMenu";
import MobileCheckout from "./components/MobileCheckout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import { OrderProvider } from "./context/OrderContext";

const MOBILE_BREAKPOINT = 768; // Define your mobile breakpoint

function AppRoutes() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  if (isMobile) {
    // Mobile layout and routes
    return (
      <Routes>
        <Route path="/" element={<MobileMenu />} />

        {/* Keep /m route for compatibility if needed */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MobileCheckout />
            </ProtectedRoute>
          }
        />
        {/* Add a fallback for unknown mobile routes if necessary */}
        <Route path="*" element={<MobileMenu />} />
      </Routes>
    );
  } else {
    // Desktop layout and routes
    return (
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tables" element={<TablesManager />} />
            <Route path="/orders" element={<OrderLine />} />
            {/* Redirect /m and /checkout on desktop if accessed directly */}
            <Route path="/m" element={<Dashboard />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Add a fallback for unknown desktop routes if necessary */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    );
  }
}

const App = () => {
  return (
    <OrderProvider>
      <AppRoutes />
    </OrderProvider>
  );
};

export default App;
