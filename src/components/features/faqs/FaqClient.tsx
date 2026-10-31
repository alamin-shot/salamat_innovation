"use client";
import { useFaqManager } from "@/hooks/faq_hooks/useFaqManager";
import { FaqDrawer } from "./FaqDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, Power, Plus } from "lucide-react";

export function FaqClient() {
    const manager = useFaqManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.faqs.map(f => f.id));
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
                <h1 className="text-xl font-bold text-gray-900">FAQs</h1>
                <Button variant="default" onClick={manager.openAddDrawer} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add FAQ
                </Button>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input type="text" placeholder="Search FAQs..." className="erp-input max-w-sm" />
                </div>

                <div className="w-full overflow-x-auto min-h-[350px]">
                    <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                        checked={manager.faqs.length > 0 && manager.selectedIds.length === manager.faqs.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold w-48">Tenant</th>
                                <th className="p-4 font-semibold">Question</th>
                                <th className="p-4 font-semibold w-24">Lang</th>
                                <th className="p-4 font-semibold w-24 text-center">Order</th>
                                <th className="p-4 font-semibold w-24 text-center">Views</th>
                                <th className="p-4 font-semibold w-28">Status</th>
                                <th className="p-4 font-semibold text-right w-32">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.faqs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">No FAQs found.</td>
                                </tr>
                            ) : (
                                manager.faqs.map((faq) => (
                                    <tr key={faq.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 align-top">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(faq.id)}
                                                onChange={() => toggleSelect(faq.id)}
                                            />
                                        </td>
                                        <td className="p-4 align-top font-medium text-gray-900">{faq.shopName}</td>
                                        <td className="p-4 align-top text-gray-800 line-clamp-2">
                                            {faq.translations.en.question || faq.translations.bn.question}
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex gap-1">
                                                {faq.translations.en.question && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">EN</span>}
                                                {faq.translations.bn.question && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">BN</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top text-center text-gray-600">{faq.order}</td>
                                        <td className="p-4 align-top text-center text-gray-600">{faq.views}</td>
                                        <td className="p-4 align-top">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${faq.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                                }`}>
                                                {faq.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.handleToggleStatus(faq.id)} title={faq.status === 'Active' ? "Deactivate" : "Activate"}>
                                                    <Power className={`h-4 w-4 ${faq.status === 'Active' ? 'text-amber-500' : 'text-green-600'}`} />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(faq.id)} title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(faq.id)} title="Delete">
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

            <FaqDrawer manager={manager} />
        </div>
    );
}