import React, { createContext, useState, useContext } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const addItemToOrder = (item) => {
    setSelectedItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i._id === item._id);
      if (existingItemIndex > -1) {
        // Item already exists, increase quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          qty: newItems[existingItemIndex].qty + 1,
        };
        return newItems;
      } else {
        // Item does not exist, add with quantity 1
        return [...prevItems, { ...item, qty: 1 }];
      }
    });
  };

  const removeItemFromOrder = (itemId) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item._id !== itemId)
    );
  };

  const updateItemQuantity = (itemId, newQty) => {
    setSelectedItems((prevItems) => {
      const newItems = [...prevItems];
      const itemIndex = newItems.findIndex((item) => item._id === itemId);
      if (itemIndex > -1) {
        if (newQty > 0) {
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            qty: newQty,
          };
        } else {
          // Remove if quantity is 0 or less
          newItems.splice(itemIndex, 1);
        }
      }
      return newItems;
    });
  };

  const clearOrder = () => {
    setSelectedItems([]);
  };

  return (
    <OrderContext.Provider
      value={{
        selectedItems,
        addItemToOrder,
        removeItemFromOrder,
        updateItemQuantity,
        clearOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
