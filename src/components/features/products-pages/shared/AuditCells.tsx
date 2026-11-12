"use client";
import * as React from "react";
import { TableCell, TableHeadCell } from "@/components/ui/Table";

/** Header cells for the standard audit columns. */
export function AuditHeadCells() {
    return (
        <>
            <TableHeadCell className="whitespace-nowrap">Created By</TableHeadCell>
            <TableHeadCell className="whitespace-nowrap">Created At</TableHeadCell>
        </>
    );
}

interface AuditCellsProps {
    createdBy: string;
    createdAt: string;
    /** Extra classes for rows whose cells are top-aligned. */
    className?: string;
}

/** Body cells for the standard audit columns. */
export const AuditCells = React.memo(function AuditCells({ createdBy, createdAt, className = "" }: AuditCellsProps) {
    return (
        <>
            <TableCell className={className}>
                <span className="text-sm font-medium text-brand-text">{createdBy}</span>
            </TableCell>
            <TableCell className={className}>
                <span className="text-sm font-medium text-brand-subtext">{createdAt}</span>
            </TableCell>
        </>
    );
});

AuditCells.displayName = "AuditCells";

interface AuditFooterProps {
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string | null;
}

/** Small audit line shown inside record drawers. */
export function AuditFooter({ createdBy, createdAt, updatedBy, updatedAt }: AuditFooterProps) {
    return (
        <p className="text-xs text-brand-subtext">
            Created by <span className="font-semibold text-brand-text">{createdBy}</span> on {createdAt}
            {updatedBy && updatedAt && (
                <> · Last updated by <span className="font-semibold text-brand-text">{updatedBy}</span> on {updatedAt}</>
            )}
        </p>
    );
}
