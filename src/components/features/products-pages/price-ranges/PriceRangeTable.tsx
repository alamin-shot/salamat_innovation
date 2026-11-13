import * as React from "react";
import { Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { PriceRangeAnalysis } from "@/hooks/products_hooks/usePriceRangeAnalysis";
import { PriceRangeBounds } from "@/types/products";
import { AuditHeadCells } from "../shared/AuditCells";
import { ProductsEmptyState } from "../shared/ProductsEmptyState";
import { ProductsFilterBar } from "../shared/ProductsFilterBar";
import { PriceRangeRow } from "./PriceRangeRow";
import { PriceRangeCoverageStrip } from "./PriceRangeCoverageStrip";

interface PriceRangeTableProps {
    manager: ProductsManager<"price_ranges">;
    analysis: PriceRangeAnalysis;
}

const NO_OVERLAPS: never[] = [];

export function PriceRangeTable({ manager, analysis }: PriceRangeTableProps) {
    const { toggleSelection, handleSetStatus, handleDelete, openDrawer, sortKey, sortDirection, handleSort } = manager;
    const { ranges, scaleMax, overlapsById } = analysis;

    const handleEdit = React.useCallback((id: string) => openDrawer("modal", "edit", id), [openDrawer]);
    const handleDeleteOne = React.useCallback((id: string) => handleDelete([id]), [handleDelete]);

    // Per row: the other Active ranges, drawn faintly behind its bar. Stable per store change, so rows stay memoised.
    const ghostsById = React.useMemo(() => {
        const active = ranges.filter((range) => range.status === "Active");
        const map: Record<string, PriceRangeBounds[]> = {};
        ranges.forEach((range) => {
            map[range.id] = active
                .filter((other) => other.id !== range.id)
                .map((other) => ({ minPrice: other.minPrice, maxPrice: other.maxPrice }));
        });
        return map;
    }, [ranges]);

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <ProductsFilterBar manager={manager} />
            </div>

            <PriceRangeCoverageStrip analysis={analysis} />

            <div className="overflow-x-auto custom-scrollbar flex-1 pb-16">
                {manager.activeTabData.length === 0 ? (
                    <ProductsEmptyState title="No price ranges found" subtitle="Add a price range or adjust your search and filters to see results here." />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-[48px] px-4">
                                <input
                                    type="checkbox"
                                    checked={manager.isAllSelected}
                                    onChange={() => toggleSelection("ALL")}
                                    className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                />
                            </TableHeadCell>
                            <TableHeadCell sortable activeDirection={sortKey === "label" ? sortDirection : null} onClick={() => handleSort("label")}>Range Label</TableHeadCell>
                            <TableHeadCell sortable activeDirection={sortKey === "minPrice" ? sortDirection : null} onClick={() => handleSort("minPrice")}>Price Range</TableHeadCell>
                            <TableHeadCell sortable activeDirection={sortKey === "productCount" ? sortDirection : null} onClick={() => handleSort("productCount")}>Product Count</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <AuditHeadCells />
                            <TableHeadCell className="text-right w-[100px]">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.activeTabData.map((record) => (
                                <PriceRangeRow
                                    key={record.id}
                                    record={record}
                                    scaleMax={scaleMax}
                                    overlaps={overlapsById[record.id] ?? NO_OVERLAPS}
                                    ghosts={ghostsById[record.id] ?? NO_OVERLAPS}
                                    isSelected={manager.selectedIds.includes(record.id)}
                                    onToggleSelect={toggleSelection}
                                    onSetStatus={handleSetStatus}
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
                    type="button"
                    onClick={manager.handleBulkDelete}
                    className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Delete All</span>
                </button>
            </BulkActionBar>
        </div>
    );
}
