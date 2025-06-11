"use client";

import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;

  let visiblePages = pages;
  if (totalPages > maxVisiblePages) {
    const start = Math.max(
      Math.min(
        currentPage - Math.floor(maxVisiblePages / 2),
        totalPages - maxVisiblePages + 1
      ),
      1
    );
    visiblePages = pages.slice(start - 1, start + maxVisiblePages - 1);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        isIconOnly
        variant="flat"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        className="bg-slate-800/50 text-slate-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {visiblePages[0] > 1 && (
        <>
          <Button
            variant="flat"
            onClick={() => onPageChange(1)}
            className={`bg-slate-800/50 text-slate-300 ${
              currentPage === 1 ? "bg-purple-500/20 text-purple-400" : ""
            }`}
          >
            1
          </Button>
          {visiblePages[0] > 2 && <span className="text-slate-400">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant="flat"
          onClick={() => onPageChange(page)}
          className={`bg-slate-800/50 text-slate-300 ${
            currentPage === page ? "bg-purple-500/20 text-purple-400" : ""
          }`}
        >
          {page}
        </Button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="text-slate-400">...</span>
          )}
          <Button
            variant="flat"
            onClick={() => onPageChange(totalPages)}
            className={`bg-slate-800/50 text-slate-300 ${
              currentPage === totalPages
                ? "bg-purple-500/20 text-purple-400"
                : ""
            }`}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        isIconOnly
        variant="flat"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        className="bg-slate-800/50 text-slate-300"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
