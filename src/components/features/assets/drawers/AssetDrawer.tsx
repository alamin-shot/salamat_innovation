"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";
import { useGlobalAssetStore } from "@/store/useGlobalAssetStore";
import { Save, X } from "lucide-react";

export function AssetDrawer({ manager }: { manager: ReturnType<typeof useAssetManager> }) {
    const store = useGlobalAssetStore();
    const isOpen = manager.drawerMode === "add_asset" || manager.drawerMode === "edit_asset";
    const isEdit = manager.drawerMode === "edit_asset";

    // Strict State Isolation: Local draft state prevents global UI stutter
    const [draft, setDraft] = useState({
        categoryId: "",
        name: "",
        serialNumber: "",
        purchaseDate: "",
        purchaseCost: 0,
        warrantyExpiry: "",
        location: "",
        note: ""
    });

    // Sync draft when drawer opens
    useEffect(() => {
        if (isOpen && manager.activeAsset) {
            setDraft({ ...manager.activeAsset });
        } else if (isOpen) {
            setDraft({
                categoryId: store.categories[0]?.id || "",
                name: "", serialNumber: "", purchaseDate: "",
                purchaseCost: 0, warrantyExpiry: "", location: "", note: ""
            });
        }
    }, [isOpen, manager.activeAsset, store.categories]);

    // Flaw 32 Fix: Strict Escape Key Focus Trapping
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) manager.setDrawerMode("none");
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, manager]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        manager.handleSaveAsset(draft);
    };
    const categoryNames = store.categories.map(c => c.name);

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            width="w-full sm:w-[calc(100vw-260px)]"
            title={isEdit ? "Update Asset" : "Register New Asset"}
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Asset Category <span className="text-rose-500">*</span></label>
                            {isEdit ? (
                                <input
                                    type="text"
                                    className="erp-input bg-gray-50 text-gray-500 cursor-not-allowed"
                                    value={store.categories.find(c => c.id === draft.categoryId)?.name || ""}
                                    readOnly
                                />
                            ) : (
                                <CustomSelect
                                    value={store.categories.find(c => c.id === draft.categoryId)?.name || ""}
                                    options={store.categories.map(c => c.name)}
                                    onChange={(selectedName) => {
                                        const selectedCat = store.categories.find(c => c.name === selectedName);
                                        if (selectedCat) setDraft({ ...draft, categoryId: selectedCat.id });
                                    }}
                                />
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Asset Name <span className="text-rose-500">*</span></label>
                            <input type="text" className="erp-input" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} required placeholder="e.g. MacBook Pro M3" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Serial Number</label>
                            <input type="text" className="erp-input" value={draft.serialNumber} onChange={e => setDraft({ ...draft, serialNumber: e.target.value })} placeholder="Manufacturer SN" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Location</label>
                            <input type="text" className="erp-input" value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} placeholder="e.g. Dhaka HQ - IT Room" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Purchase Date <span className="text-rose-500">*</span></label>
                            <DatePicker value={draft.purchaseDate} onChange={(val) => setDraft({ ...draft, purchaseDate: val })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Purchase Cost (৳) <span className="text-rose-500">*</span></label>
                            <input type="number" className="erp-input" value={draft.purchaseCost || ""} onChange={e => setDraft({ ...draft, purchaseCost: Number(e.target.value) })} required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Internal Notes & Specs</label>
                        <textarea className="erp-input min-h-[100px]" value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })} placeholder="Specific configurations, RAM, supplier info..." />
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={() => manager.setDrawerMode("none")}>
                        <X className="w-4 h-4 mr-1.5" /> Cancel
                    </Button>
                    <Button type="submit" variant="default">
                        <Save className="w-4 h-4 mr-1.5" /> {isEdit ? "Save Changes" : "Register Asset"}
                    </Button>
                </div>
            </form>
        </Drawer>
    );
}