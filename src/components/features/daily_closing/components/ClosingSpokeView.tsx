"use client";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { EODReconciliationBar } from "./EODReconciliationBar";
import { ClosingMasterTable } from "../tables/ClosingMasterTable";
import { Button } from "@/components/ui/Button";
import { Printer, Trash2, Plus } from "lucide-react";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { DailyBankTable } from "../tables/DailyBankTable";

interface SpokeProps {
    manager: ReturnType<typeof useClosingManager>;
    onPrint: () => void;
}

export function ClosingSpokeView({ manager, onPrint }: SpokeProps) {


    return (
        <div className="flex flex-col h-full gap-4">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* NEW: Add Button strictly for Daily Bank */}
                    {manager.activeTab === "daily_bank" && (
                        <Button variant="default" className="bg-brand-primary text-white shadow-2xs border-none" onClick={() => { manager.setActiveRecord(null); manager.setDrawerMode("bank_form"); }} disabled={manager.isLocked || manager.isSubmitted}>
                            <Plus className="w-4 h-4 mr-2" /> Add Record
                        </Button>
                    )}

                    {manager.activeTab === "daily_closings" && (
                        <Button variant="outline" className="bg-white shadow-2xs border-gray-200" onClick={onPrint}>
                            <Printer className="w-4 h-4 mr-2 text-brand-primary" /> Print Z-Report
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col relative h-full">
                {manager.activeTab === "daily_closings" ? (
                    <EODReconciliationBar manager={manager} />
                ) : (
                    <div className="flex flex-col h-full relative">

                        {!manager.isLocked && !manager.isSubmitted && manager.selectedIds?.length > 0 && manager.activeTab !== "daily_bank" && (
                            <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={() => manager.toggleSelection("ALL")}>
                                <Button variant="default" size="sm" className="bg-rose-500 hover:bg-rose-600 border-none shadow-none text-white h-8 text-xs font-bold" onClick={() => console.log('Bulk delete executed')}>
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Selected
                                </Button>
                            </BulkActionBar>
                        )}

                        {/* NEW: Conditionally render the Bank Table or the Master Table */}
                        {manager.activeTab === "daily_bank" ? (
                            <DailyBankTable manager={manager} />
                        ) : (
                            <ClosingMasterTable manager={manager} />
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}