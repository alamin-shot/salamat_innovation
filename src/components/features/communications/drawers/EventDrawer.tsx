"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";
import { Save, X } from "lucide-react";

export function EventDrawer({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    const isOpen = manager.drawerMode === "event";
    const isEdit = !!manager.activeRecord;

    const [draft, setDraft] = useState({
        eventType: "Meeting",
        title: "",
        startDateTime: "",
        endDateTime: "",
        location: "",
        status: "Live",
        capacityLimit: 0,
        description: ""
    });

    useEffect(() => {
        if (isOpen && manager.activeRecord) {
            setDraft({ ...manager.activeRecord });
        } else if (isOpen) {
            setDraft({
                eventType: "Meeting", title: "", startDateTime: "", endDateTime: "",
                location: "", status: "Live", capacityLimit: 0, description: ""
            });
        }
    }, [isOpen, manager.activeRecord]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving Event:", draft);
        manager.setDrawerMode("none");
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            width="w-full sm:w-[calc(100vw-260px)]"
            title={isEdit ? "Modify Corporate Event" : "Schedule Corporate Event"}
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="erp-label">Event Title <span className="text-rose-500">*</span></label>
                            <input type="text" className="erp-input" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} required placeholder="e.g. Annual Developers Summit" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Event Category</label>
                            <CustomSelect
                                value={draft.eventType}
                                options={["Meeting", "Training", "Offsite", "Bulk"]}
                                onChange={(val) => setDraft({ ...draft, eventType: val })}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Location</label>
                            <input type="text" className="erp-input" value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} placeholder="e.g. Main Auditorium" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Start Date & Time <span className="text-rose-500">*</span></label>
                            {/* Time-picker integration assumed within unified DatePicker or separate input */}
                            <DatePicker value={draft.startDateTime} onChange={(val) => setDraft({ ...draft, startDateTime: val })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">End Date & Time <span className="text-rose-500">*</span></label>
                            <DatePicker value={draft.endDateTime} onChange={(val) => setDraft({ ...draft, endDateTime: val })} />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="erp-label">Capacity Limit (0 for Unlimited)</label>
                            <input type="number" min="0" className="erp-input" value={draft.capacityLimit || ""} onChange={e => setDraft({ ...draft, capacityLimit: Number(e.target.value) })} placeholder="Max attendees before Waitlist" />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="erp-label">Agenda / Description</label>
                            <textarea className="erp-input min-h-[120px]" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Describe event agenda..." />
                        </div>
                    </div>

                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={() => manager.setDrawerMode("none")}>
                        <X className="w-4 h-4 mr-1.5" /> Cancel
                    </Button>
                    <Button type="submit" variant="default">
                        <Save className="w-4 h-4 mr-1.5" /> Save Event
                    </Button>
                </div>
            </form>
        </Drawer>
    );
}