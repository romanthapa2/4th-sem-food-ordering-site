import React from "react";
import "../products/Product.css";
import useCategory from "../../zustard/useProduct";

interface PriceFilterProps {
  onPriceFromChange: (value: number) => void;
  onPriceToChange: (value: number) => void;
  onApplyFilter: () => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  onPriceFromChange,
  onPriceToChange,
  onApplyFilter,
}) => {

  const {priceFrom,priceTo} = useCategory();


  return (
    <div className="filter-card">
      <h3 className="filter-title">Filter By Price</h3>
      <div className="price-inputs">
        <div className="price-input-group">
          <label className="input-label">From</label>
          <input
            type="number"
            placeholder="Rs"
            value={priceFrom}
            onChange={(e) => onPriceFromChange(Number(e.target.value))}
            className="price-input"
          />
        </div>
        <span className="price-separator">-</span>
        <div className="price-input-group">
          <label className="input-label">To</label>
          <input
            type="number"
            placeholder="Rs"
            value={priceTo}
            onChange={(e) => onPriceToChange(Number(e.target.value))}
            className="price-input"
          />
        </div>
      </div>
      <button onClick={onApplyFilter} className="apply-filter-btn">
        Apply Filter
      </button>
    </div>
  );
};