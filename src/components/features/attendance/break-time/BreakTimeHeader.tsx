"use client";
import { Button } from "@/components/ui/Button";
import { Plus, Columns, Play, Timer } from "lucide-react";

interface BreakTimeHeaderProps {
    activeTab: "policies" | "live";
    setActiveTab: (tab: "policies" | "live") => void;
    policyCount: number;
    liveCount: number;
    onSimulateTick: () => void;
    onLogFloorBreak: () => void;
    onAddPolicy: () => void;
}

export function BreakTimeHeader({
    activeTab, setActiveTab, policyCount, liveCount, onSimulateTick, onLogFloorBreak, onAddPolicy
}: BreakTimeHeaderProps) {
    return (
        // RESPONSIVE FIX: flex-col on mobile
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Break Time</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Configure break time policies and sync live floor breaks directly to daily attendance logs.
                </p>
            </div>

            {/* RESPONSIVE FIX: flex-col on tiny screens, w-full */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                {/* RESPONSIVE FIX: flex-1 for tabs to fill row */}
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab("policies")}
                        className={`flex-1 sm:flex-none justify-center px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "policies"
                            ? "bg-brand-primary text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Break Policies ({policyCount})
                    </button>
                    <button
                        onClick={() => setActiveTab("live")}
                        className={`flex-1 sm:flex-none justify-center px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "live"
                            ? "bg-brand-primary text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Live Breaks ({liveCount})
                    </button>
                </div>

                {activeTab === "live" && (
                    <div className="flex gap-2.5 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onSimulateTick}
                            className="h-9 bg-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                        >
                            <Timer className="w-3.5 h-3.5" /> +1m
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onLogFloorBreak}
                            className="h-9 bg-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                        >
                            <Play className="w-3.5 h-3.5 text-emerald-600" /> Log Break
                        </Button>
                    </div>
                )}

                <div className="flex gap-2.5 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="h-9 bg-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none hidden sm:flex">
                        <Columns className="w-3.5 h-3.5" /> Columns
                    </Button>
                    <Button
                        variant="default"
                        onClick={onAddPolicy}
                        className="h-9 flex items-center justify-center gap-1.5 w-full sm:w-auto flex-1 sm:flex-none"
                    >
                        <Plus className="w-4 h-4" /> Add Break Time
                    </Button>
                </div>
            </div>
        </div>
    );
}