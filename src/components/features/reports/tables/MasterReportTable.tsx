"use client";
import { useReportManager } from "@/hooks/report_hooks/useReportManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Eye, Printer } from "lucide-react";

export function MasterReportTable({ manager }: { manager: ReturnType<typeof useReportManager> }) {
    const { paginatedData, currentColumns, aggregates } = manager;

    return (
        <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm">
            {/* The Wrapper prevents CustomSelect dropdowns from clipping */}
            <div className="flex-1 overflow-x-auto min-h-[500px] pb-32 relative">
                <Table containerClassName="w-full">
                    <TableHeader>
                        <TableHeadCell className="w-10 text-center">
                            <input type="checkbox" className="rounded text-brand-primary" />
                        </TableHeadCell>
                        {currentColumns.map(col => {
                            if (manager.columnVisibility[col.id] === false) return null;
                            return (
                                <TableHeadCell key={col.id} className={col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}>
                                    {col.label}
                                </TableHeadCell>
                            );
                        })}
                        <TableHeadCell className="text-right w-24">Actions</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={currentColumns.length + 2} className="text-center py-10 text-gray-500">
                                    No data found for the selected criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((row, idx) => (
                                <TableRow key={row.id || idx} className="hover:bg-gray-50/70 group">
                                    <TableCell className="text-center w-10">
                                        <input type="checkbox" className="rounded text-brand-primary" />
                                    </TableCell>

                                    {currentColumns.map(col => {
                                        if (manager.columnVisibility[col.id] === false) return null;

                                        const cellValue = row[col.id];
                                        const alignmentClass = col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left";

                                        return (
                                            <TableCell key={col.id} className={alignmentClass}>
                                                {/* CELL RENDERER FACTORY */}
                                                {col.renderType === "currency" && (
                                                    <span className="font-mono text-xs font-bold text-gray-900">
                                                        ৳{Number(cellValue || 0).toLocaleString()}
                                                    </span>
                                                )}

                                                {col.renderType === "date" && (
                                                    <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
                                                        {new Date(cellValue).toLocaleDateString()}
                                                    </span>
                                                )}

                                                {col.renderType === "badge" && (
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${cellValue === "Paid" || cellValue === "Approved" ? "bg-emerald-100 text-emerald-700" :
                                                        cellValue === "Due" || cellValue === "Missing" ? "bg-rose-100 text-rose-700" :
                                                            "bg-amber-100 text-amber-700"
                                                        }`}>
                                                        {cellValue?.replace("_", " ")}
                                                    </span>
                                                )}

                                                {col.renderType === "text" && (
                                                    <span className="text-xs text-gray-700">
                                                        {cellValue || "-"}
                                                    </span>
                                                )}
                                            </TableCell>
                                        );
                                    })}

                                    <TableCell className="text-right w-24">
                                        {/* STRICT RULE: Zero 3-Dot Menus. Inline Ghost Actions Only. */}
                                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon-sm" title="View Line Items" onClick={() => {
                                                manager.setActiveRecord(row);
                                                manager.setDrawerMode("detail");
                                            }}>
                                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" title="Print Entry">
                                                <Printer className="w-3.5 h-3.5 text-gray-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* THE STICKY AGGREGATE FOOTER */}
                {paginatedData.length > 0 && (
                    <div className="sticky bottom-0 bg-gray-100 border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] w-full flex items-center p-0">
                        <table className="w-full">
                            <tbody>
                                <tr className="text-xs font-black uppercase tracking-wider text-gray-800">
                                    <td className="w-10 px-4 py-3 text-center">-</td>
                                    {currentColumns.map((col, idx) => {
                                        if (manager.columnVisibility[col.id] === false) return null;

                                        // Find the first valid string column to anchor the "GRAND TOTAL" label
                                        const isLabelAnchor = idx === 1;

                                        return (
                                            <td key={col.id} className={`px-4 py-3 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}>
                                                {isLabelAnchor ? "Grand Total" :
                                                    aggregates[col.id] !== undefined
                                                        ? col.renderType === "currency" ? `৳${aggregates[col.id].toLocaleString()}` : aggregates[col.id]
                                                        : ""}
                                            </td>
                                        );
                                    })}
                                    <td className="w-24 px-4 py-3 text-right"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* STRICT RULE: Pagination at the very bottom, wired strictly to manager state */}
            <div className="border-t border-gray-100 bg-white z-10">
                <Pagination
                    currentPage={manager.currentPage}
                    totalPages={Math.max(1, Math.ceil(manager.filteredData.length / manager.perPage))}
                    perPage={manager.perPage}
                    onPageChange={manager.setCurrentPage}
                    onPerPageChange={(v) => { manager.setPerPage(v); manager.setCurrentPage(1); }}
                />
            </div>
        </div>
    );
}