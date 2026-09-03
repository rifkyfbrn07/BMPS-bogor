"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate pagination items with ellipses if many pages
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex items-center justify-center gap-1.5 sm:gap-2"
    >
      <button
        type="button"
        aria-label="Halaman sebelumnya"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#172554] shadow-sm transition hover:border-[#1B2CC1] hover:text-[#1B2CC1] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#E5E7EB] disabled:hover:text-[#172554]"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) => {
        if (typeof page === "string") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-xs font-semibold text-slate-400"
            >
              ...
            </span>
          );
        }
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Halaman ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition shadow-sm",
              page === currentPage
                ? "bg-[#0F1F4A] text-white"
                : "border border-[#E5E7EB] bg-white text-[#172554] hover:border-[#1B2CC1] hover:text-[#1B2CC1]"
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Halaman berikutnya"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#172554] shadow-sm transition hover:border-[#1B2CC1] hover:text-[#1B2CC1] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#E5E7EB] disabled:hover:text-[#172554]"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
