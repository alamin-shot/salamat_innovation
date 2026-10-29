"use client";
import { useOffersManager } from "@/hooks/offers_hooks/useOffersManager";
import { OffersDrawer } from "./OffersDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, Plus } from "lucide-react";

export function OffersClient() {
    const manager = useOffersManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.offers.map(o => o.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Offers</h1>
                <Button variant="success" onClick={manager.openAddDrawer} className="h-9 px-4 gap-2">
                    <Plus className="h-4 w-4" /> Add Offer
                </Button>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search offers..."
                        className="erp-input max-w-xs"
                    />
                </div>

                <div className="w-full overflow-x-auto min-h-[350px]">
                    <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                        checked={manager.offers.length > 0 && manager.selectedIds.length === manager.offers.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold">Title</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Start At</th>
                                <th className="p-4 font-semibold">End At</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.offers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No offers found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                manager.offers.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(offer.id)}
                                                onChange={() => toggleSelect(offer.id)}
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{offer.title}</td>
                                        <td className="p-4">{offer.type}</td>
                                        <td className="p-4">{formatDate(offer.startDate)}</td>
                                        <td className="p-4">{formatDate(offer.endDate)}</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold ${offer.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                                                {offer.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(offer.id)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(offer.id)}>
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
                <BulkActionBar
                    selectedCount={manager.selectedIds.length}
                    onClearSelection={() => manager.setSelectedIds([])}
                >
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>
                        Delete Selected
                    </Button>
                </BulkActionBar>
            )}

            <OffersDrawer manager={manager} />
        </div>
    );
}