import React from "react";
import "../products/Product.css";
import type { SortBy } from "../../zustard/useProduct";

interface SortBarProps {
  totalResults: number;
  sortBy: string;
  onSortChange: (sortBy:SortBy ) => void;
}

export const SortBar: React.FC<SortBarProps> = ({ totalResults, sortBy, onSortChange }) => {
  return (
    <div className="sort-bar">
      <span className="results-count">
        {totalResults > 0 ? (
          <>
            Showing <strong>1</strong> to <strong>{totalResults}</strong> of{" "}
            <strong>{totalResults}</strong> results
          </>
        ) : (
          "No results"
        )}
      </span>
      <div className="sort-controls">
        <label className="sort-label">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="latest">Latest Products</option>
          <option value="oldest">Oldest Products</option>
          <option value="highest">Highest Price</option>
          <option value="lowest">Lowest Price</option>
        </select>
      </div>
    </div>
  );
};