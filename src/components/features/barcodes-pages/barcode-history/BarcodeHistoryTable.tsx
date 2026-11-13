"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { ColumnsVisibilityDropdown } from "@/components/ui/ColumnsVisibilityDropdown";
import { BarcodesManager } from "@/hooks/barcode_hooks/useBarcodesManager";
import { BarcodesFilterBar } from "../shared/BarcodesFilterBar";
import { BarcodesEmptyState } from "../shared/BarcodesEmptyState";
import { BarcodeHistoryRow } from "./BarcodeHistoryRow";

interface BarcodeHistoryTableProps {
    manager: BarcodesManager<"history">;
}

const COLUMNS = [
    { key: "productName", label: "Product Name" },
    { key: "serialNumber", label: "Serial Number" },
    { key: "pricing", label: "Pricing" },
    { key: "supplier", label: "Supplier" },
    { key: "customer", label: "Customer" },
    { key: "status", label: "Status" },
];

const DEFAULT_COLUMNS: Record<string, boolean> = Object.fromEntries(COLUMNS.map((column) => [column.key, true]));

/** One row per lifecycle event, newest first. Read-only. */
export function BarcodeHistoryTable({ manager }: BarcodeHistoryTableProps) {
    const { openDrawer, sortKey, sortDirection, handleSort } = manager;
    const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>(DEFAULT_COLUMNS);

    const handleToggleColumn = (key: string) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    const handleResetColumns = () => setVisibleColumns(DEFAULT_COLUMNS);

    const handleView = React.useCallback((barcodeId: string) => openDrawer("view-barcode", barcodeId), [openDrawer]);

    return (
        <div className="flex flex-col w-full h-full relative bg-brand-bg/20">
            <div className="border-b border-brand-subtext/20 bg-white">
                <BarcodesFilterBar manager={manager} dateLabel="Event Date"
                    actions={
                        <ColumnsVisibilityDropdown
                            columns={COLUMNS}
                            visibleColumns={visibleColumns}
                            onToggleColumn={handleToggleColumn}
                            onReset={handleResetColumns}
                        />
                    }
                />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1">
                {manager.activeTabData.length === 0 ? (
                    <BarcodesEmptyState title="No history records found" subtitle="Lifecycle events appear here as barcodes are generated, printed, received, moved and sold." />
                ) : (
                    <Table>
                        <TableHeader>
                            {visibleColumns.productName !== false && <TableHeadCell sortable activeDirection={sortKey === "productName" ? sortDirection : null} onClick={() => handleSort("productName")}>Product Name</TableHeadCell>}
                            {visibleColumns.serialNumber !== false && <TableHeadCell sortable activeDirection={sortKey === "serialNumber" ? sortDirection : null} onClick={() => handleSort("serialNumber")}>Serial Number</TableHeadCell>}
                            {visibleColumns.pricing !== false && <TableHeadCell sortable activeDirection={sortKey === "price" ? sortDirection : null} onClick={() => handleSort("price")}>Pricing</TableHeadCell>}
                            {visibleColumns.supplier !== false && <TableHeadCell sortable activeDirection={sortKey === "supplier" ? sortDirection : null} onClick={() => handleSort("supplier")}>Supplier</TableHeadCell>}
                            {visibleColumns.customer !== false && <TableHeadCell sortable activeDirection={sortKey === "customer" ? sortDirection : null} onClick={() => handleSort("customer")}>Customer</TableHeadCell>}
                            {visibleColumns.status !== false && <TableHeadCell sortable activeDirection={sortKey === "timestamp" ? sortDirection : null} onClick={() => handleSort("timestamp")}>Status</TableHeadCell>}
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.activeTabData.map((row) => (
                                <BarcodeHistoryRow key={row.id} row={row} visibleColumns={visibleColumns} onView={handleView} />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
