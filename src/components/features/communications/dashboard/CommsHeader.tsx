"use client";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";

export function CommsHeader({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Corporate Communications</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Manage global holidays, corporate events, and company-wide announcements.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 w-full sm:w-auto">
                    <button
                        onClick={() => manager.setActiveTab("list")}
                        className={`flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeTab === "list" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Timeline Feed
                    </button>
                    <button
                        onClick={() => manager.setActiveTab("calendar")}
                        className={`flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeTab === "calendar" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Calendar Grid
                    </button>
                </div>

                <div className="flex gap-2.5 w-full sm:w-auto">
                    <Button
                        variant="default"
                        onClick={() => manager.setDrawerMode("announcement")}
                        className="h-9 flex items-center justify-center gap-1.5 w-full sm:w-auto flex-1 sm:flex-none"
                    >
                        <Plus className="w-4 h-4" /> New Post
                    </Button>
                </div>
            </div>
        </div>
    );
}