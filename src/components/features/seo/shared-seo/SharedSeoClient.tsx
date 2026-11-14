"use client";
import { useSharedSeoManager } from "@/hooks/seo_hooks/useSharedSeoManager";
import { useSharedSeoForm } from "@/hooks/seo_hooks/useSharedSeoForm";
import { SharedSeoTable } from "./SharedSeoTable";
import { SharedSeoToolbar } from "./SharedSeoToolbar";
import { SharedSeoFormDrawer } from "./SharedSeoFormDrawer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { SeoPlatform, SeoTabType } from "@/store/useSeoStore";
import { Trash2 } from "lucide-react";

/** One Page Metadata section as a full page (the section comes from the route). */
export function SharedSeoClient({ platform, section }: { platform: SeoPlatform; section: SeoTabType }) {
    const manager = useSharedSeoManager(platform, section);
    const form = useSharedSeoForm(platform, manager.currentTab, manager.activeEditRecord, manager.closeView);

    return (
        <div className="flex flex-col w-full gap-2">
            <div className="erp-card flex flex-col p-0 sm:p-0 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col gap-4">
                    <SharedSeoToolbar manager={manager} />
                </div>
                <SharedSeoTable manager={manager} />
            </div>

            <SharedSeoFormDrawer
                isOpen={manager.activeDrawer === "seo-form"}
                onClose={manager.closeView}
                form={form}
                tab={manager.currentTab}
            />

            <ConfirmModal
                isOpen={manager.confirmModal.isOpen}
                title={manager.confirmModal.title}
                message={manager.confirmModal.message}
                onConfirm={manager.confirmModal.onConfirm}
                onCancel={manager.closeConfirm}
            />

            <BulkActionBar
                selectedCount={manager.table.selectedIds.length}
                onClearSelection={manager.table.clearSelection}
            >
                <button
                    onClick={manager.handleBulkDelete}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                </button>
            </BulkActionBar>
        </div>
    );
}