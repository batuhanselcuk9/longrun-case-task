import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ITEMS_PER_PAGE } from '../constants';

interface PaginationProps {
    page: number;
    totalPages: number;
    totalCount: number;
    setPage: (updater: number | ((p: number) => number)) => void;
}

/**
 * Pagination — shows the current page range, total count,
 * and Previous / Next navigation buttons.
 */
export default function Pagination({ page, totalPages, totalCount, setPage }: PaginationProps) {
    // Calculate the displayed record range for the current page
    const rangeFrom = Math.min((page - 1) * ITEMS_PER_PAGE + 1, totalCount);
    const rangeTo = Math.min(page * ITEMS_PER_PAGE, totalCount);

    return (
        <div className="p-4 border-t flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50">
            {/* Record range display e.g. "Showing 11–20 of 70 products" */}
            <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-bold text-gray-900">{rangeFrom}–{rangeTo}</span>
                {' '}of {totalCount} products
            </p>

            <div className="flex items-center gap-2">
                {/* Previous page button */}
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 transition-all shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-medium">Page {page} of {totalPages}</span>

                {/* Next page button */}
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 transition-all shadow-sm"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
