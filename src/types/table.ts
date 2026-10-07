import * as React from "react";

export type SortDirection = "asc" | "desc" | null;

export interface ColumnDef<T> {
    header: string;
    accessorKey: keyof T | string;
    cell?: (row: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

export interface DataTableState {
    searchQuery: string;
    sortKey: string | null;
    sortDirection: SortDirection;
    currentPage: number;
    itemsPerPage: number;
}