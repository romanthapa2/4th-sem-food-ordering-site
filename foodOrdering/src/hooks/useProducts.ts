import { useState, useEffect } from "react";
import axios from "axios";
import type { Product, ApiResponse } from "../types/product.types";

export const useProducts = (category: string | null) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (category: string | null) => {
    setLoading(true);
    setError(null);

    try {
      const url = category
        ? `http://localhost:3000/api/products?category=${category}`
        : `http://localhost:3000/api/products`;

      const response = await axios.get<ApiResponse>(url);

      const mappedProducts: Product[] = response.data.products.map((product) => ({
        ...product,
        rating: product.rating ?? 0,
        reviews: product.reviews ?? 0,
        image: product.image ?? "https://via.placeholder.com/300",
      }));

      setAllProducts(mappedProducts);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } else {
        setError("An unexpected error occurred");
      }
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(category);
  }, [category]);

  return { allProducts, loading, error, refetch: fetchProducts };
};