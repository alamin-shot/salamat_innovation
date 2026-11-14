import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Pagination } from "@/components/ui/Pagination";
import { useDamageProductsManager } from "@/hooks/operations_hooks/useDamageProductsManager";
import { SpokeToolbar } from "../../shared/SpokeToolbar";
import { DamageProductTable } from "./DamageProductTable";
import { ViewDamageProductDrawer } from "./ViewDamageProductDrawer";
import { CreateDamageProductForm } from "./CreateDamageProductForm";

/** Damage Products spoke of the Operations hub. Owns its store, manager and drawers. */
export function DamageProductsSpoke() {
    const { table, drawers, viewed, decide } = useDamageProductsManager();

    return (
        <>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden">
                <SpokeToolbar
                    searchQuery={table.searchQuery}
                    onSearchChange={table.setSearchQuery}
                    searchPlaceholder="Search ref, shop, status or serial"
                    actionLabel="Record Damage"
                    onAction={drawers.openCreateDrawer}
                />
                <DamageProductTable rows={table.paginatedData} onView={drawers.openViewDrawer} />
                <Pagination
                    currentPage={table.currentPage}
                    totalPages={table.totalPages}
                    onPageChange={table.setCurrentPage}
                    itemsPerPage={table.itemsPerPage}
                    onItemsPerPageChange={table.setItemsPerPage}
                />
            </div>

            <ViewDamageProductDrawer record={viewed} isOpen={drawers.isViewOpen} onClose={drawers.closeDrawer} onDecide={decide} />

            <Drawer title="Record Damage Product" isOpen={drawers.isCreateOpen} onClose={drawers.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
                {drawers.isCreateOpen && (
                    <div className="pb-32">
                        <CreateDamageProductForm onCancel={drawers.closeDrawer} onCreated={drawers.closeDrawer} />
                    </div>
                )}
            </Drawer>
        </>
    );
}
