"use client";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Save, Link as LinkIcon, Activity } from "lucide-react";

const AVAILABLE_EVENTS = [
    { id: "order.created", label: "Order Created" },
    { id: "order.paid", label: "Order Paid" },
    { id: "inventory.low_stock", label: "Inventory Low Stock" },
    { id: "closing.reconciled", label: "Daily Closing Reconciled" }
];

export function WebhookDrawer({ manager }: { manager: any }) {
    const isOpen = manager.drawerMode === "webhook_form";
    const [url, setUrl] = useState("https://");
    const [events, setEvents] = useState<string[]>([]);

    const handleSave = () => {
        manager.store.addWebhook(url, events);
        manager.setDrawerMode("none");
        setUrl("https://");
        setEvents([]);
    };

    const isValid = url.length > 10 && events.length > 0;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            title="Register Webhook Endpoint"
            width="w-full sm:w-[calc(100vw-260px)] md:w-[500px]"
        >
            <div className="flex flex-col h-full bg-gray-50/50">
                {/* LEAK 4 SEALED: pb-32 */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar pb-32 flex flex-col gap-6">

                    <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-5 rounded-xl">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <LinkIcon className="w-4 h-4 text-brand-primary" />
                            <h3 className="text-sm font-black text-gray-900">Endpoint Details</h3>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Payload URL <span className="text-rose-500">*</span></label>
                            <input type="url" className="erp-input font-mono text-sm" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-server.com/webhook" />
                        </div>
                    </div>

                    <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-4 rounded-xl">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Activity className="w-4 h-4 text-brand-primary" />
                            <h3 className="text-sm font-black text-gray-900">Event Subscriptions</h3>
                        </div>

                        <div className="flex flex-col gap-3">
                            {AVAILABLE_EVENTS.map((evt) => (
                                <label key={evt.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary"
                                        checked={events.includes(evt.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setEvents([...events, evt.id]);
                                            else setEvents(events.filter(id => id !== evt.id));
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">{evt.label}</span>
                                        <span className="text-[10px] text-gray-400 font-mono">{evt.id}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
                    <Button variant="outline" onClick={() => manager.setDrawerMode("none")}>Cancel</Button>
                    <Button variant="default" className="bg-brand-primary text-white" onClick={handleSave} disabled={!isValid}>
                        <Save className="w-4 h-4 mr-2" /> Save Endpoint
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}