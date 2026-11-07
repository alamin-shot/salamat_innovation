"use client";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { EODReconciliationBar } from "./EODReconciliationBar";
import { ClosingMasterTable } from "../tables/ClosingMasterTable";
import { Button } from "@/components/ui/Button";

import { ArrowLeft, Printer, Trash2 } from "lucide-react";
import { BulkActionBar } from "@/components/ui/BulkActionBar";

interface SpokeProps {
    manager: ReturnType<typeof useClosingManager>;
    onPrint: () => void;
}

export function ClosingSpokeView({ manager, onPrint }: SpokeProps) {

    // Format the title beautifully from the activeTab ID
    const formatTitle = (str: string) => str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <div className="flex flex-col h-full gap-4">

            {/* Spoke Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="bg-white hover:bg-gray-50 text-gray-600 shadow-2xs border-gray-200"
                        onClick={() => manager.handleRouteChange("tab", "hub")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Hub
                    </Button>
                    <h2 className="text-lg font-black text-gray-900 hidden sm:block">
                        {manager.activeTab === "daily_closings" ? "Daily Closing Operations" : `${formatTitle(manager.activeTab)}`}
                    </h2>
                </div>

                {/* Print button is only relevant on the master summary Dashboard for now */}
                {manager.activeTab === "daily_closings" && (
                    <Button variant="outline" className="bg-white shadow-2xs border-gray-200" onClick={onPrint}>
                        <Printer className="w-4 h-4 mr-2 text-brand-primary" /> Print Z-Report
                    </Button>
                )}
            </div>

            {/* Dynamic Spoke Content */}
            <div className="flex-1 flex flex-col relative h-full">
                {manager.activeTab === "daily_closings" ? (
                    <EODReconciliationBar manager={manager} />
                ) : (
                    <div className="flex flex-col h-full relative">
                        {/* Secure Bulk Action Bar Implementation */}
                        {!manager.isLocked && !manager.isSubmitted && manager.selectedIds?.length > 0 && (
                            <BulkActionBar
                                selectedCount={manager.selectedIds.length}
                                onClearSelection={() => manager.toggleSelection("ALL")}
                            >
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-rose-500 hover:bg-rose-600 border-none shadow-none text-white h-8 text-xs font-bold"
                                    onClick={() => console.log('Bulk delete executed')}
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Selected
                                </Button>
                            </BulkActionBar>
                        )}

                        <ClosingMasterTable manager={manager} />
                    </div>
                )}
            </div>
        </div>
    );
}