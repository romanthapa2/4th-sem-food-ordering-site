import React from "react";
import { PriceFilter } from "../priceFilter/PriceFIlter";
import { CategoryFilter } from "../categoryFilter/CategoryFilter";

import "../products/Product.css";

interface ProductSidebarProps {
  categories: string[];
  onPriceFromChange: (value: number) => void;
  onPriceToChange: (value: number) => void;
  onApplyFilter: () => void;
  onToggleCategory: (category: string) => void;
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
  categories,
  onPriceFromChange,
  onPriceToChange,
  onApplyFilter,
  onToggleCategory,
}) => {


  return (
    <aside className="sidebar-filter">
      <PriceFilter
        onPriceFromChange={onPriceFromChange}
        onPriceToChange={onPriceToChange}
        onApplyFilter={onApplyFilter}
      />
      
      <CategoryFilter
        categories={categories}
        onToggleCategory={onToggleCategory}
      />
      
    </aside>
  );
};