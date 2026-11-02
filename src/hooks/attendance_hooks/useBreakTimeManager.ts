"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { BreakTimeConfig } from "@/types/attendance.types";
import { toast } from "sonner";

export function useBreakTimeManager() {
    const store = useGlobalAttendanceStore();
    const [activeDrawer, setActiveDrawer] = useState<"none" | "add" | "edit">("none");
    const [activeId, setActiveId] = useState<string | null>(null);

    const getActiveBreak = () => store.breakTimes.find(b => b.id === activeId) || null;
    const openAddDrawer = () => { setActiveId(null); setActiveDrawer("add"); };
    const openEditDrawer = (id: string) => { setActiveId(id); setActiveDrawer("edit"); };
    const closeDrawer = () => { setActiveDrawer("none"); setTimeout(() => setActiveId(null), 300); };

    const handleSubmit = (data: Omit<BreakTimeConfig, "id">) => {
        if (activeDrawer === "edit" && activeId) { store.updateBreakTime(activeId, data); toast.success("Updated"); }
        else { store.addBreakTime(data); toast.success("Added"); }
        closeDrawer();
    };

    const handleDelete = (id: string) => { if (confirm("Delete this break config?")) { store.deleteBreakTime(id); toast.success("Deleted"); } };

    return { breakTimes: store.breakTimes, activeDrawer, openAddDrawer, openEditDrawer, closeDrawer, getActiveBreak, handleSubmit, handleDelete };
}
export type BreakTimeManagerType = ReturnType<typeof useBreakTimeManager>;