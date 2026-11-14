import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Pagination } from "@/components/ui/Pagination";
import { useStockTransfersManager } from "@/hooks/operations_hooks/useStockTransfersManager";
import { SpokeToolbar } from "../../shared/SpokeToolbar";
import { StockTransferTable } from "./StockTransferTable";
import { ViewStockTransferDrawer } from "./ViewStockTransferDrawer";
import { CreateStockTransferForm } from "./CreateStockTransferForm";

/** Stock Transfer spoke of the Operations hub. Owns its store, manager and drawers. */
export function StockTransferSpoke() {
    const { table, drawers, viewed, decide } = useStockTransfersManager();

    return (
        <>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden">
                <SpokeToolbar
                    searchQuery={table.searchQuery}
                    onSearchChange={table.setSearchQuery}
                    searchPlaceholder="Search ref, shop, status or serial"
                    actionLabel="New Transfer"
                    onAction={drawers.openCreateDrawer}
                />
                <StockTransferTable rows={table.paginatedData} onView={drawers.openViewDrawer} />
                <Pagination
                    currentPage={table.currentPage}
                    totalPages={table.totalPages}
                    onPageChange={table.setCurrentPage}
                    itemsPerPage={table.itemsPerPage}
                    onItemsPerPageChange={table.setItemsPerPage}
                />
            </div>

            <ViewStockTransferDrawer transfer={viewed} isOpen={drawers.isViewOpen} onClose={drawers.closeDrawer} onDecide={decide} />

            <Drawer title="Create Stock Transfer" isOpen={drawers.isCreateOpen} onClose={drawers.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
                {drawers.isCreateOpen && (
                    <div className="pb-32">
                        <CreateStockTransferForm onCancel={drawers.closeDrawer} onCreated={drawers.closeDrawer} />
                    </div>
                )}
            </Drawer>
        </>
    );
}
