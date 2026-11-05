"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";
import { Save, X } from "lucide-react";

export function HolidayDrawer({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    const isOpen = manager.drawerMode === "holiday";
    const isEdit = !!manager.activeRecord;

    const [draft, setDraft] = useState({
        name: "",
        description: "",
        startDate: manager.selectedDate ? manager.selectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        endDate: manager.selectedDate ? manager.selectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        type: "National",
        departments: [],
        recurrence: "None"
    });

    // Reset draft when drawer opens with a selectedDate
    useEffect(() => {
        if (isOpen && !manager.activeRecord) {
            const dateStr = manager.selectedDate ? manager.selectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
            setDraft(prev => ({ ...prev, startDate: dateStr, endDate: dateStr, description: "", }));
        }
    }, [isOpen, manager.selectedDate, manager.activeRecord]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving Holiday:", draft);
        manager.setDrawerMode("none");
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            width="w-full sm:w-[calc(100vw-260px)]"
            title={isEdit ? "Update Holiday Info" : "Add Global Holiday"}
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="erp-label">Holiday Name <span className="text-rose-500">*</span></label>
                            <input type="text" className="erp-input" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} required placeholder="e.g. Eid-ul-Fitr" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Start Date (All-Day) <span className="text-rose-500">*</span></label>
                            <DatePicker value={draft.startDate} onChange={(val) => setDraft({ ...draft, startDate: val })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">End Date <span className="text-rose-500">*</span></label>
                            <DatePicker value={draft.endDate} onChange={(val) => setDraft({ ...draft, endDate: val })} />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="erp-label">Recurrence Rule</label>
                            <CustomSelect
                                value={draft.recurrence}
                                options={["None", "Yearly"]}
                                onChange={(val) => setDraft({ ...draft, recurrence: val })}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="erp-label">Description / Remarks</label>
                            <textarea className="erp-input min-h-[100px]" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Write description here..." />
                        </div>
                    </div>

                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={() => manager.setDrawerMode("none")}>
                        <X className="w-4 h-4 mr-1.5" /> Cancel
                    </Button>
                    <Button type="submit" variant="default">
                        <Save className="w-4 h-4 mr-1.5" /> Save Holiday
                    </Button>
                </div>
            </form>
        </Drawer>
    );
}