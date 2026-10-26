import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizes?: number[];
  itemLabel?: string;
};

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizes = [5, 10, 20, 50],
   
}: PaginationProps) {
  const start =
    totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const end = Math.min(currentPage * pageSize, totalItems);
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="flex flex-col gap-3  px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Showing count and page size */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="whitespace-nowrap text-sm text-gray-600">
          Showing {start}-{end} of {totalItems} 
        </span>

        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="h-9 rounded-xl border border-gray-200 px-2 text-sm text-gray-600 outline-none focus:border-blue-600"
          aria-label="Items per page"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      {/* Right: Pagination controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1 || totalItems === 0}
          onClick={() =>
            onPageChange(Math.max(1, currentPage - 1))
          }
          className={buttonClass}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
          Prev
        </button>

        <span className="whitespace-nowrap px-2 text-sm text-gray-600">
          {currentPage} of {safeTotalPages}
        </span>

        <button
          type="button"
          disabled={currentPage >= safeTotalPages || totalItems === 0}
          onClick={() =>
            onPageChange(Math.min(safeTotalPages, currentPage + 1))
          }
          className={buttonClass}
          aria-label="Next page"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}