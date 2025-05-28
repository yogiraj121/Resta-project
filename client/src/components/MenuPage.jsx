import React from "react";
import styles from "../styles";

const MenuPage = () => {
  return (
    <div style={styles.mainContent}>
      {/* Header: Good evening and search */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
            Good evening
          </h2>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#888" }}>
            Place you order here
          </p>
        </div>
        <div style={styles.searchBar}>
          <i className="icon-search">🔍</i>
          <input type="text" placeholder="Search" style={styles.searchInput} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
        {/* Example Category Button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            {/* Icon goes here */}
          </div>
          <span style={{ fontSize: "12px", color: "#555" }}>Burger</span>
        </div>
        {/* Repeat for other categories */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            {/* Icon goes here */}
            🍕
          </div>
          <span style={{ fontSize: "12px", color: "white" }}>Pizza</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            {/* Icon goes here */}
            🥤
          </div>
          <span style={{ fontSize: "12px", color: "#555" }}>Drink</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            {/* Icon goes here */}
            🍟
          </div>
          <span style={{ fontSize: "12px", color: "#555" }}>French fries</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            {/* Icon goes here */}
            🥗
          </div>
          <span style={{ fontSize: "12px", color: "#555" }}>Veggies</span>
        </div>
      </div>

      {/* Pizza Section Title */}
      <h2 style={styles.sectionTitle}>Pizza</h2>

      {/* Menu Items Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Example Menu Item Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src="https://via.placeholder.com/150"
            alt="Menu Item"
            style={{ width: "100%", height: "100px", objectFit: "cover" }}
          />
          <div style={{ padding: "10px" }}>
            <h4
              style={{
                margin: "0 0 5px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Capricciosa
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
              >
                ₹ 200
              </span>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src="https://via.placeholder.com/150"
            alt="Menu Item"
            style={{ width: "100%", height: "100px", objectFit: "cover" }}
          />
          <div style={{ padding: "10px" }}>
            <h4
              style={{
                margin: "0 0 5px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Sicilian
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
              >
                ₹ 150
              </span>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src="https://via.placeholder.com/150"
            alt="Menu Item"
            style={{ width: "100%", height: "100px", objectFit: "cover" }}
          />
          <div style={{ padding: "10px" }}>
            <h4
              style={{
                margin: "0 0 5px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Marinara
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
              >
                ₹ 90
              </span>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src="https://via.placeholder.com/150"
            alt="Menu Item"
            style={{ width: "100%", height: "100px", objectFit: "cover" }}
          />
          <div style={{ padding: "10px" }}>
            <h4
              style={{
                margin: "0 0 5px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Pepperoni
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
              >
                ₹ 300
              </span>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src="https://via.placeholder.com/150"
            alt="Menu Item"
            style={{ width: "100%", height: "100px", objectFit: "cover" }}
          />
          <div style={{ padding: "10px" }}>
            <h4
              style={{
                margin: "0 0 5px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Marinara
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
              >
                ₹ 200
              </span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <button
                  style={{
                    border: "none",
                    backgroundColor: "#f0f0f0",
                    color: "#555",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  -
                </button>
                <span>1</span>
                <button
                  style={{
                    border: "none",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src="https://via.placeholder.com/150"
            alt="Menu Item"
            style={{ width: "100%", height: "100px", objectFit: "cover" }}
          />
          <div style={{ padding: "10px" }}>
            <h4
              style={{
                margin: "0 0 5px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Pepperoni
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
              >
                ₹ 200
              </span>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <button
          style={{
            border: "none",
            backgroundColor: "#555",
            color: "white",
            borderRadius: "25px",
            padding: "15px 40px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MenuPage;
