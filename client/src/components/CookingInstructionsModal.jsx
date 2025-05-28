import React, { useState } from "react";

const CookingInstructionsModal = ({ onClose, onSave }) => {
  const [instructions, setInstructions] = useState("");

  const handleSave = () => {
    onSave(instructions);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#f2f2f2",
          padding: "20px",
          borderRadius: "10px 10px 0 0",
          width: "100%",
          maxWidth: 430,
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ×
        </button>

        <div
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#333",
          }}
        >
          Add Cooking instructions
        </div>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder=""
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxSizing: "border-box",
            marginBottom: "10px",
            resize: "none",
          }}
        ></textarea>

        <div style={{ fontSize: "12px", color: "#888", marginBottom: "20px" }}>
          The restaurant will try its best to follow your request. However,
          refunds or cancellations in this regard won't be possible
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "5px",
              background: "#e0e0e0",
              color: "#555",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "5px",
              background: "#444",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookingInstructionsModal;
