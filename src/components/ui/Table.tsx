import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
    containerClassName?: string;
}

export const Table = ({ children, containerClassName = "", className = "", ...props }: TableProps) => (
    <div className={`w-full overflow-x-auto custom-scrollbar ${containerClassName}`}>
        <table className={`w-full text-left text-sm text-brand-text border-collapse ${className}`} {...props}>
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <thead className={`border-b border-brand-subtext/20 bg-brand-bg/50 font-semibold text-brand-subtext ${className}`}>
        <tr>{children}</tr>
    </thead>
);

export const TableBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <tbody className={`divide-y divide-brand-subtext/10 bg-white ${className}`}>
        {children}
    </tbody>
);

export const TableRow = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={`transition-colors hover:bg-brand-bg/40 ${className}`} {...props}>
        {children}
    </tr>
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
    sortable?: boolean;
    activeDirection?: "asc" | "desc" | null;
    onClick?: () => void;
    className?: string;
}

export const TableHeadCell = ({ children, sortable, activeDirection, onClick, className = "", ...props }: TableHeadProps) => (
    <th
        className={`whitespace-nowrap px-4 py-3 align-middle font-medium ${sortable ? "cursor-pointer select-none hover:text-brand-primary" : ""} ${className}`}
        onClick={sortable ? onClick : undefined}
        {...props}
    >
        <div className="flex items-center gap-1">
            {children}
            {sortable && activeDirection === "asc" && <ChevronUp className="h-3 w-3" />}
            {sortable && activeDirection === "desc" && <ChevronDown className="h-3 w-3" />}
        </div>
    </th>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
    className?: string;
}

export const TableCell = ({ children, className = "", ...props }: TableCellProps) => (
    <td className={`whitespace-nowrap px-4 py-3 align-middle ${className}`} {...props}>
        {children}
    </td>
);