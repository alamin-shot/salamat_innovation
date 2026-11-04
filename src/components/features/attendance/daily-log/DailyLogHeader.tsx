"use client";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Columns } from "lucide-react";

interface DailyLogHeaderProps {
    behaviorFilter: string;
    setBehaviorFilter: (val: string) => void;
    showColumnsMenu: boolean;
    setShowColumnsMenu: (val: boolean) => void;
    visibleCols: Record<string, boolean>;
    setVisibleCols: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}

export function DailyLogHeader({
    behaviorFilter, setBehaviorFilter, showColumnsMenu, setShowColumnsMenu, visibleCols, setVisibleCols
}: DailyLogHeaderProps) {
    return (
        // MOBILE FIX: flex-col on mobile, flex-row on desktop. 
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Daily Attendance Log</h1>
                <p className="text-xs text-gray-500 mt-0.5">Real-time daily biometric punches, selfie verification, and IP telemetry.</p>
            </div>

            {/* MOBILE FIX: w-full on mobile, wrap the buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none w-full sm:w-44">
                    <CustomSelect
                        value={behaviorFilter}
                        options={["All Behaviors", "Regular", "Late", "Early"]}
                        onChange={setBehaviorFilter}
                    />
                </div>
                <div className="relative flex-1 sm:flex-none">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                        className="h-9 w-full sm:w-auto bg-white flex items-center justify-center gap-1.5"
                    >
                        <Columns className="w-3.5 h-3.5" /> Columns
                    </Button>
                    {showColumnsMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-40 flex flex-col gap-2 text-xs">
                            {Object.entries(visibleCols).map(([k, v]) => (
                                <label key={k} className="flex items-center gap-2 cursor-pointer capitalize">
                                    <input type="checkbox" checked={v} onChange={() => setVisibleCols((p) => ({ ...p, [k]: !p[k] }))} className="rounded text-brand-primary" />
                                    {k.replace(/([A-Z])/g, " $1")}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}