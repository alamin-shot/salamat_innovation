import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Pagination } from "@/components/ui/Pagination";
import { useCashTransfersManager } from "@/hooks/operations_hooks/useCashTransfersManager";
import { SpokeToolbar } from "../../shared/SpokeToolbar";
import { CashTransferTable } from "./CashTransferTable";
import { ViewCashTransferDrawer } from "./ViewCashTransferDrawer";
import { CreateCashTransferForm } from "./CreateCashTransferForm";

/** Cash Transfer spoke of the Operations hub. Owns its store, manager and drawers. */
export function CashTransferSpoke() {
    const { table, drawers, viewed, decide } = useCashTransfersManager();

    return (
        <>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden">
                <SpokeToolbar
                    searchQuery={table.searchQuery}
                    onSearchChange={table.setSearchQuery}
                    searchPlaceholder="Search ref, shop, amount or status"
                    actionLabel="New Transfer"
                    onAction={drawers.openCreateDrawer}
                />
                <CashTransferTable rows={table.paginatedData} onView={drawers.openViewDrawer} />
                <Pagination
                    currentPage={table.currentPage}
                    totalPages={table.totalPages}
                    onPageChange={table.setCurrentPage}
                    itemsPerPage={table.itemsPerPage}
                    onItemsPerPageChange={table.setItemsPerPage}
                />
            </div>

            <ViewCashTransferDrawer transfer={viewed} isOpen={drawers.isViewOpen} onClose={drawers.closeDrawer} onDecide={decide} />

            <Drawer title="Create Cash Transfer" isOpen={drawers.isCreateOpen} onClose={drawers.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
                {drawers.isCreateOpen && (
                    <div className="pb-32">
                        <CreateCashTransferForm onCancel={drawers.closeDrawer} onCreated={drawers.closeDrawer} />
                    </div>
                )}
            </Drawer>
        </>
    );
}
