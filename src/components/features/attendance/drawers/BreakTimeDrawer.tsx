"use client";
import { useState, useEffect } from "react";
import { BreakTimeManagerType } from "@/hooks/attendance_hooks/useBreakTimeManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export function BreakTimeDrawer({ manager }: { manager: BreakTimeManagerType }) {
    const isOpen = manager.activeDrawer !== "none";
    const isEdit = manager.activeDrawer === "edit";
    const bt = manager.getActiveBreak();

    const [name, setName] = useState("");
    const [durationHours, setDurationHours] = useState(0);
    const [durationMinutes, setDurationMinutes] = useState(0);

    useEffect(() => {
        if (isEdit && bt) {
            setName(bt.name);
            setDurationHours(bt.durationHours);
            setDurationMinutes(bt.durationMinutes);
        } else if (manager.activeDrawer === "add") {
            setName("");
            setDurationHours(0);
            setDurationMinutes(0);
        }
    }, [isEdit, bt, manager.activeDrawer]);

    const handleSave = () => { manager.handleSubmit({ name, durationHours, durationMinutes }); };

    return (
        <Drawer
            title={isEdit ? "Update Break Time" : "Add Break Time"}
            isOpen={isOpen}
            onClose={manager.closeDrawer}
            width="w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Name <span className="text-red-500">*</span></label>
                        <input type="text" className="erp-input" placeholder="Enter break time name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Duration <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-3">
                            <input type="number" className="erp-input w-20 text-center" min={0} value={durationHours} onChange={(e) => setDurationHours(Number(e.target.value))} /> <span className="text-sm font-bold text-gray-500">h :</span>
                            <input type="number" className="erp-input w-20 text-center" min={0} max={59} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} /> <span className="text-sm font-bold text-gray-500">m</span>
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1.5 rounded">{durationHours}h {durationMinutes}m</span>
                        </div>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeDrawer}>Cancel</Button>
                    <Button variant="default" onClick={handleSave}>Save</Button>
                </div>
            </div>
        </Drawer>
    );
}