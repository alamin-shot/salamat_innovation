import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export const Table = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm text-brand-text border-collapse">
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <thead className="border-b border-brand-subtext/20 bg-brand-bg/50 font-semibold text-brand-subtext">
        <tr>{children}</tr>
    </thead>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-brand-subtext/10 bg-white">
        {children}
    </tbody>
);

export const TableRow = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <tr className={`transition-colors hover:bg-brand-bg/40 ${className}`}>
        {children}
    </tr>
);

interface TableHeadProps {
    children: React.ReactNode;
    sortable?: boolean;
    activeDirection?: "asc" | "desc" | null;
    onClick?: () => void;
    className?: string;
}

export const TableHeadCell = ({ children, sortable, activeDirection, onClick, className = "" }: TableHeadProps) => (
    <th
        className={`whitespace-nowrap px-4 py-3 align-middle font-medium ${sortable ? "cursor-pointer select-none hover:text-brand-primary" : ""} ${className}`}
        onClick={sortable ? onClick : undefined}
    >
        <div className="flex items-center gap-1">
            {children}
            {sortable && activeDirection === "asc" && <ChevronUp className="h-3 w-3" />}
            {sortable && activeDirection === "desc" && <ChevronDown className="h-3 w-3" />}
        </div>
    </th>
);

export const TableCell = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <td className={`whitespace-nowrap px-4 py-3 align-middle ${className}`}>
        {children}
    </td>
);