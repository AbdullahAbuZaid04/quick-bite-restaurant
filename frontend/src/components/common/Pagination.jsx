import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemName,
  onPageChange,
}) {
  const showingEnd = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-5 border-t border-gray-100 bg-white/50 rounded-b-3xl">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
        Showing {" "}
        <span className="text-gray-900">{showingEnd}</span> {" "}
        of <span className="text-gray-900">{totalItems}</span> {itemName}
      </p>

      <div className="flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
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
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                ? "bg-orange-500 text-white"
                : "text-gray-500 hover:text-gray-900 hover:bg-orange-100"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
