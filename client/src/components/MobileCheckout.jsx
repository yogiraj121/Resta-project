import React, { useState, useRef, useEffect, useCallback } from "react";
import { useOrder } from "../context/OrderContext.jsx";
import CookingInstructionsModal from "./CookingInstructionsModal.jsx"; // Import the modal component
import { useNavigate } from "react-router-dom";
import mobileCheckoutStyles from "./MobileCheckout.module.css";

const MobileCheckout = () => {
  const navigate = useNavigate();
  const { selectedItems, updateItemQuantity, removeItemFromOrder, clearOrder } =
    useOrder();
  const [orderType, setOrderType] = useState("Dine In"); // State to track selected order type
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  }); // State for user details form
  const [showDetailsForm, setShowDetailsForm] = useState(false); // State to control form visibility
  const [showCookingInstructionsModal, setShowCookingInstructionsModal] =
    useState(false); // State to control cooking instructions modal visibility
  const [cookingInstructions, setCookingInstructions] = useState(""); // State to store cooking instructions

  const mainContainerRef = useRef(null); // Ref for the main container for back swipe
  const swipeToOrderRef = useRef(null); // Ref for the swipe to order button
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwipingMain, setIsSwipingMain] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const swipeButtonRef = useRef(null);

  // Calculate totals - Keep these definitions here as they are used in the return statement
  const itemTotal = selectedItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  const deliveryCharge = 50; // Example value
  const taxes = itemTotal * 0.05; // Example 5% tax
  const grandTotal =
    itemTotal + (orderType === "Take Away" ? deliveryCharge : 0) + taxes; // Adjust grand total based on order type

  // Calculate total preparation time - Keep this here as it is used in the return statement
  const totalPrepTime = selectedItems.reduce((total, item) => {
    const timeMatch = item.time ? item.time.match(/^(\d+)\s*min$/i) : null;
    const itemTime = timeMatch ? parseInt(timeMatch[1], 10) : 0;
    return total + itemTime * item.qty;
  }, 0);

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveDetails = () => {
    // Here you would typically save the userDetails to state or context
    setShowDetailsForm(false);
  };

  // Function to handle saving cooking instructions
  const handleSaveCookingInstructions = (instructions) => {
    setCookingInstructions(instructions); // Save instructions to state
    setShowCookingInstructionsModal(false);
  };

  // Effect for swipe-to-go-back on the main container
  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      // Only handle touch if it's not on the swipe to order button
      if (
        swipeToOrderRef.current &&
        swipeToOrderRef.current.contains(e.target)
      ) {
        return;
      }
      setStartX(e.touches[0].clientX);
      setCurrentX(e.touches[0].clientX);
      setIsSwipingMain(false); // Reset swipe state
    };

    const handleTouchMove = (e) => {
      // Only handle touch if it's not on the swipe to order button
      if (
        swipeToOrderRef.current &&
        swipeToOrderRef.current.contains(e.target)
      ) {
        return;
      }
      setCurrentX(e.touches[0].clientX);
      const diff = currentX - startX;
      // Only set isSwiping to true if horizontal movement is significant
      if (Math.abs(diff) > 10) {
        // Threshold to detect a swipe intention
        setIsSwipingMain(true);
        // Prevent vertical scrolling when swiping horizontally
        // Check if swipe is more horizontal than vertical
        const deltaY = Math.abs(
          e.touches[0].clientY - e.changedTouches[0].clientY
        );
        if (Math.abs(diff) > deltaY) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e) => {
      // Added 'e' parameter here
      // Only handle touch if it's not on the swipe to order button
      if (
        swipeToOrderRef.current &&
        swipeToOrderRef.current.contains(e.target)
      ) {
        return;
      }
      if (isSwipingMain) {
        const diff = currentX - startX;
        // Define a threshold for a successful swipe (e.g., 50 pixels to the right)
        const swipeThreshold = 30;

        if (diff > swipeThreshold) {
          // Swiped right - navigate back

          handlePlaceOrder();
          // Call place order function if needed
        }
      }
      // Reset swipe state
      setStartX(0);
      setCurrentX(0);
      setIsSwipingMain(false);
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startX, currentX, isSwipingMain, navigate]); // Add dependencies

  const handleDragStart = (e) => {
    // Only start dragging if the click/touch is on the swipe button
    if (!e.target.closest(`.${mobileCheckoutStyles.swipeToOrderContainer}`)) {
      return;
    }
    e.preventDefault(); // Prevent default behavior
    setIsDragging(true);
    const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    setDragStartX(clientX);
    setDragCurrentX(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default behavior
    const clientX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
    setDragCurrentX(clientX);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default behavior
    setIsDragging(false);
    setDragCurrentX(dragStartX);
  };

  useEffect(() => {
    const button = swipeButtonRef.current;
    if (!button) return;

    // Only add event listeners to the button container
    button.addEventListener("mousedown", handleDragStart);
    button.addEventListener("touchstart", handleDragStart, { passive: false });

    // Add move and end listeners to window to handle dragging outside the button
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("touchmove", handleDragMove, { passive: false });
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      button.removeEventListener("mousedown", handleDragStart);
      button.removeEventListener("touchstart", handleDragStart);
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  // Function to handle placing the order
  const handlePlaceOrder = useCallback(async () => {
    // Basic validation (can be expanded)
    if (!userDetails.name || !userDetails.phone) {
      alert("Please enter your name and phone number.");
      setShowDetailsForm(true); // Show form when name/phone is missing
      return;
    }

    // Only require address for Take Away orders
    if (orderType === "Take Away" && !userDetails.address) {
      alert("Please enter your delivery address for Take Away orders.");
      setShowDetailsForm(true); // Show form when address is missing for Take Away
      return;
    }

    const orderData = {
      items: selectedItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        time: item.time, // Include time
        img: item.img, // Include image
      })),
      orderType,
      userDetails: {
        ...userDetails,
        // Only include address if it's a Take Away order
        address: orderType === "Take Away" ? userDetails.address : undefined,
      },
      cookingInstructions,
      itemTotal,
      deliveryCharge: orderType === "Take Away" ? deliveryCharge : undefined, // Only include if Take Away
      taxes,
      grandTotal,
    };

    try {
      const response = await fetch(
        "https://resta-project-2.onrender.com/api/orders/",
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(
          "Order placed successfully!\nAssigned Chef: " +
            result.order.assignedChef
        );
        clearOrder(); // Clear the order after successful placement
        navigate("/m"); // Navigate to mobile menu after successful order
      } else {
        const error = await response.json();
        alert("Failed to place order: " + error.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  }, [
    selectedItems,
    orderType,
    userDetails,
    cookingInstructions,
    itemTotal,
    taxes,
    grandTotal,
    clearOrder,
    navigate,
  ]);

  return (
    <div
      className={mobileCheckoutStyles.mobileCheckoutContainer}
      ref={mainContainerRef} // Use the ref for the main container
    >
      <div className={mobileCheckoutStyles.headerSection}>
        <div className={mobileCheckoutStyles.greetingText}>Good evening</div>
        <div className={mobileCheckoutStyles.placeOrderText}>
          Place you order here
        </div>

        {/* Selected Items List */}
        <div className={mobileCheckoutStyles.selectedItemsList}>
          {selectedItems.map((item) => (
            <div key={item._id} className={mobileCheckoutStyles.selectedItem}>
              <img
                src={item.img}
                alt={item.name}
                className={mobileCheckoutStyles.itemImage}
              />
              <div className={mobileCheckoutStyles.itemDetails}>
                <div className={mobileCheckoutStyles.itemName}>{item.name}</div>
                <div className={mobileCheckoutStyles.itemPrice}>
                  ₹ {item.price}
                </div>
                {/* Add size/options if available in item data */}
                {item.size && (
                  <div className={mobileCheckoutStyles.itemSize}>
                    Size: {item.size}
                  </div>
                )}
              </div>
              <div className={mobileCheckoutStyles.quantityControl}>
                <button
                  onClick={() => updateItemQuantity(item._id, item.qty - 1)}
                  className={mobileCheckoutStyles.quantityButton}
                >
                  -
                </button>
                <span className={mobileCheckoutStyles.quantity}>
                  {item.qty}
                </span>
                <button
                  onClick={() => updateItemQuantity(item._id, item.qty + 1)}
                  className={mobileCheckoutStyles.quantityButton}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItemFromOrder(item._id)}
                className={mobileCheckoutStyles.removeItemButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add cooking instructions */}
        <div
          onClick={() => setShowCookingInstructionsModal(true)}
          className={mobileCheckoutStyles.cookingInstructionsLink}
        >
          Add cooking instructions (optional)
        </div>

        {/* Dine In / Take Away Toggle */}
        <div className={mobileCheckoutStyles.orderTypeToggle}>
          <button
            onClick={() => setOrderType("Dine In")}
            className={`${mobileCheckoutStyles.orderTypeButton} ${
              orderType === "Dine In"
                ? mobileCheckoutStyles.orderTypeButtonActive
                : ""
            }`}
          >
            Dine In
          </button>
          <button
            onClick={() => setOrderType("Take Away")}
            className={`${mobileCheckoutStyles.orderTypeButton} ${
              orderType === "Take Away"
                ? mobileCheckoutStyles.orderTypeButtonActive
                : ""
            }`}
          >
            Take Away
          </button>
        </div>

        {/* Order Summary */}
        <div className={mobileCheckoutStyles.orderSummary}>
          <div className={mobileCheckoutStyles.summaryRow}>
            <span>Item Total</span>
            <span className={mobileCheckoutStyles.summaryTotal}>
              ₹{itemTotal.toFixed(2)}
            </span>
          </div>
          {orderType === "Take Away" && (
            <div className={mobileCheckoutStyles.summaryRow}>
              <span>Delivery Charge</span>
              <span className={mobileCheckoutStyles.summaryTotal}>
                ₹{deliveryCharge.toFixed(2)}
              </span>
            </div>
          )}
          <div
            className={`${mobileCheckoutStyles.summaryRow} ${mobileCheckoutStyles.summaryDivider}`}
          >
            <span>Taxes</span>
            <span className={mobileCheckoutStyles.summaryTotal}>
              ₹{taxes.toFixed(2)}
            </span>
          </div>
          <div className={mobileCheckoutStyles.grandTotalRow}>
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Your Details */}
        <div className={mobileCheckoutStyles.userDetailsSection}>
          <div className={mobileCheckoutStyles.userDetailsTitle}>
            Your details
          </div>

          {!showDetailsForm && (
            <div
              onClick={() => setShowDetailsForm(true)}
              className={mobileCheckoutStyles.userDetailsText}
            >
              {userDetails.name || userDetails.phone ? (
                <>
                  <p>Name: {userDetails.name}</p>
                  <p>Phone: {userDetails.phone}</p>
                </>
              ) : (
                <p className={mobileCheckoutStyles.userDetailsTextPlaceholder}>
                  Tap to add your details
                </p>
              )}
            </div>
          )}

          {showDetailsForm && (
            <div className={mobileCheckoutStyles.userDetailsForm}>
              <div className={mobileCheckoutStyles.formField}>
                <label
                  htmlFor="name"
                  className={mobileCheckoutStyles.formLabel}
                >
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={userDetails.name}
                  onChange={handleUserDetailsChange}
                  className={mobileCheckoutStyles.formInput}
                  required
                />
              </div>
              <div className={mobileCheckoutStyles.formField}>
                <label
                  htmlFor="phone"
                  className={mobileCheckoutStyles.formLabel}
                >
                  Phone number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={userDetails.phone}
                  onChange={handleUserDetailsChange}
                  className={mobileCheckoutStyles.formInput}
                  required
                />
              </div>

              {/* Show address field only for Take Away orders */}
              {orderType === "Take Away" && (
                <div className={mobileCheckoutStyles.formField}>
                  <label
                    htmlFor="address"
                    className={mobileCheckoutStyles.formLabel}
                  >
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter your delivery address"
                    value={userDetails.address}
                    onChange={handleUserDetailsChange}
                    className={mobileCheckoutStyles.formInput}
                    required
                  />
                </div>
              )}

              <button
                onClick={handleSaveDetails}
                className={mobileCheckoutStyles.saveDetailsButton}
              >
                Save Details
              </button>
            </div>
          )}

          {/* Remove the separate delivery address section since it's now part of the form */}
          {orderType === "Take Away" &&
            !showDetailsForm &&
            userDetails.address && (
              <div className={mobileCheckoutStyles.deliveryAddressDisplay}>
                <span className={mobileCheckoutStyles.deliveryIcon}>📍</span>
                <span className={mobileCheckoutStyles.deliveryText}>
                  Delivery at Home - {userDetails.address}
                </span>
              </div>
            )}

          <div className={mobileCheckoutStyles.deliveryTimeContainer}>
            <span className={mobileCheckoutStyles.deliveryIcon}>🟢</span>
            <span className={mobileCheckoutStyles.deliveryText}>
              {orderType === "Take Away" ? "Delivery" : "Ready"} in{" "}
              {totalPrepTime} mins
            </span>
          </div>
        </div>
      </div>

      {/* Swipe to Order Button */}
      <div
        ref={swipeButtonRef}
        className={mobileCheckoutStyles.placeOrderButtonFixed}
        style={{ userSelect: "none" }}
      >
        <div className={mobileCheckoutStyles.swipeToOrderContainer}>
          <div
            className={mobileCheckoutStyles.swipeIconContainer}
            style={{
              transform: isDragging
                ? `translateX(${dragCurrentX - dragStartX}px)`
                : undefined,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
          >
            <span className={mobileCheckoutStyles.swipeIcon}>→</span>
          </div>
          <span className={mobileCheckoutStyles.swipeText}>Swipe to Order</span>
        </div>
      </div>

      {/* Cooking Instructions Modal */}
      {showCookingInstructionsModal && (
        <CookingInstructionsModal
          onClose={() => setShowCookingInstructionsModal(false)}
          onSave={handleSaveCookingInstructions}
        />
      )}
    </div>
  );
};

export default MobileCheckout;
