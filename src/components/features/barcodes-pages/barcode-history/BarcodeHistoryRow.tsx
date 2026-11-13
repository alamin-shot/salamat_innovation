import * as React from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { BarcodeHistoryRow as BarcodeHistoryRecord } from "@/types/barcodes";
import { formatBarcodeDateTime } from "@/utils/barcodeRules";
import { BarcodeProductCell } from "../shared/BarcodeProductCell";
import { BarcodeStatusBadge } from "../shared/BarcodeStatusBadge";
import { BarcodeRowActions } from "../shared/BarcodeRowActions";

interface BarcodeHistoryRowProps {
    row: BarcodeHistoryRecord;
    visibleColumns: Record<string, boolean>;
    /** Receives the barcode id (not the event row id). */
    onView: (barcodeId: string) => void;
}

const EMPTY = <span className="text-sm text-brand-subtext/60">—</span>;

/** One lifecycle event. Read-only: History is a factual log. */
export const BarcodeHistoryRow = React.memo(function BarcodeHistoryRow({ row, visibleColumns, onView }: BarcodeHistoryRowProps) {
    return (
        <TableRow className="hover:bg-brand-bg/50 transition-colors">
            {visibleColumns.productName !== false && (
                <TableCell>
                    <BarcodeProductCell productName={row.productName} variant={row.variant} image={row.image} />
                </TableCell>
            )}

            {visibleColumns.serialNumber !== false && <TableCell><span className="text-sm text-brand-subtext">{row.serialNumber}</span></TableCell>}

            {visibleColumns.pricing !== false && (
                <TableCell>
                    {row.price === null ? EMPTY : (
                        <span className={`text-sm ${row.eventType === "Sold" ? "text-emerald-600" : "text-blue-600"}`}>
                            {row.eventType === "Sold" ? "Sale" : "Buy"}: ৳{row.price.toLocaleString()}
                        </span>
                    )}
                </TableCell>
            )}

            {visibleColumns.supplier !== false && (
                <TableCell>{row.supplier ? <span className="text-sm text-brand-text">{row.supplier}</span> : EMPTY}</TableCell>
            )}

            {visibleColumns.customer !== false && (
                <TableCell>{row.customer ? <span className="text-sm text-brand-text">{row.customer}</span> : EMPTY}</TableCell>
            )}

            {visibleColumns.status !== false && (
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <BarcodeStatusBadge status={row.eventType} />
                        <span className="text-[11px] text-brand-subtext">{formatBarcodeDateTime(row.timestamp)}</span>
                        <span className="text-[11px] text-brand-subtext">
                            {row.fromLocation ? `${row.fromLocation} → ${row.location}` : row.location} · {row.createdBy}
                        </span>
                    </div>
                </TableCell>
            )}

            <TableCell className="text-right">
                <BarcodeRowActions id={row.barcodeId} onView={onView} />
            </TableCell>
        </TableRow>
    );
});

BarcodeHistoryRow.displayName = "BarcodeHistoryRow";
