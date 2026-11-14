import * as React from "react";
import { Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { SaleReturnItem } from "@/types/sales";

interface SaleReturnItemRowProps {
    item: SaleReturnItem;
    index: number;
    onRefund: (id: string, amount: number) => void;
    onRemove: (id: string) => void;
}

export const SaleReturnItemRow = React.memo(function SaleReturnItemRow({ item, index, onRefund, onRemove }: SaleReturnItemRowProps) {
    const invalid = item.refundAmount < 0 || item.refundAmount > item.unitPrice;
    return (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700 text-[13px]">{item.productName}</span>
                    <span className="text-[10px] text-emerald-600 mt-0.5">{item.variant}</span>
                </div>
            </TableCell>
            <TableCell><span className="text-[12px] text-emerald-600">{item.sku}</span></TableCell>
            <TableCell><span className="text-[12px] text-emerald-600">{item.serial}</span></TableCell>
            <TableCell><span className="text-[12px] text-gray-600">{item.saleInvoice ?? "—"}</span></TableCell>
            <TableCell><span className="text-[13px] text-gray-600">{item.unitPrice.toLocaleString("en-IN")}</span></TableCell>
            <TableCell>
                <input
                    type="number"
                    min="0"
                    max={item.unitPrice}
                    value={item.refundAmount}
                    title="Refund for this unit (up to the price paid)"
                    onChange={(e) => onRefund(item.id, e.target.value === "" ? 0 : Number(e.target.value))}
                    className={`w-28 rounded border px-2 py-1.5 text-[13px] focus:outline-none focus:border-emerald-500 ${invalid ? "border-rose-300 bg-rose-50" : "border-gray-200"}`}
                />
            </TableCell>
            <TableCell className="text-right">
                <Button size="icon-sm" variant="destructive-ghost" onClick={() => onRemove(item.id)} title="Remove item"><Trash2 className="h-4 w-4" /></Button>
            </TableCell>
        </TableRow>
    );
});

SaleReturnItemRow.displayName = "SaleReturnItemRow";
