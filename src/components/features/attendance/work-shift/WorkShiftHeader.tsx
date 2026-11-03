"use client";
import { Button } from "@/components/ui/Button";
import { Plus, ArrowLeftRight } from "lucide-react";

interface WorkShiftHeaderProps {
    activeTab: "templates" | "roster" | "swaps";
    setActiveTab: (tab: "templates" | "roster" | "swaps") => void;
    shiftCount: number;
    employeeCount: number;
    swapCount: number;
    onAddShift: () => void;
    onNewSwap: () => void;
}

export function WorkShiftHeader({
    activeTab,
    setActiveTab,
    shiftCount,
    employeeCount,
    swapCount,
    onAddShift,
    onNewSwap
}: WorkShiftHeaderProps) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Work Shift</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Manage shift templates, assign employee rosters (synced with Attendance Report), and approve shift swaps.
                </p>
            </div>

            <div className="flex items-center gap-2.5">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                    <button
                        onClick={() => setActiveTab("templates")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "templates" ? "bg-brand-primary text-white" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Shift Templates ({shiftCount})
                    </button>
                    <button
                        onClick={() => setActiveTab("roster")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "roster" ? "bg-brand-primary text-white" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Weekly Roster ({employeeCount})
                    </button>
                    <button
                        onClick={() => setActiveTab("swaps")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "swaps" ? "bg-brand-primary text-white" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Swap Requests ({swapCount})
                    </button>
                </div>

                {activeTab === "swaps" && (
                    <Button
                        variant="outline"
                        onClick={onNewSwap}
                        className="h-9 bg-white flex items-center gap-1.5"
                    >
                        <ArrowLeftRight className="w-3.5 h-3.5" /> New Swap Request
                    </Button>
                )}

                <Button
                    variant="default"
                    onClick={onAddShift}
                    className="h-9 flex items-center gap-1.5"
                >
                    <Plus className="w-4 h-4" /> Add Work Shift
                </Button>
            </div>
        </div>
    );
}