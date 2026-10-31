"use client";
import { useOutletManager } from "@/hooks/outlet_hooks/useOutletManager";
import { OutletDrawer } from "./OutletDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, Power, Plus, MapPin } from "lucide-react";

export function OutletClient() {
    const manager = useOutletManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.outlets.map(o => o.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Outlets</h1>
                <Button variant="default" onClick={manager.openAddDrawer} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Outlet
                </Button>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input type="text" placeholder="Search outlets..." className="erp-input max-w-sm" />
                </div>

                <div className="w-full overflow-x-auto min-h-[350px]">
                    <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                        checked={manager.outlets.length > 0 && manager.selectedIds.length === manager.outlets.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold w-64">Name</th>
                                <th className="p-4 font-semibold w-32">Phone</th>
                                <th className="p-4 font-semibold w-40">Opens</th>
                                <th className="p-4 font-semibold w-24">Close Day</th>
                                <th className="p-4 font-semibold w-24 text-center">Outlet Images</th>
                                <th className="p-4 font-semibold w-24">Status</th>
                                <th className="p-4 font-semibold text-right w-36">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.outlets.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">No outlets found.</td>
                                </tr>
                            ) : (
                                manager.outlets.map((outlet) => (
                                    <tr key={outlet.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 align-middle">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(outlet.id)}
                                                onChange={() => toggleSelect(outlet.id)}
                                            />
                                        </td>
                                        <td className="p-4 align-middle font-medium text-gray-900">{outlet.name}</td>
                                        <td className="p-4 align-middle text-gray-700">{outlet.phone}</td>
                                        <td className="p-4 align-middle text-gray-700 text-xs">
                                            {outlet.opens} &rarr; {outlet.closes}
                                        </td>
                                        <td className="p-4 align-middle text-gray-700">{outlet.closeDay}</td>
                                        <td className="p-4 align-middle text-center text-gray-600 font-medium">
                                            {outlet.gallery.length}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${outlet.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                                }`}>
                                                {outlet.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {outlet.googleMapUrl && (
                                                    <a href={outlet.googleMapUrl} target="_blank" rel="noreferrer">
                                                        <Button variant="ghost" size="icon-sm" title="View Map" className="text-blue-500 hover:bg-blue-50">
                                                            <MapPin className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.handleToggleStatus(outlet.id)} title={outlet.status === 'Active' ? "Deactivate" : "Activate"}>
                                                    <Power className={`h-4 w-4 ${outlet.status === 'Active' ? 'text-amber-500' : 'text-green-600'}`} />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(outlet.id)} title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(outlet.id)} title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {manager.selectedIds.length > 0 && (
                <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={() => manager.setSelectedIds([])}>
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>Delete Selected</Button>
                </BulkActionBar>
            )}

            <OutletDrawer manager={manager} />
        </div>
    );
}