import { create } from "zustand";

export type SortBy = "latest" | "oldest" | "highest" | "lowest";

type CategoryState = {
  category: string;
  priceFrom: number | "";
  priceTo: number | "";
  sortBy: SortBy;

  updateCategory: (newCategory: string) => void;
  updatePriceFrom: (newPriceFrom: number | "") => void;
  updatePriceTo: (newPriceTo: number | "") => void;
  updateSortBy: (newSortBy: SortBy) => void;
};

const useCategory = create<CategoryState>((set) => ({
  category: "",
  priceFrom: "",
  priceTo: "",
  sortBy: "latest",

  updateCategory: (newCategory) =>
    set({ category: newCategory }),

  updatePriceFrom: (newPriceFrom) =>
    set({ priceFrom: newPriceFrom }),

  updatePriceTo: (newPriceTo) =>
    set({ priceTo: newPriceTo }),

  updateSortBy: (newSortBy) =>
    set({ sortBy: newSortBy }),
}));

export default useCategory;
