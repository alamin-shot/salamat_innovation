"use client";
import { useMemo } from "react";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Calculator, Check } from "lucide-react";
import { DenominationTally } from "@/types/daily_closing";

export function ClosingDenominationDrawer({ manager }: { manager: ReturnType<typeof useClosingManager> }) {
    const isOpen = manager.drawerMode === "denomination";
    const notes: (keyof DenominationTally)[] = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

    const currentTally = manager.dayState.denominations;

    // Real-time Math
    const totalCounted = useMemo(() => {
        return notes.reduce((sum, note) => sum + (note * (currentTally[note] || 0)), 0);
    }, [currentTally, notes]);

    const handleApply = () => {
        manager.updateActualTender(manager.activeDate, "Cash", totalCounted);
        manager.setDrawerMode("none");
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            title="Cash Denomination Tally"
            className="w-full sm:w-[calc(100vw-260px)] "
        >
            <div className="flex flex-col h-full bg-gray-50/50">
                <div className="p-4 sm:p-6 flex-1 overflow-y-auto">

                    <div className="flex items-center gap-3 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800">
                        <Calculator className="w-5 h-5 shrink-0" />
                        <p className="text-xs font-medium leading-relaxed">
                            Count physical notes in the drawer. The total will automatically sync to the Actual Cash field.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        {notes.map((note) => (
                            <div key={note} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-2xs hover:border-brand-primary/30 transition-colors">
                                <div className="flex items-center gap-4 w-32">
                                    <span className="text-sm font-black text-gray-700 w-12 text-right">৳{note}</span>
                                    <span className="text-xs font-bold text-gray-300">X</span>
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        min="0"
                                        className="erp-input text-center font-bold text-gray-900"
                                        value={currentTally[note] || ""}
                                        onChange={(e) => manager.updateDenomination(manager.activeDate, note, parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="w-24 text-right">
                                    <span className="text-sm font-bold text-gray-500">
                                        = <span className="text-gray-900 ml-1">{(note * (currentTally[note] || 0)).toLocaleString()}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex flex-col gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Counted</span>
                        <span className="text-2xl font-black text-emerald-600">
                            {totalCounted.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                        </span>
                    </div>
                    <Button
                        variant="default"
                        onClick={handleApply}
                        className="w-full bg-brand-primary text-white h-12 shadow-md hover:shadow-lg transition-all text-sm font-bold"
                    >
                        <Check className="w-4 h-4 mr-2" /> Apply to Cash Tender
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}