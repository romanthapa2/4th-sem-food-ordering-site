
import { useSearchParams } from "react-router-dom";
import { ProductSidebar } from "../productSidebar/ProductSidebar";
import { SortBar } from "../sortbar/sortbar";
import { ProductGrid } from "../productGrid/productGrid";
import { Pagination } from "../pagination/pagination";
import { useProducts } from "../../hooks/useProducts";
// import { useProductFilters } from "../../hooks/useProductsFilter";
import "./Product.css";
import useCategory from "../../zustard/useProduct";
import type { SortBy } from "../../zustard/useProduct";

const CATEGORIES = ["Achar", "Masala", "Sekeko", "Pickel", "Momo", "Khaja", "Pasta"];

export const Products = () => {
  const {updateCategory,updatePriceFrom,updatePriceTo,updateSortBy,sortBy,category} = useCategory();
  // const [searchParams] = useSearchParams();
  // const categoryFromUrl = searchParams.get("category");

  // Custom hooks
  const { allProducts, loading, error } = useProducts(category);
  // const { products, filters, setFilters } = useProductFilters(allProducts, categoryFromUrl || '');

  // Handlers
  const handlePriceFromChange = (value: number) => {
    updatePriceFrom(value);
  };

  const handlePriceToChange = (value: number) => {
    updatePriceTo(value);
  };

  const handleApplyFilter = () => {
    // Filters are automatically applied via useEffect in useProductFilters
    console.log("Filters applied");
  };

  const handleToggleCategory = (category: string) => {
    updateCategory(category);
  };

  const handleSortChange = (sortBy: SortBy) => {
    updateSortBy(sortBy)
  };

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart:", productId);
    // Implement cart logic here
  };

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
    // Implement pagination logic here
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <ProductSidebar
          categories={CATEGORIES}
          onPriceFromChange={handlePriceFromChange}
          onPriceToChange={handlePriceToChange}
          onApplyFilter={handleApplyFilter}
          onToggleCategory={handleToggleCategory}
        />

        <main className="products-main">
          <SortBar
            totalResults={allProducts.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          <ProductGrid
            products={allProducts}
            loading={loading}
            error={error}
            onAddToCart={handleAddToCart}
          />

          {!loading && allProducts.length > 0 && (
            <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};