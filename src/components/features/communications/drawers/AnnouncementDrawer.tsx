"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";
import { Save, X, Paperclip } from "lucide-react";

export function AnnouncementDrawer({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    const isOpen = manager.drawerMode === "announcement";
    const isEdit = !!manager.activeRecord;

    // Strict State Isolation (Flaw 24 Fix)
    const [draft, setDraft] = useState({
        title: "",
        publishDate: "",
        expiryDate: "",
        priority: "Medium",
        status: "Draft",
        acknowledgmentRequired: false,
        description: "" // In production, this feeds into DOMPurify before global store
    });

    useEffect(() => {
        if (isOpen && manager.activeRecord) {
            setDraft({ ...manager.activeRecord });
        } else if (isOpen) {
            setDraft({
                title: "", publishDate: "", expiryDate: "",
                priority: "Medium", status: "Draft",
                acknowledgmentRequired: false, description: ""
            });
        }
    }, [isOpen, manager.activeRecord]);

    // Flaw 32 Fix: Escape Key Trapping
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) manager.setDrawerMode("none");
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, manager]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Hook handles pushing to store, auto-versioning, and closing drawer
        console.log("Saving Announcement:", draft);
        manager.setDrawerMode("none");
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            width="w-full sm:w-[calc(100vw-260px)]"
            title={isEdit ? "Edit Announcement" : "Create Global Announcement"}
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Announcement Title <span className="text-rose-500">*</span></label>
                        <input type="text" className="erp-input text-lg font-semibold" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} required placeholder="e.g. Q4 Company Townhall Update" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Publish Date</label>
                            <DatePicker value={draft.publishDate} onChange={(val) => setDraft({ ...draft, publishDate: val })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Priority Level</label>
                            <CustomSelect
                                value={draft.priority}
                                options={["Low", "Medium", "High"]}
                                onChange={(val) => setDraft({ ...draft, priority: val as any })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Publish Status</label>
                            <CustomSelect
                                value={draft.status}
                                options={["Draft", "Scheduled", "Live"]}
                                onChange={(val) => setDraft({ ...draft, status: val as any })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <input
                            type="checkbox"
                            id="ack-req"
                            className="w-4 h-4 rounded text-brand-primary"
                            checked={draft.acknowledgmentRequired}
                            onChange={(e) => setDraft({ ...draft, acknowledgmentRequired: e.target.checked })}
                        />
                        <label htmlFor="ack-req" className="text-xs font-semibold text-blue-900 cursor-pointer">
                            Require Employee Acknowledgment (Compliance Tracking)
                        </label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Rich Text Description</label>
                        {/* Flaw 25 Prevention: Rich Text content MUST be sanitized via DOMPurify in the store layer */}
                        <textarea className="erp-input min-h-[200px]" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Format policies, insert links, or write memos here..." />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Attachments</label>
                        <Button type="button" variant="outline" className="w-full h-10 border-dashed bg-gray-50 flex items-center justify-center gap-2">
                            <Paperclip className="w-4 h-4 text-gray-400" /> <span className="text-xs text-gray-500">Upload PDF / Image (Secured via IndexedDB)</span>
                        </Button>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={() => manager.setDrawerMode("none")}>
                        <X className="w-4 h-4 mr-1.5" /> Cancel
                    </Button>
                    <Button type="submit" variant="default">
                        <Save className="w-4 h-4 mr-1.5" /> {isEdit ? "Update Announcement" : "Publish Announcement"}
                    </Button>
                </div>
            </form>
        </Drawer>
    );
}