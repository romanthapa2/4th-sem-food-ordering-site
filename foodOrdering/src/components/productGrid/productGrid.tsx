import React from "react";
import type { Product } from "../../types/product.types";
import { ProductCard } from "../productCard/ProductCard";
import "../products/Product.css";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onAddToCart?: (productId: number) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  error,
  onAddToCart,
}) => {
  if (loading) {
    return (
      <div className="product-grid-message">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid-message error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-message">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};
