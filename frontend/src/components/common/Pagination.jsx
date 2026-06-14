import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemName,
  onPageChange,
}) {
  const showingStart = (currentPage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-5 border-t border-ui-border bg-ui-white/50 rounded-b-3xl">
      <p className="text-content-subtitle text-xs font-bold uppercase tracking-widest">
        Showing {" "}
        <span className="text-content-paragraph">{showingStart}</span>
        {" "}to{" "}
        <span className="text-content-paragraph">{showingEnd}</span>
        {" "}of{" "}
        <span className="text-content-paragraph">{totalItems}</span> {itemName}
      </p>

      <div className="flex items-center gap-2 bg-ui-mainBg p-1.5 rounded-2xl border border-ui-border">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="p-2 text-content-subtitle hover:text-brand-primary hover:bg-ui-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              aria-current={isActive ? "page" : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                ? "bg-brand-primary text-white"
                : "text-content-subtitle hover:text-content-paragraph hover:bg-brand-light"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="p-2 text-content-subtitle hover:text-brand-primary hover:bg-ui-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
