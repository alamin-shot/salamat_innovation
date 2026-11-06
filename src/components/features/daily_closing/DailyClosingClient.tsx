"use client";
import { useClosingManager, ClosingTabKey } from "@/hooks/daily_closing_hooks/useClosingManager";
import { useGlobalClosingStore } from "@/store/useGlobalClosingStore";
import { EODReconciliationBar } from "./components/EODReconciliationBar";
import { ClosingDenominationDrawer } from "./drawers/ClosingDenominationDrawer";
import { DatePicker } from "@/components/ui/DatePicker";
import { Lock, Unlock } from "lucide-react";
import { ClosingMasterTable } from "./tables/ClosingMasterTable";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { ClosingDetailDrawer } from "./drawers/ClosingDetailDrawer";
import { MasterZReportPrint } from "./print/MasterZReportPrint";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export function DailyClosingClient() {
    const manager = useClosingManager();
    const store = useGlobalClosingStore();

    // Generate dynamic badge counts for the tabs based on the active date
    const getCount = (arr: any[]) => arr.filter(t => t.date === manager.activeDate).length;

    const TABS: { id: ClosingTabKey; label: string; count?: number }[] = [
        { id: "summary", label: "EOD Dashboard" },
        { id: "sale", label: "Sales", count: getCount(store.sales) },
        { id: "purchase", label: "Purchases", count: getCount(store.purchases) },
        { id: "withdrawal", label: "Withdrawals", count: getCount(store.withdrawals) },
        { id: "expense", label: "Expenses", count: getCount(store.expenses) },
        { id: "deposit", label: "Deposits", count: getCount(store.deposits) },
    ];
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `EOD_ZReport_${manager.activeDate}`,
        pageStyle: "@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; } }"
    });
    return (
        <div className="flex flex-col w-full h-full gap-4 p-3 sm:p-4 bg-gray-50/50">

            {/* The Global Lock Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Daily Closing Context
                        {manager.isLocked ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><Lock className="w-3 h-3" /> Locked</span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"><Unlock className="w-3 h-3" /> Open</span>
                        )}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Reconcile all split-tenders before locking the day.</p>
                </div>

                <div className="w-full md:w-48 shrink-0">
                    <DatePicker
                        label="Closing Date"
                        value={manager.activeDate}
                        onChange={(val) => manager.handleRouteChange("date", val)}
                    />
                </div>
            </div>

            {/* Smart Navigation Ribbon */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => manager.handleRouteChange("tab", tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${manager.activeTab === tab.id
                            ? "bg-brand-primary text-white shadow-md"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${manager.activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* The Dynamic Content Area with React 19 Concurrent Fade */}
            <div className={`flex-1 flex flex-col transition-opacity duration-200 ${manager.isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                {manager.activeTab === "summary" ? (
                    <EODReconciliationBar manager={manager} />
                ) : (
                    <div className="flex flex-col gap-2 h-full relative">
                        {/* The Bulk Action Bar overlays the table if items are checked and day is NOT locked */}
                        {manager.selectedIds?.length > 0 && !manager.isLocked && (
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
                                <BulkActionBar
                                    selectedCount={manager.selectedIds.length}
                                    onClearSelection={() => manager.toggleSelection("ALL")}
                                >
                                    <Button variant="default" size="sm" onClick={() => console.log('Delete')} className="bg-rose-500 hover:bg-rose-600 border-none shadow-none">
                                        Delete Selected
                                    </Button>
                                </BulkActionBar>
                            </div>
                        )}

                        <ClosingMasterTable manager={manager} />
                    </div>
                )}

            </div>

            <ClosingDenominationDrawer manager={manager} />
            <ClosingDetailDrawer manager={manager} />
            <MasterZReportPrint ref={printRef} manager={manager} />
        </div>
    );
}