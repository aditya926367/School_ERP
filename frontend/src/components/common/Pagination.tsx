import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
};

const buttonClass = "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">Showing {start} to {end} of {totalItems} </p>
      <div className="flex items-center gap-2">
        <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(Math.max(1, currentPage - 1))} className={buttonClass} aria-label="Previous page">
          <ChevronLeft size={18} /> Prev
        </button>
        <span className="px-2 text-sm text-gray-600">{currentPage} of {totalPages}</span>
        <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} className={buttonClass} aria-label="Next page">
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
