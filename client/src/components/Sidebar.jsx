import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles";

const Sidebar = () => (
  <div style={styles.sidebar}>
    <div style={styles.profileCircle}></div>
    <div style={styles.sidebarIcons}>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          ...styles.iconBox,
          ...(isActive ? styles.activeIcon : {}),
        })}
        end
      >
        <i className="icon-grid">□</i>
      </NavLink>
      <NavLink
        to="/tables"
        style={({ isActive }) => ({
          ...styles.iconBox,
          ...(isActive ? styles.activeIcon : {}),
        })}
      >
        <i className="icon-chef">🪑</i>
      </NavLink>
      <NavLink
        to="/orders"
        style={({ isActive }) => ({
          ...styles.iconBox,
          ...(isActive ? styles.activeIcon : {}),
        })}
      >
        <i className="icon-list">☰</i>
      </NavLink>
      <div style={styles.iconBox}>
        <i className="icon-chart">📊</i>
      </div>
    </div>
    <div style={styles.bottomCircle}></div>
  </div>
);

export default Sidebar;
