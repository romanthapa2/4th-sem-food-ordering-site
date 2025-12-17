// Filter.tsx
import React, { useState } from "react";
import "./Filter.css";

interface FilterChange {
  category: string;
  price: number;
}

interface FilterProps {
  onFilterChange: (value: FilterChange) => void;
}

const categories: string[] = ["All", "Chicken", "Fish", "Veg", "Pork"];

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number>(500);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange({ category, price: priceRange });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceRange(value);
    onFilterChange({ category: selectedCategory, price: value });
  };

  return (
    <div className="filter-container">
      <h3 className="filter-title">Filter Products</h3>

      <div className="filter-section">
        <p className="filter-label">Category</p>
        <div className="category-list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-label">Max Price: Rs. {priceRange}</p>
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={priceRange}
          onChange={handlePriceChange}
          className="price-slider"
        />
      </div>
    </div>
  );
};

export default Filter;