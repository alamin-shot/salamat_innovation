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
    activeTab,
    setActiveTab,
    policyCount,
    liveCount,
    onSimulateTick,
    onLogFloorBreak,
    onAddPolicy
}: BreakTimeHeaderProps) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Break Time</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Configure break time policies and sync live floor breaks directly to daily attendance logs.
                </p>
            </div>

            <div className="flex items-center gap-2.5">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                    <button
                        onClick={() => setActiveTab("policies")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "policies"
                                ? "bg-brand-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Break Policies ({policyCount})
                    </button>
                    <button
                        onClick={() => setActiveTab("live")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "live"
                                ? "bg-brand-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Live Floor Breaks ({liveCount})
                    </button>
                </div>

                {activeTab === "live" && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onSimulateTick}
                            className="h-9 bg-white flex items-center gap-1.5"
                        >
                            <Timer className="w-3.5 h-3.5" /> Simulate +1m
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onLogFloorBreak}
                            className="h-9 bg-white flex items-center gap-1.5"
                        >
                            <Play className="w-3.5 h-3.5 text-emerald-600" /> Log Floor Break
                        </Button>
                    </>
                )}

                <Button variant="outline" size="sm" className="h-9 bg-white flex items-center gap-1.5">
                    <Columns className="w-3.5 h-3.5" /> Columns
                </Button>
                <Button
                    variant="default"
                    onClick={onAddPolicy}
                    className="h-9 flex items-center gap-1.5"
                >
                    <Plus className="w-4 h-4" /> Add Break Time
                </Button>
            </div>
        </div>
    );
}