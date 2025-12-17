import React from "react";
import "./ProductCard.css";

export interface ProductCardProps {
  id: string | number;
  imageUrl: string;
  title: string;
  price: number;
  rating?: number;     // optional rating (0–5)
  onAddToCart: (id: string | number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  title,
  price,
  rating = 0,
  onAddToCart,
}) => {
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {hasHalf && <span className="star half">★</span>}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => (
          <span key={`empty-${i}`} className="star empty">☆</span>
        ))}
      </>
    );
  };

  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img src={imageUrl} alt={title} className="product-image" />
      </div>

      <div className="product-info">
        <h4 className="product-title">{title}</h4>
        <div className="rating">{renderStars()}</div>
        <p className="product-price">Rs. {price.toFixed(2)}</p>
        <button
          className="add-cart-btn"
          onClick={() => onAddToCart(id)}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
