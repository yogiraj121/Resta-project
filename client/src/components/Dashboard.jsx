import React, { useState } from "react";
import StatsCards from "./StatsCards";
import OrderSummary from "./OrderSummary";
import RevenueChart from "./RevenueChart";
import TablesCard from "./TablesCard";
import ChefTable from "./ChefTable";
import "./Dashboard.css";

const Dashboard = () => {
  const [filterText, setFilterText] = useState("");

  return (
    <>
      <div className="dashboard-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Revenue, Orders, Tables..."
            className={`search-input ${filterText ? "active" : ""}`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filterText && (
            <button onClick={() => setFilterText("")} className="clear-button">
              ✕
            </button>
          )}
        </div>
      </div>

      <h2 className="section-title">Analytics</h2>
      <StatsCards />
      <div className="charts-row">
        {(filterText === "" ||
          "order".toLowerCase().includes(filterText.toLowerCase()) ||
          "summary".toLowerCase().includes(filterText.toLowerCase())) && (
          <OrderSummary />
        )}
        {(filterText === "" ||
          "revenue".toLowerCase().includes(filterText.toLowerCase()) ||
          "chart".toLowerCase().includes(filterText.toLowerCase())) && (
          <RevenueChart />
        )}
        {(filterText === "" ||
          "tables".toLowerCase().includes(filterText.toLowerCase()) ||
          "table".toLowerCase().includes(filterText.toLowerCase())) && (
          <TablesCard />
        )}
      </div>
      {(filterText === "" ||
        "chef".toLowerCase().includes(filterText.toLowerCase())) && (
        <ChefTable />
      )}
    </>
  );
};

export default Dashboard;
