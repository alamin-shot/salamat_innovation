import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { PurchaseLineItem } from "@/types/purchases";
import { PurchaseLineItemRow } from "./PurchaseLineItemRow";

interface PurchaseLineItemsTableProps {
    items: PurchaseLineItem[];
    onUnitPriceChange?: (id: string, unitPrice: number) => void;
    onRemove?: (id: string) => void;
    quantityLabel?: string;
    totalLabel?: string;
    emptyText?: string;
}

const HEAD = "bg-gray-50/80 font-semibold text-gray-600";

/** Invoice rows shared by Add / Edit Purchase and Add / Edit Purchase Return. */
export function PurchaseLineItemsTable({
    items, onUnitPriceChange, onRemove, quantityLabel = "Quantity", totalLabel = "Total Price", emptyText = "No products added",
}: PurchaseLineItemsTableProps) {
    const columns = onRemove ? 8 : 7;
    return (
        <div className="rounded border border-gray-200 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableHeadCell className={`w-12 ${HEAD}`}>SL</TableHeadCell>
                    <TableHeadCell className={HEAD}>Product Name</TableHeadCell>
                    <TableHeadCell className={HEAD}>SKU</TableHeadCell>
                    <TableHeadCell className={HEAD}>Serial/IMEI no.</TableHeadCell>
                    <TableHeadCell className={HEAD}>Unit Price</TableHeadCell>
                    <TableHeadCell className={`text-center w-[120px] ${HEAD}`}>{quantityLabel}</TableHeadCell>
                    <TableHeadCell className={`text-right ${HEAD}`}>{totalLabel}</TableHeadCell>
                    {onRemove && <TableHeadCell className={`text-right w-[80px] ${HEAD}`}>Action</TableHeadCell>}
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns} className="text-center py-8 text-[13px] text-gray-500">{emptyText}</TableCell>
                        </TableRow>
                    ) : (
                        items.map((item, index) => (
                            <PurchaseLineItemRow key={item.id} item={item} index={index} onUnitPriceChange={onUnitPriceChange} onRemove={onRemove} />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
