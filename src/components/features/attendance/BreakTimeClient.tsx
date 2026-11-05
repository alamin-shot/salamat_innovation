"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { BreakTimePolicy } from "@/types/attendance.types";
import { BreakTimeDrawer } from "./drawers/BreakTimeDrawer";
import { LogFloorBreakDrawer } from "./drawers/LogFloorBreakDrawer";
import { BreakTimeHeader } from "./break-time/BreakTimeHeader";
import { BreakTimePoliciesTable } from "./break-time/BreakTimePoliciesTable";
import { BreakTimeLiveTable } from "./break-time/BreakTimeLiveTable";
import { toast } from "sonner";

export function BreakTimeClient() {
    const store = useGlobalAttendanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"policies" | "live">("policies");
    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activePolicy, setActivePolicy] = useState<BreakTimePolicy | null>(null);
    const [isLogBreakOpen, setIsLogBreakOpen] = useState(false);

    const filteredPolicies = store.breakPolicies.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this break time policy?")) {
            store.deleteBreakPolicy(id);
            toast.success("Break time deleted");
        }
    };

    const handleSavePolicy = (payload: Omit<BreakTimePolicy, "id">) => {
        if (drawerMode === "edit" && activePolicy) {
            store.updateBreakPolicy(activePolicy.id, payload);
            toast.success("Break time updated");
        } else {
            store.addBreakPolicy(payload);
            toast.success("Break time added");
        }
        setDrawerMode("none");
    };

    const handleEndLiveBreak = (id: string, employeeName: string, elapsedMinutes: number) => {
        store.endLiveBreakSession(id);
        toast.success(`Completed break & synced ${elapsedMinutes}m to ${employeeName}'s Attendance Log`);
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">
            <BreakTimeHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                policyCount={store.breakPolicies.length}
                liveCount={store.liveBreaks.length}
                onSimulateTick={() => {
                    store.tickLiveBreaks();
                    toast.info("Advanced active break timers by +1 minute");
                }}
                onLogFloorBreak={() => setIsLogBreakOpen(true)}
                onAddPolicy={() => {
                    setActivePolicy(null);
                    setDrawerMode("add");
                }}
            />

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm w-full">
                <div className="p-4 border-b border-gray-100">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="erp-input w-full sm:max-w-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {activeTab === "policies" ? (
                    <BreakTimePoliciesTable
                        policies={filteredPolicies}
                        onEdit={(policy) => {
                            setActivePolicy(policy);
                            setDrawerMode("edit");
                        }}
                        onDelete={handleDelete}
                    />
                ) : (
                    <BreakTimeLiveTable
                        liveBreaks={store.liveBreaks}
                        onEndBreak={handleEndLiveBreak}
                    />
                )}
            </div>

            <BreakTimeDrawer
                isOpen={drawerMode !== "none"}
                mode={drawerMode === "edit" ? "edit" : "add"}
                activePolicy={activePolicy}
                onClose={() => setDrawerMode("none")}
                onSave={handleSavePolicy}
            />

            <LogFloorBreakDrawer
                isOpen={isLogBreakOpen}
                employees={store.employees}
                breakPolicies={store.breakPolicies}
                onClose={() => setIsLogBreakOpen(false)}
                onStartBreak={(empId, policyId) => {
                    store.startLiveBreakSession(empId, policyId);
                    toast.success("Floor break started");
                    setIsLogBreakOpen(false);
                    setActiveTab("live");
                }}
            />
        </div>
    );
}