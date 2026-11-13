"use client";
import * as React from "react";
import { Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { BarcodesManager } from "@/hooks/barcode_hooks/useBarcodesManager";
import { BarcodesFilterBar } from "../shared/BarcodesFilterBar";
import { BarcodesEmptyState } from "../shared/BarcodesEmptyState";
import { BarcodeListRow } from "./BarcodeListRow";

interface BarcodeListTableProps {
    manager: BarcodesManager<"list">;
}

/** Master ledger: every barcode in every status. */
export function BarcodeListTable({ manager }: BarcodeListTableProps) {
    const { toggleSelection, openDrawer, handleDelete, canEditRecord, canDelete, sortKey, sortDirection, handleSort } = manager;

    const handleView = React.useCallback((id: string) => openDrawer("view-barcode", id), [openDrawer]);
    const handleEdit = React.useCallback((id: string) => openDrawer("edit-barcode", id), [openDrawer]);
    const handleDeleteOne = React.useCallback((id: string) => handleDelete([id]), [handleDelete]);

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <BarcodesFilterBar manager={manager} dateLabel="Created" />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1 pb-4">
                {manager.activeTabData.length === 0 ? (
                    <BarcodesEmptyState title="No barcodes found" subtitle="Generate a barcode or adjust your search and filters to see results here." />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-12 text-center">
                                <input
                                    type="checkbox"
                                    checked={manager.isAllSelected}
                                    onChange={() => toggleSelection("ALL")}
                                    className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                            </TableHeadCell>
                            <TableHeadCell sortable activeDirection={sortKey === "productName" ? sortDirection : null} onClick={() => handleSort("productName")}>Product Name</TableHeadCell>
                            <TableHeadCell sortable activeDirection={sortKey === "serialNumber" ? sortDirection : null} onClick={() => handleSort("serialNumber")}>Serial Number</TableHeadCell>
                            <TableHeadCell sortable activeDirection={sortKey === "mrp" ? sortDirection : null} onClick={() => handleSort("mrp")}>Price</TableHeadCell>
                            <TableHeadCell sortable activeDirection={sortKey === "currentLocation" ? sortDirection : null} onClick={() => handleSort("currentLocation")}>Location</TableHeadCell>
                            <TableHeadCell sortable activeDirection={sortKey === "status" ? sortDirection : null} onClick={() => handleSort("status")}>Status</TableHeadCell>
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.activeTabData.map((barcode) => (
                                <BarcodeListRow
                                    key={barcode.id}
                                    barcode={barcode}
                                    isSelected={manager.selectedIds.includes(barcode.id)}
                                    canEdit={canEditRecord(barcode)}
                                    canDelete={canDelete(barcode)}
                                    onToggleSelect={toggleSelection}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteOne}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={manager.clearSelection}>
                <button
                    onClick={manager.handleBulkDelete}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-white/10 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Selected</span>
                </button>
            </BulkActionBar>
        </div>
    );
}
