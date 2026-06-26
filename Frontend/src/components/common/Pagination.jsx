import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination — page navigation controls.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Show at most 5 pages around current
  const visiblePages = pages.filter(p =>
    p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  )

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((page, i) => {
        const prev = visiblePages[i - 1]
        const showEllipsis = prev && page - prev > 1

        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-600 text-sm">
                …
              </span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                page === currentPage
                  ? 'gradient-primary text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          </span>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
