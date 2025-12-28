export interface Product {
  id: number;
  name: string;
  price: number;
  rating?: number;
  reviews?: number;
  category: string;
  image?: string;
  description?: string | null;
}

export interface ApiResponse {
  category: string;
  count: number;
  products: Product[];
}

export interface FilterState {
  priceFrom: string;
  priceTo: string;
  selectedCategories: string;
  sortBy: string;
}