import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { OrderProvider } from "./context/OrderContext.jsx";

// This component is likely where you render your App or main layout
// We will wrap the App with OrderProvider here
const Root = () => {
  return (
    <BrowserRouter>
      <OrderProvider>
        <App />
      </OrderProvider>
    </BrowserRouter>
  );
};

// Find the root DOM element and render the app
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
