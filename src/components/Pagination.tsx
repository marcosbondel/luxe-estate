import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={`?page=${currentPage - 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-nordic-dark/10 dark:border-white/10 bg-white dark:bg-white/5 text-nordic-dark dark:text-white hover:border-mosque hover:text-mosque transition-all"
          aria-label="Previous page"
        >
          <span className="material-icons text-lg">chevron_left</span>
        </Link>
      ) : (
        <span className="w-10 h-10 flex items-center justify-center rounded-lg border border-nordic-dark/5 dark:border-white/5 text-nordic-muted cursor-not-allowed opacity-40">
          <span className="material-icons text-lg">chevron_left</span>
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={`?page=${page}`}
            aria-current={isActive ? 'page' : undefined}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-mosque text-white shadow-md'
                : 'bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white hover:border-mosque hover:text-mosque'
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={`?page=${currentPage + 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-nordic-dark/10 dark:border-white/10 bg-white dark:bg-white/5 text-nordic-dark dark:text-white hover:border-mosque hover:text-mosque transition-all"
          aria-label="Next page"
        >
          <span className="material-icons text-lg">chevron_right</span>
        </Link>
      ) : (
        <span className="w-10 h-10 flex items-center justify-center rounded-lg border border-nordic-dark/5 dark:border-white/5 text-nordic-muted cursor-not-allowed opacity-40">
          <span className="material-icons text-lg">chevron_right</span>
        </span>
      )}
    </nav>
  );
}
