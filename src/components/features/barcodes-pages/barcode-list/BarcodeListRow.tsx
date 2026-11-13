import * as React from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Barcode } from "@/types/barcodes";
import { formatBarcodeDateTime, formatBarcodeMoney } from "@/utils/barcodeRules";
import { BarcodeProductCell } from "../shared/BarcodeProductCell";
import { BarcodeStatusBadge } from "../shared/BarcodeStatusBadge";
import { BarcodeRowActions } from "../shared/BarcodeRowActions";

interface BarcodeListRowProps {
    barcode: Barcode;
    isSelected: boolean;
    canEdit: boolean;
    canDelete: boolean;
    onToggleSelect: (id: string) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const BarcodeListRow = React.memo(function BarcodeListRow({
    barcode, isSelected, canEdit, canDelete, onToggleSelect, onView, onEdit, onDelete,
}: BarcodeListRowProps) {
    const lastEvent = barcode.lifecycleEvents[barcode.lifecycleEvents.length - 1];

    return (
        <TableRow className={`hover:bg-brand-bg/50 transition-colors ${isSelected ? "bg-emerald-50/50" : ""}`}>
            <TableCell className="w-12 text-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(barcode.id)}
                    className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
            </TableCell>

            <TableCell>
                <BarcodeProductCell productName={barcode.productName} variant={barcode.variant} image={barcode.image} />
            </TableCell>

            <TableCell>
                <span className="text-sm text-brand-subtext">{barcode.serialNumber}</span>
            </TableCell>

            <TableCell>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-brand-text">{formatBarcodeMoney(barcode.mrp)}</span>
                    <span className="text-[11px] text-brand-subtext">{formatBarcodeDateTime(barcode.createdAt)}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-brand-text">{barcode.currentLocation}</span>
                    <span className="text-[11px] text-brand-subtext">{formatBarcodeDateTime(lastEvent.timestamp)}</span>
                </div>
            </TableCell>

            <TableCell>
                <BarcodeStatusBadge status={barcode.status} />
            </TableCell>

            <TableCell className="text-right">
                <BarcodeRowActions
                    id={barcode.id}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            </TableCell>
        </TableRow>
    );
});

BarcodeListRow.displayName = "BarcodeListRow";
