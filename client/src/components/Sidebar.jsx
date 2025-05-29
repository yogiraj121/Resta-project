import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles";
import dashboardLogo from "../../public/imges/Vector.png";
import tablesLogo from "../../public/imges/Vector (1).png";
import ordersLogo from "../../public/imges/Vector (2).png";
import menuLogo from "../../public/imges/Vector (3).png";

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
        <i className="icon-grid"><img src={dashboardLogo} alt="" /></i>
      </NavLink>
      <NavLink
        to="/tables"
        style={({ isActive }) => ({
          ...styles.iconBox,
          ...(isActive ? styles.activeIcon : {}),
        })}
      >
        <i className="icon-chef"><img src={tablesLogo} alt="" /></i>
      </NavLink>
      <NavLink
        to="/orders"
        style={({ isActive }) => ({
          ...styles.iconBox,
          ...(isActive ? styles.activeIcon : {}),
        })}
      >
        <i className="icon-list"><img src={ordersLogo} alt="" /></i>
      </NavLink>
      <NavLink
        to="/menu"
        style={({ isActive }) => ({
          ...styles.iconBox,
          ...(isActive ? styles.activeIcon : {}),
        })}
       >
        <i className="icon-chart"><img src={menuLogo} alt="" /></i>
      </NavLink>
    </div>
    <div style={styles.bottomCircle}></div>
  </div>
);

export default Sidebar;
