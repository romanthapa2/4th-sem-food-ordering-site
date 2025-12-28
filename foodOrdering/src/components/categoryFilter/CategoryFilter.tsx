import React from "react";
import "../products/Product.css";
import useCategory from "../../zustard/useProduct";


interface CategoryFilterProps {
  categories: string[];
  onToggleCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  onToggleCategory,
}) => {

  const {category} =useCategory();
  return (
    <div className="filter-card">
      <h3 className="filter-title">Filter By Category</h3>
      <div className="category-list">
        {categories.map((cat) => (
          <label key={cat} className="category-label">
            <input
              type="checkbox"
              checked={category.includes(cat)}
              onChange={() => onToggleCategory(cat)}
              className="category-checkbox"
            />
            {cat}
          </label>
        ))}
      </div>
    </div>
  );
};