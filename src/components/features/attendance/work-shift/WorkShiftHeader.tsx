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
    activeTab, setActiveTab, shiftCount, employeeCount, swapCount, onAddShift, onNewSwap
}: WorkShiftHeaderProps) {
    return (
        // RESPONSIVE FIX: flex-col on mobile
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Work Shift</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Manage shift templates, assign employee rosters, and approve shift swaps.
                </p>
            </div>

            {/* RESPONSIVE FIX: flex-col on tiny screens, w-full */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                {/* RESPONSIVE FIX: flex-wrap so the 3 tabs don't squish into unreadable sizes */}
                <div className="inline-flex flex-wrap sm:flex-nowrap rounded-lg border border-gray-200 bg-white p-0.5 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab("templates")}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "templates" ? "bg-brand-primary text-white" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Templates ({shiftCount})
                    </button>
                    <button
                        onClick={() => setActiveTab("roster")}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "roster" ? "bg-brand-primary text-white" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Roster ({employeeCount})
                    </button>
                    <button
                        onClick={() => setActiveTab("swaps")}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "swaps" ? "bg-brand-primary text-white" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Swaps ({swapCount})
                    </button>
                </div>

                <div className="flex gap-2.5 w-full sm:w-auto">
                    {activeTab === "swaps" && (
                        <Button
                            variant="outline"
                            onClick={onNewSwap}
                            className="h-9 bg-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                        >
                            <ArrowLeftRight className="w-3.5 h-3.5" /> New Swap Request
                        </Button>
                    )}

                    <Button
                        variant="default"
                        onClick={onAddShift}
                        className="h-9 flex items-center justify-center gap-1.5 w-full sm:w-auto flex-1 sm:flex-none"
                    >
                        <Plus className="w-4 h-4" /> Add Work Shift
                    </Button>
                </div>
            </div>
        </div>
    );
}