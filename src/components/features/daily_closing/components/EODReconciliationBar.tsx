"use client";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";

import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertTriangle, Calculator, Lock, Send, Unlock } from "lucide-react";
import { TenderType } from "@/types/daily_closing";

export function EODReconciliationBar({ manager }: { manager: ReturnType<typeof useClosingManager> }) {
    const { expectedMath, dayState, discrepancies, isLocked, isSubmitted } = manager;
    const tenders: TenderType[] = ["cash", "bkash", "pos"];

    const isReadOnly = isLocked || isSubmitted;

    const renderTenderCard = (tender: TenderType) => {
        const expected = expectedMath[tender.toLowerCase() as keyof typeof expectedMath];
        const actual = dayState.actualTenders[tender.toLowerCase() as keyof typeof dayState.actualTenders];
        const diff = discrepancies[tender.toLowerCase() as keyof typeof discrepancies];

        const isMatch = diff === 0;
        const isShort = diff < 0;

        const borderClass = isMatch ? "border-emerald-200 ring-1 ring-emerald-100" : isShort ? "border-rose-200 ring-1 ring-rose-100" : "border-amber-200 ring-1 ring-amber-100";
        const headerBg = isMatch ? "bg-emerald-50/50 text-emerald-800" : isShort ? "bg-rose-50/50 text-rose-800" : "bg-amber-50/50 text-amber-800";
        const Icon = isMatch ? CheckCircle2 : AlertTriangle;
        const iconColor = isMatch ? "text-emerald-500" : isShort ? "text-rose-500" : "text-amber-500";

        return (
            <div key={tender} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${borderClass}`}>
                <div className={`px-4 py-2.5 flex items-center justify-between border-b border-gray-100/50 ${headerBg}`}>
                    <span className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                        <Icon className={`w-4 h-4 ${iconColor}`} /> {tender} Reconcile
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 shadow-2xs ${iconColor}`}>
                        Diff: {diff > 0 ? "+" : ""}{diff.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                    </span>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Expected</label>
                        <span className="text-lg font-black text-gray-800">
                            {expected.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 relative">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                            Actual Count
                            {tender === "cash" && !isReadOnly && (
                                <button
                                    onClick={() => manager.setDrawerMode("denomination")}
                                    className="text-brand-primary hover:text-brand-primary/80 flex items-center gap-0.5 transition-colors"
                                    title="Count Denominations"
                                >
                                    <Calculator className="w-3.5 h-3.5" /> <span className="text-[9px]">TALLY</span>
                                </button>
                            )}
                        </label>
                        {isReadOnly ? (
                            <span className={`text-lg font-black ${isMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {actual.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                            </span>
                        ) : (
                            <input
                                type="number"
                                className="erp-input font-bold text-gray-900 h-8"
                                value={actual || ""}
                                onChange={(e) => manager.updateActualTender(manager.activeDate, tender, Number(e.target.value))}
                                placeholder="0.00"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* The 3-Way Split Tender Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {tenders.map(renderTenderCard)}
            </div>

            {/* Maker-Checker Action Bar */}
            <div className="erp-card bg-white p-3 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">EOD Status: <span className="uppercase text-gray-500">{dayState.status}</span></span>
                    {dayState.preparedBy && <span className="text-xs text-gray-500">Prepared by: {dayState.preparedBy}</span>}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {dayState.status === "open" && (
                        <Button
                            variant="default"
                            className="w-full sm:w-auto bg-brand-primary text-white shadow-2xs"
                            onClick={() => manager.submitClosing(manager.activeDate, "Cashier_User", "Submitted for review")}
                        >
                            <Send className="w-4 h-4 mr-2" /> Submit Closing
                        </Button>
                    )}
                    {dayState.status === "submitted" && (
                        <Button
                            variant="default"
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                            onClick={() => manager.approveAndLockClosing(manager.activeDate, "Admin_User")}
                        >
                            <Lock className="w-4 h-4 mr-2" /> Approve & Lock Day
                        </Button>
                    )}
                    {dayState.status === "locked" && (
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => manager.unlockClosing(manager.activeDate, "Admin_User")}
                        >
                            <Unlock className="w-4 h-4 mr-2" /> Admin Unlock
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}