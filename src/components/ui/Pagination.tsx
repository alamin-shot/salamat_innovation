"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    itemsPerPage?: number;
    perPage?: number; // Alias support for perPage
    onItemsPerPageChange?: (items: number) => void;
    onPerPageChange?: (items: number) => void; // Alias support for onPerPageChange
}

export function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => { },
    itemsPerPage,
    perPage,
    onItemsPerPageChange = () => { },
    onPerPageChange = () => { },
}: PaginationProps = {}) {
    // Resolve items per page from either prop variant safely
    const currentLimit = itemsPerPage ?? perPage ?? 10;

    const handleLimitChange = (newLimit: number) => {
        onItemsPerPageChange(newLimit);
        onPerPageChange(newLimit);
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Show per page:</span>
                <select
                    value={currentLimit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="rounded-md border border-gray-200 py-1 px-2 text-xs focus:outline-none focus:border-emerald-500 bg-white text-gray-800"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 mr-4">
                    Page {currentPage} of {Math.max(1, totalPages)}
                </span>
                <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}