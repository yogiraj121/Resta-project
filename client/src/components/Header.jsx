import React from "react";
import styles from "../styles";

const Header = () => (
  <div style={styles.header}>
    <div style={styles.searchBar}>
      <input type="text" placeholder="Filter..." style={styles.searchInput} />
      <button style={styles.dropdownButton}>▼</button>
    </div>
  </div>
);

export default Header;
