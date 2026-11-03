"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { BreakTimePolicy } from "@/types/attendance.types";
import { toast } from "sonner";

export function useBreakTimeManager() {
    const store = useGlobalAttendanceStore();
    const [activeDrawer, setActiveDrawer] = useState<"none" | "add" | "edit">("none");
    const [activeId, setActiveId] = useState<string | null>(null);

    const getActiveBreak = () => store.breakPolicies.find((b: BreakTimePolicy) => b.id === activeId) || null;
    const openAddDrawer = () => { setActiveId(null); setActiveDrawer("add"); };
    const openEditDrawer = (id: string) => { setActiveId(id); setActiveDrawer("edit"); };
    const closeDrawer = () => { setActiveDrawer("none"); setTimeout(() => setActiveId(null), 300); };

    const handleSubmit = (data: Omit<BreakTimePolicy, "id">) => {
        if (activeDrawer === "edit" && activeId) {
            store.updateBreakPolicy(activeId, data);
            toast.success("Break policy updated");
        } else {
            store.addBreakPolicy(data);
            toast.success("Break policy added");
        }
        closeDrawer();
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this break policy?")) {
            store.deleteBreakPolicy(id);
            toast.success("Break policy deleted");
        }
    };

    return {
        breakTimes: store.breakPolicies,
        activeDrawer,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        getActiveBreak,
        handleSubmit,
        handleDelete
    };
}
export type BreakTimeManagerType = ReturnType<typeof useBreakTimeManager>;