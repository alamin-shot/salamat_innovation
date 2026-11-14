import * as React from "react";
import { Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { PurchaseLineItem } from "@/types/purchases";
import { lineTotal } from "@/utils/purchaseMath";

interface PurchaseLineItemRowProps {
    item: PurchaseLineItem;
    index: number;
    /** Omit for a read-only row (e.g. a locked return). */
    onUnitPriceChange?: (id: string, unitPrice: number) => void;
    onRemove?: (id: string) => void;
}

export const PurchaseLineItemRow = React.memo(function PurchaseLineItemRow({ item, index, onUnitPriceChange, onRemove }: PurchaseLineItemRowProps) {
    return (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{item.productName}</span>
                    <span className="text-[10px] text-emerald-600">{item.variant}</span>
                </div>
            </TableCell>
            <TableCell><span className="text-[13px] text-gray-600">{item.sku}</span></TableCell>
            <TableCell><span className="text-[13px] text-gray-600">{item.serial}</span></TableCell>
            <TableCell>
                {onUnitPriceChange ? (
                    <input
                        type="number"
                        min="0"
                        aria-label={`Unit price of ${item.serial}`}
                        value={Number.isFinite(item.unitPrice) ? item.unitPrice : 0}
                        onChange={(e) => onUnitPriceChange(item.id, e.target.value === "" ? 0 : Number(e.target.value))}
                        className="w-28 rounded border border-gray-200 text-[13px] py-1.5 px-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                ) : (
                    <span className="text-[13px] text-gray-600">{item.unitPrice}</span>
                )}
            </TableCell>
            {/* One row = one Serial/IMEI, so quantity is fixed. */}
            <TableCell className="text-center">
                <span className="inline-flex h-7 w-12 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[13px] font-medium text-gray-600" title="Each Serial/IMEI is one unit">1</span>
            </TableCell>
            <TableCell className="text-right"><span className="text-[13px] text-gray-700 font-medium">{lineTotal(item).toLocaleString()}</span></TableCell>
            {onRemove && (
                <TableCell className="text-right">
                    <Button type="button" variant="destructive-ghost" size="icon-sm" onClick={() => onRemove(item.id)} title="Remove row">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
            )}
        </TableRow>
    );
});

PurchaseLineItemRow.displayName = "PurchaseLineItemRow";
