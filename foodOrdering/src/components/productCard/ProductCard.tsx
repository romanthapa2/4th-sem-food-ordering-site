import React from "react";
import type { Product } from "../../types/product.types";
import "../products/Product.css";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.name}
          className="product-image"
        />
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add To Cart
        </button>
      </div>
      <div className="product-info">
        <div className="product-rating">
          <span className="star-icon">★</span>
          <span className="rating-value">{(product.rating || 0).toFixed(1)}</span>
          <span className="review-count">({product.reviews || 0})</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">Rs {product.price}</p>
      </div>
    </div>
  );
};