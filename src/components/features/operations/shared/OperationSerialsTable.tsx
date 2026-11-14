import * as React from "react";
import { Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { OperationSerial } from "@/types/operations";

interface OperationSerialsTableProps<T extends OperationSerial> {
    title: string;
    serials: T[];
    /** Extra right-hand column, e.g. the damaged unit's stock status. */
    extraColumn?: { label: string; render: (serial: T) => React.ReactNode };
    /** Present on create forms: a Trash button per row. */
    onRemove?: (id: string) => void;
    emptyText?: string;
}

const HEAD = "font-bold text-[11px] text-gray-400 uppercase tracking-wider";

/** Serial list shared by the Stock Transfer and Damage drawers (view and create). */
export function OperationSerialsTable<T extends OperationSerial>({ title, serials, extraColumn, onRemove, emptyText = "No serials added yet." }: OperationSerialsTableProps<T>) {
    const columnCount = 5 + (extraColumn ? 1 : 0) + (onRemove ? 1 : 0);
    return (
        <div className="flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
            <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200">
                <h3 className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">{title} ({serials.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableHeadCell className={`${HEAD} w-12 pl-4`}>#</TableHeadCell>
                        <TableHeadCell className={HEAD}>Serial No.</TableHeadCell>
                        <TableHeadCell className={HEAD}>Product</TableHeadCell>
                        <TableHeadCell className={HEAD}>SKU</TableHeadCell>
                        <TableHeadCell className={HEAD}>Variant</TableHeadCell>
                        {extraColumn && <TableHeadCell className={HEAD}>{extraColumn.label}</TableHeadCell>}
                        {onRemove && <TableHeadCell className="w-16"><span className="sr-only">Remove</span></TableHeadCell>}
                    </TableHeader>
                    <TableBody>
                        {serials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center py-8 text-[13px] text-gray-500">{emptyText}</TableCell>
                            </TableRow>
                        ) : serials.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="pl-4 text-[13px] text-gray-500">{index + 1}</TableCell>
                                <TableCell className="text-[13px] font-medium text-blue-600">{item.serialNo}</TableCell>
                                <TableCell className="text-[13px] font-medium text-gray-800">{item.product}</TableCell>
                                <TableCell className="text-[13px] text-gray-600">{item.sku}</TableCell>
                                <TableCell>
                                    <span className="rounded border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-600">{item.variant}</span>
                                </TableCell>
                                {extraColumn && <TableCell>{extraColumn.render(item)}</TableCell>}
                                {onRemove && (
                                    <TableCell className="text-right pr-4">
                                        <Button size="icon-sm" variant="destructive-ghost" onClick={() => onRemove(item.id)} title="Remove serial">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                    <tfoot className="bg-gray-50/50 border-t border-gray-100">
                        <tr>
                            <td colSpan={columnCount} className="px-4 py-3 text-[12px] font-semibold text-gray-600">Total: {serials.length} serials</td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
}
