"use client";
import { useEmiManager } from "@/hooks/emi_hooks/useEmiManager";
import { EmiDrawer } from "./EmiDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, Plus } from "lucide-react";

export function EmiClient() {
    const manager = useEmiManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.banks.map(b => b.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    // Helper to find specific tenure rate for the matrix columns
    const getRateForTenure = (bank: any, tenureName: string) => {
        const found = bank.tenureRates.find((t: any) => t.tenure === tenureName);
        if (!found || !found.enabled) return "-";
        return `${found.chargeRate.toFixed(2)}%`;
    };

    const tenuresList = ["3 Months", "6 Months", "9 Months", "12 Months", "18 Months", "24 Months", "30 Months", "36 Months"];

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">EMI Charge Matrix</h1>
                <Button variant="success" onClick={manager.openAddDrawer} className="h-9 px-4 gap-2">
                    <Plus className="h-4 w-4" /> Add Bank
                </Button>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search banks..."
                        className="erp-input max-w-xs"
                    />
                </div>

                <div className="w-full overflow-x-auto pb-24 min-h-[400px]">
                    <table className="w-full text-left text-xs text-brand-subtext border-collapse whitespace-nowrap">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                        checked={manager.banks.length > 0 && manager.selectedIds.length === manager.banks.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold">Bank Name</th>
                                <th className="p-4 font-semibold">GW Key</th>
                                {tenuresList.map(t => (
                                    <th key={t} className="p-3 font-semibold text-center">{t.replace(' Months', 'M')}</th>
                                ))}
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.banks.length === 0 ? (
                                <tr>
                                    <td colSpan={13} className="p-8 text-center text-gray-500">
                                        No EMI banks configured.
                                    </td>
                                </tr>
                            ) : (
                                manager.banks.map((bank) => (
                                    <tr key={bank.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(bank.id)}
                                                onChange={() => toggleSelect(bank.id)}
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{bank.bankName}</td>
                                        <td className="p-4 text-gray-500">{bank.gatewayKey}</td>
                                        {tenuresList.map(t => (
                                            <td key={t} className="p-3 text-center text-gray-700">
                                                {getRateForTenure(bank, t)}
                                            </td>
                                        ))}
                                        <td className="p-4">
                                            <span className={`text-xs font-bold ${bank.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                                                {bank.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(bank.id)} title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(bank.id)} title="Delete">
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

            <EmiDrawer manager={manager} />
        </div>
    );
}