import * as React from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Barcode } from "@/types/barcodes";
import { formatBarcodeMoney } from "@/utils/barcodeRules";
import { BarcodeProductCell } from "../shared/BarcodeProductCell";
import { BarcodeStatusBadge } from "../shared/BarcodeStatusBadge";
import { BarcodeRowActions } from "../shared/BarcodeRowActions";

interface GeneratedBarcodeRowProps {
    barcode: Barcode;
    isSelected: boolean;
    visibleColumns: Record<string, boolean>;
    canEdit: boolean;
    canDelete: boolean;
    onToggleSelect: (id: string) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const GeneratedBarcodeRow = React.memo(function GeneratedBarcodeRow({
    barcode, isSelected, visibleColumns, canEdit, canDelete, onToggleSelect, onView, onEdit, onDelete,
}: GeneratedBarcodeRowProps) {
    return (
        <TableRow className={isSelected ? "bg-emerald-50/50" : ""}>
            <TableCell className="text-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(barcode.id)}
                    className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
            </TableCell>

            {visibleColumns.productName !== false && (
                <TableCell>
                    <BarcodeProductCell productName={barcode.productName} variant={barcode.variant} image={barcode.image} />
                </TableCell>
            )}
            {visibleColumns.serialNumber !== false && <TableCell><span className="text-sm text-brand-subtext">{barcode.serialNumber}</span></TableCell>}
            {visibleColumns.mrp !== false && <TableCell><span className="text-sm text-brand-text">{formatBarcodeMoney(barcode.mrp)}</span></TableCell>}
            {visibleColumns.warehouse !== false && <TableCell><span className="text-sm text-brand-text">{barcode.currentLocation}</span></TableCell>}
            {visibleColumns.generatedBy !== false && <TableCell><span className="text-sm text-brand-text">{barcode.createdBy}</span></TableCell>}
            {visibleColumns.status !== false && <TableCell><BarcodeStatusBadge status={barcode.status} /></TableCell>}

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

GeneratedBarcodeRow.displayName = "GeneratedBarcodeRow";
