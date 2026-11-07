"use client";
import { useState, useMemo } from "react";
import { useUserManager } from "@/hooks/user_hooks/useUserManager";
import { usePermissionMatrix } from "@/hooks/user_hooks/usePermissionMatrix";
import { RoleRecord } from "@/store/useGlobalUserStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Save, Search, CheckCircle2, Circle } from "lucide-react";

function RolePermissionContent({ record, manager }: { record: RoleRecord | null, manager: ReturnType<typeof useUserManager> }) {
    const [roleName, setRoleName] = useState(record?.name || "");
    const [searchQuery, setSearchQuery] = useState("");

    const {
        selectedPermissions, togglePermission, grantModuleFullAccess, revokeModuleAccess,
        getModuleStatus, exportPermissions
    } = usePermissionMatrix(record?.permissions || [], manager.store.permissionMatrix);

    const [activeModuleId, setActiveModuleId] = useState(manager.store.permissionMatrix[0]?.id);

    const filteredMatrix = useMemo(() => {
        if (!searchQuery.trim()) return manager.store.permissionMatrix;
        const lowerQ = searchQuery.toLowerCase();
        return manager.store.permissionMatrix.map(mod => ({
            ...mod,
            actions: mod.actions.filter(a => a.label.toLowerCase().includes(lowerQ))
        })).filter(mod => mod.actions.length > 0 || mod.label.toLowerCase().includes(lowerQ));
    }, [searchQuery, manager.store.permissionMatrix]);

    const handleSave = () => {
        const payload = { name: roleName, permissions: exportPermissions() };
        if (record?.id && !record.id.includes("new")) manager.store.updateRole(record.id, payload);
        else manager.store.addRole(payload as any);
        manager.setDrawerMode("none");
    };

    return (
        // FIX: Removed all absolute positioning and forced heights. Let it flow naturally.
        <div className="flex flex-col gap-8 pb-4">

            {/* Top Controls */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Role Name <span className="text-rose-500">*</span></label>
                    <input type="text" className="erp-input max-w-md font-bold text-gray-900" placeholder="e.g. Finance Manager" value={roleName} onChange={e => setRoleName(e.target.value)} />
                </div>
                <div className="relative w-full max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search specific permissions or modules..." className="erp-input pl-9 bg-gray-50/50 border-transparent shadow-none focus:bg-white" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
            </div>

            {/* HYBRID LAYOUT: items-start allows the sticky sidebar to work */}
            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* LEFT PANE: Uses sticky top-0 to follow the user as Drawer scrolls */}
                <div className="hidden md:flex flex-col w-1/3 bg-gray-50 border border-gray-200 rounded-xl p-3 gap-1 sticky top-0">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 pb-2 pt-1">
                        Modules ({filteredMatrix.length})
                    </div>
                    {filteredMatrix.map(mod => {
                        const status = getModuleStatus(mod);
                        const isSelected = activeModuleId === mod.id;
                        return (
                            <button
                                key={mod.id}
                                onClick={() => setActiveModuleId(mod.id)}
                                className={`text-left px-3 py-3 rounded-lg flex items-center justify-between transition-all ${isSelected ? "bg-white shadow-sm border border-gray-200" : "hover:bg-gray-100 border border-transparent"}`}
                            >
                                <span className={`text-sm font-bold ${isSelected ? "text-brand-primary" : "text-gray-700"}`}>{mod.label}</span>
                                {status === "full" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                                    status === "partial" ? <div className="w-4 h-4 rounded-full border-2 border-brand-primary/40 border-t-brand-primary animate-pulse" /> :
                                        <Circle className="w-4 h-4 text-gray-300" />}
                            </button>
                        );
                    })}
                </div>

                {/* RIGHT PANE: Flows naturally downwards */}
                <div className="flex-1 flex flex-col gap-6 w-full">
                    {filteredMatrix.map(mod => {
                        const status = getModuleStatus(mod);
                        const isVisible = activeModuleId === mod.id;

                        return (
                            <div key={mod.id} className={`erp-card border border-gray-200 rounded-xl overflow-hidden ${!isVisible ? "md:hidden" : ""}`}>
                                {/* Module Header & Master Toggles */}
                                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-black text-gray-900">{mod.label}</h3>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{mod.actions.length} Permissions Available</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-2xs">
                                        <button onClick={() => grantModuleFullAccess(mod)} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${status === "full" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>Full Access</button>
                                        <button onClick={() => revokeModuleAccess(mod)} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${status === "none" ? "bg-rose-100 text-rose-700" : "text-gray-500 hover:bg-gray-50"}`}>Revoke All</button>
                                    </div>
                                </div>

                                {/* Granular Action Grid */}
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                                    {mod.actions.map(action => {
                                        const isChecked = selectedPermissions.has(action.id);
                                        return (
                                            <label key={action.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isChecked ? "bg-brand-primary/5 border-brand-primary/30" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}>
                                                <input
                                                    type="checkbox"
                                                    className="mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                                    checked={isChecked}
                                                    onChange={() => togglePermission(action.id, action.requires)}
                                                />
                                                <div className="flex flex-col">
                                                    <span className={`text-xs font-bold leading-tight ${isChecked ? "text-brand-primary" : "text-gray-700"}`}>{action.label}</span>
                                                    {action.requires && (
                                                        <span className="text-[9px] font-bold text-amber-600 mt-1 uppercase tracking-wider">Requires: {action.requires.join(", ")}</span>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Standard Footer */}
            <div className="border-t border-gray-200 pt-6 flex items-center justify-between mt-4">
                <div className="text-xs font-bold text-gray-500">
                    <span className="text-brand-primary font-black">{selectedPermissions.size}</span> Total Permissions Granted
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-gray-200 text-gray-600 shadow-2xs" onClick={() => manager.setDrawerMode("none")}>Cancel</Button>
                    <Button variant="default" className="bg-brand-primary text-white shadow-md hover:shadow-lg" onClick={handleSave} disabled={!roleName.trim()}>
                        <Save className="w-4 h-4 mr-2" /> Save Role
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function RolePermissionDrawer({ manager }: { manager: ReturnType<typeof useUserManager> }) {
    const isOpen = manager.drawerMode === "role_form";
    const record = manager.activeRecord as RoleRecord | null;
    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => { manager.setDrawerMode("none"); setTimeout(() => manager.setActiveRecord(null), 300); }}
            title={record?.id && !record.id.includes("new") ? "Edit Role & Permissions" : "Architect New Role"}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <RolePermissionContent key={record?.id || "new"} record={record} manager={manager} />
        </Drawer>
    );
}