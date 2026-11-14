"use client";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";
import { Save, X } from "lucide-react";
import { useGlobalAssetStore } from "@/store/useGlobalAssetStore";

export function AssetCategoryDrawer({ manager }: { manager: ReturnType<typeof useAssetManager> }) {
    const store = useGlobalAssetStore();
    const isOpen = manager.drawerMode === "add_category";
    const [draft, setDraft] = useState({ name: "", prefix: "", defaultLifespanMonths: 36, status: "Active" as const, defaultDepreciationRate: 0 });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        store.addCategory(draft);
        manager.setDrawerMode("none");
    };

    return (
        <Drawer isOpen={isOpen} onClose={() => manager.setDrawerMode("none")} title="Add Asset Category" width="w-full sm:w-[400px]">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 p-4 space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Category Name</label>
                        <input type="text" className="erp-input" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} required placeholder="e.g. Laptops" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Code Prefix</label>
                        <input type="text" className="erp-input uppercase" value={draft.prefix} onChange={e => setDraft({ ...draft, prefix: e.target.value })} required placeholder="e.g. LPT-" />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={() => manager.setDrawerMode("none")}><X className="w-4 h-4 mr-1.5" /> Cancel</Button>
                    <Button type="submit" variant="default"><Save className="w-4 h-4 mr-1.5" /> Save</Button>
                </div>
            </form>
        </Drawer>
    );
}