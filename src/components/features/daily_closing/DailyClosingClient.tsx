"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { ClosingHubPortal } from "./components/ClosingHubPortal";
import { ClosingSpokeView } from "./components/ClosingSpokeView";
import { ClosingDenominationDrawer } from "./drawers/ClosingDenominationDrawer";
import { ClosingDetailDrawer } from "./drawers/ClosingDetailDrawer";
import { MasterZReportPrint } from "./print/MasterZReportPrint";
import { DatePicker } from "@/components/ui/DatePicker";
import { Lock, Unlock } from "lucide-react";
import { ClosingEditDrawer } from "./drawers/ClosingEditDrawer";

export function DailyClosingClient() {
    const manager = useClosingManager();
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `EOD_ZReport_${manager.activeDate}`,
        pageStyle: "@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; } }"
    });

    return (
        <div className="flex flex-col w-full h-full gap-4 p-3 sm:p-4 bg-gray-50/50">

            {/* The Global Context Lock (Always Visible) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm shrink-0">
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Daily Closing Operations
                        {manager.isLocked ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><Lock className="w-3 h-3" /> Locked</span>
                        ) : manager.isSubmitted ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Lock className="w-3 h-3" /> Submitted</span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"><Unlock className="w-3 h-3" /> Open</span>
                        )}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Select a closing date to load reconciliation context.</p>
                </div>

                <div className="w-full md:w-48 shrink-0">
                    <DatePicker
                        label="Master Closing Date"
                        value={manager.activeDate}
                        onChange={(val) => manager.handleRouteChange("date", val)}
                    />
                </div>
            </div>

            {/* The Traffic Controller (React 19 Concurrent Transition wrapper) */}
            <div className={`flex-1 transition-opacity duration-200 overflow-y-auto ${manager.isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                {manager.activeTab === "hub" ? (
                    <ClosingHubPortal manager={manager} />
                ) : (
                    <ClosingSpokeView manager={manager} onPrint={handlePrint} />
                )}
            </div>

            <ClosingEditDrawer manager={manager} />
            <ClosingDenominationDrawer manager={manager} />
            <ClosingDetailDrawer manager={manager} />
            <MasterZReportPrint ref={printRef} manager={manager} />
        </div>
    );
}