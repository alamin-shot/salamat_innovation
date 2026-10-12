"use client";
import * as React from "react";
import { Save, Edit3, Calendar, Building2, UserCheck, FileText } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";

export function EditPurchaseDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    const [supplier, setSupplier] = React.useState("Rasel Raj");
    const [warehouse, setWarehouse] = React.useState("A-Block");
    const [date, setDate] = React.useState("2026-10-11");
    const [status, setStatus] = React.useState("Paid");

    if (!id && !isOpen) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Purchase invoice ${id} updated successfully!`);
        onClose();
    };

    return (
        <Drawer
            title="Quick Edit Purchase Record"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="flex flex-col justify-between h-full p-4 sm:p-6 lg:p-8">
                <form id="edit-purchase-form" onSubmit={handleSave} className="mx-auto max-w-3xl w-full flex flex-col gap-8">

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                        <Edit3 className="h-6 w-6 text-blue-600 shrink-0" />
                        <div>
                            <p className="font-bold">Editing Invoice: {id}</p>
                            <p className="text-xs text-blue-600">Update metadata details below. Financial calculation rows are locked.</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-brand-subtext flex items-center gap-1.5">
                                    <UserCheck className="h-4 w-4 text-emerald-600" /> Supplier Name
                                </label>
                                <input
                                    type="text"
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-brand-subtext flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4 text-emerald-600" /> Warehouse Location
                                </label>
                                <select
                                    value={warehouse}
                                    onChange={(e) => setWarehouse(e.target.value)}
                                    className="w-full appearance-none rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="A-Block">A-Block</option>
                                    <option value="B-Block">B-Block</option>
                                    <option value="Central Warehouse">Central Warehouse</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-brand-subtext flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-emerald-600" /> Purchase Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-brand-subtext">Payment Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full appearance-none rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Due">Due</option>
                                    <option value="Partial">Partial</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="border-t border-brand-subtext/20 bg-brand-bg/30 px-6 py-4 flex items-center justify-end gap-3 mt-8 rounded-xl">
                    <button
                        onClick={onClose}
                        type="button"
                        className="rounded-md border border-brand-subtext/30 bg-white px-5 py-2 text-sm font-bold text-brand-text hover:bg-brand-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-purchase-form"
                        className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </Drawer>
    );
}