    import React from "react";
import "../products/Product.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn pagination-btn-prev"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        « Previous
      </button>
      <button
        className="pagination-btn pagination-btn-next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next »
      </button>
    </div>
  );
};