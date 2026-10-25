"use client";
import { useSharedSeoManager } from "@/hooks/seo_hooks/useSharedSeoManager";
import { useSharedSeoForm } from "@/hooks/seo_hooks/useSharedSeoForm";
import { SharedSeoTable } from "./SharedSeoTable";
import { SharedSeoToolbar } from "./SharedSeoToolbar";
import { SharedSeoFormDrawer } from "./SharedSeoFormDrawer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { SeoPlatform } from "@/store/useSeoStore";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { FileText, Package, FolderTree, Tag, Trash2 } from "lucide-react";

export function SharedSeoClient({ platform }: { platform: SeoPlatform }) {
    const manager = useSharedSeoManager(platform);
    const form = useSharedSeoForm(platform, manager.currentTab, manager.activeEditRecord, manager.closeView);
    const { setTab } = useCommandParams();

    const tabs = [
        { id: "pages", label: "Pages", icon: FileText },
        { id: "products", label: "Products", icon: Package },
        { id: "categories", label: "Categories", icon: FolderTree },
        { id: "brands", label: "Brands", icon: Tag },
    ];

    return (
        <div className="flex flex-col w-full h-full gap-6">
            <h1 className="text-xl font-bold text-gray-900 capitalize">{platform} Pages</h1>

            <div className="flex flex-col md:flex-row gap-6 h-full">
                <div className="w-full md:w-64 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
                    <nav className="flex flex-col gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = manager.currentTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex-1 erp-card flex flex-col p-0 sm:p-0 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-gray-800 capitalize">{manager.currentTab}</h2>
                        <SharedSeoToolbar manager={manager} />
                    </div>
                    <SharedSeoTable manager={manager} />
                </div>
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