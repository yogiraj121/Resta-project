import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext.jsx";
import mobileMenuStyles from "./MobileMenu.module.css";

const categories = [
  { name: "Burger", icon: "🍔" },
  { name: "Pizza", icon: "🍕" },
  { name: "Drink", icon: "🥤" },
  { name: "French fries", icon: "🍟" },
  { name: "Veggies", icon: "🥦" },
];

const foods = [
  {
    _id: "food-1",
    name: "Capricciosa",
    price: 200,
    time: "15 min",
    img: "https://cdn.pixabay.com/photo/2023/05/28/14/13/ai-generated-8023787_1280.jpg",
    category: "Pizza",
  },
  {
    _id: "food-2",
    name: "Sicilian",
    price: 150,
    time: "12 min",
    img: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
    category: "Pizza",
  },
  {
    _id: "food-3",
    name: "Marinara Pizza",
    price: 90,
    time: "10 min",
    img: "https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg",
    category: "Pizza",
  },
  {
    _id: "food-4",
    name: "Pepperoni",
    price: 300,
    time: "18 min",
    img: "https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg",
    category: "Pizza",
  },
  {
    _id: "food-5",
    name: "Classic Burger",
    price: 250,
    time: "10 min",
    img: "https://cdn.pixabay.com/photo/2022/07/15/18/12/cheese-burger-7323672_1280.jpg",
    category: "Burger",
  },
  {
    _id: "food-6",
    name: "Cheese Burger",
    price: 280,
    time: "12 min",
    img: "https://cdn.pixabay.com/photo/2022/07/15/18/17/spicy-burger-7323694_1280.jpg",
    category: "Burger",
  },
  {
    _id: "food-7",
    name: "Cola",
    price: 50,
    time: "2 min",
    img: "https://cdn.pixabay.com/photo/2020/02/07/14/07/coca-cola-4827248_1280.jpg",
    category: "Drink",
  },
  {
    _id: "food-8",
    name: "Orange Juice",
    price: 60,
    time: "3 min",
    img: "https://cdn.pixabay.com/photo/2022/12/15/20/24/drinks-7658475_1280.jpg",
    category: "Drink",
  },
  {
    _id: "food-9",
    name: "Large Fries",
    price: 100,
    time: "8 min",
    img: "https://cdn.pixabay.com/photo/2024/01/23/08/11/ai-generated-8527044_1280.jpg",
    category: "French fries",
  },
  {
    _id: "food-10",
    name: "Small Fries",
    price: 70,
    time: "6 min",
    img: "https://cdn.pixabay.com/photo/2019/11/04/12/26/fries-4601057_1280.jpg",
    category: "French fries",
  },
  {
    _id: "food-11",
    name: "Garden Salad",
    price: 120,
    time: "5 min",
    img: "https://cdn.pixabay.com/photo/2016/08/09/10/30/tomatoes-1580273_1280.jpg",
    category: "Veggies",
  },
  {
    _id: "food-12",
    name: "Caesar Salad",
    price: 150,
    time: "7 min",
    img: "https://cdn.pixabay.com/photo/2017/08/11/00/32/salad-2629262_1280.jpg",
    category: "Veggies",
  },
];

const MobileMenu = () => {
  const [activeCat, setActiveCat] = useState("Pizza");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { addItemToOrder, selectedItems, removeItemFromOrder } = useOrder();

  const handleCardClick = (food) => {
    const isSelected = selectedItems.some((item) => item._id === food._id);
    if (isSelected) {
      removeItemFromOrder(food._id);
    }
  };

  return (
    <div className={mobileMenuStyles.mobileMenuContainer}>
      <div className={mobileMenuStyles.headerSection}>
        <div className={mobileMenuStyles.greetingText}>Good evening</div>
        <div className={mobileMenuStyles.placeOrderText}>
          Place you order here
        </div>
        <div className={mobileMenuStyles.searchBarContainer}>
          <span className={mobileMenuStyles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={mobileMenuStyles.searchInput}
          />
        </div>
        <div className={mobileMenuStyles.categoriesContainer}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCat(cat.name)}
              className={`${mobileMenuStyles.categoryButton} ${
                activeCat === cat.name
                  ? mobileMenuStyles.categoryButtonActive
                  : ""
              }`}
            >
              <span className={mobileMenuStyles.categoryIcon}>{cat.icon}</span>
              <span className={mobileMenuStyles.categoryName}>{cat.name}</span>
            </button>
          ))}
        </div>
        <div className={mobileMenuStyles.activeCategoryTitle}>{activeCat}</div>
      </div>
      <div className={mobileMenuStyles.foodsGrid}>
        {foods
          .filter(
            (f) =>
              f.category === activeCat &&
              (!search || f.name.toLowerCase().includes(search.toLowerCase()))
          )
          .map((food) => {
            const isSelected = selectedItems.some(
              (item) => item._id === food._id
            );
            return (
              <div
                key={food._id}
                className={`${mobileMenuStyles.foodCard} ${
                  isSelected ? mobileMenuStyles.foodCardHighlighted : ""
                }`}
                onClick={() => handleCardClick(food)}
              >
                <img
                  src={food.img}
                  alt={food.name}
                  className={mobileMenuStyles.foodImage}
                />
                <div className={mobileMenuStyles.foodInfo}>
                  <div className={mobileMenuStyles.foodName}>{food.name}</div>
                  <div className={mobileMenuStyles.foodPrice}>
                    ₹ {food.price}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addItemToOrder(food);
                  }}
                  className={mobileMenuStyles.addToOrderButton}
                >
                  +
                </button>
              </div>
            );
          })}
      </div>
      <div className={mobileMenuStyles.nextButtonContainer}>
        <button
          onClick={() => navigate("/checkout")}
          className={`${mobileMenuStyles.nextButton} ${
            selectedItems.length === 0
              ? mobileMenuStyles.nextButtonDisabled
              : ""
          }`}
          disabled={selectedItems.length === 0}
        >
          {selectedItems.length === 0 ? "Add Items to Order" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
