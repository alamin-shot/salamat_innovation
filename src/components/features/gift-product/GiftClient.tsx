"use client";
import { useGiftManager } from "@/hooks/gift_hooks/useGiftManager";
import { GiftDrawer } from "./GiftDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, Plus, Power, PowerOff, Gift } from "lucide-react";

export function GiftClient() {
    const manager = useGiftManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.gifts.map(g => g.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: '2-digit'
        });
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Gift Products</h1>
                <Button variant="success" onClick={manager.openAddDrawer} className="h-9 px-4 gap-2">
                    <Plus className="h-4 w-4" /> Add Gift Rule
                </Button>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search gift rules..."
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
                                        checked={manager.gifts.length > 0 && manager.selectedIds.length === manager.gifts.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold">Primary Product</th>
                                <th className="p-4 font-semibold text-brand-primary"><div className="flex items-center gap-1.5"><Gift className="h-4 w-4" /> Gift Product</div></th>
                                <th className="p-4 font-semibold">Start Date</th>
                                <th className="p-4 font-semibold">End Date</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.gifts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No gift product rules found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                manager.gifts.map((gift) => (
                                    <tr key={gift.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(gift.id)}
                                                onChange={() => toggleSelect(gift.id)}
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{gift.primaryProductName}</td>
                                        <td className="p-4 font-medium text-brand-primary bg-brand-primary/5">{gift.giftProductName}</td>
                                        <td className="p-4">{formatDate(gift.startDate)}</td>
                                        <td className="p-4">{formatDate(gift.endDate)}</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold ${gift.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                                                {gift.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => manager.handleToggleStatus(gift.id)}
                                                    title={gift.status === 'Active' ? "Deactivate" : "Activate"}
                                                    className={gift.status === 'Active' ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}
                                                >
                                                    {gift.status === 'Active' ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(gift.id)} title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(gift.id)} title="Delete">
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

            <GiftDrawer manager={manager} />
        </div>
    );
}