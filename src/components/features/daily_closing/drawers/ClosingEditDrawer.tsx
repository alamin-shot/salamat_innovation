"use client";
import { useState, useEffect } from "react";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Edit3, Save, CreditCard } from "lucide-react";

export function ClosingEditDrawer({ manager }: { manager: ReturnType<typeof useClosingManager> }) {
    const isOpen = manager.drawerMode === "edit";
    const record = manager.activeRecord;

    const [formData, setFormData] = useState({
        paymentMethod: "",
        paidAmount: 0,
        dueAmount: 0,
        status: ""
    });

    // Sync form data when the drawer opens
    useEffect(() => {
        if (record && isOpen) {
            setFormData({
                paymentMethod: record.paymentMethod,
                paidAmount: record.paidAmount,
                dueAmount: record.dueAmount,
                status: record.status
            });
        }
    }, [record, isOpen]);

    const handleSave = () => {
        // TODO: Wire this to your Zustand store's `updateTransaction` action
        console.log("Saving updated record:", { ...record, ...formData });
        alert(`Transaction ${record?.invoiceNumber} updated successfully!`);
        manager.setDrawerMode("none");
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => {
                manager.setDrawerMode("none");
                setTimeout(() => manager.setActiveRecord(null), 300);
            }}
            title={`Edit Transaction: ${record?.invoiceNumber || ""}`}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {record ? (
                <div className="flex flex-col h-full bg-gray-50/50">
                    <div className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col gap-6">

                        <div className="flex items-center gap-3 mb-2 bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800">
                            <Edit3 className="w-5 h-5 shrink-0" />
                            <p className="text-xs font-medium leading-relaxed">
                                Modify the transaction details below. Changes will immediately reflect in the End of Day reconciliation dashboard.
                            </p>
                        </div>

                        <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                <CreditCard className="w-3.5 h-3.5" /> Financial Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Payment Method</label>
                                    <select
                                        className="erp-input text-sm font-medium bg-white"
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Bkash">Bkash</option>
                                        <option value="POS">POS</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Transaction Status</label>
                                    <select
                                        className="erp-input text-sm font-medium bg-white"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Partially_Paid">Partially Paid</option>
                                        <option value="Due">Due</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Paid Amount (BDT)</label>
                                    <input
                                        type="number"
                                        className="erp-input text-sm font-bold text-emerald-600 bg-white"
                                        value={formData.paidAmount}
                                        onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Due Amount (BDT)</label>
                                    <input
                                        type="number"
                                        className="erp-input text-sm font-bold text-rose-600 bg-white"
                                        value={formData.dueAmount}
                                        onChange={(e) => setFormData({ ...formData, dueAmount: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sticky Footer */}
                    <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <Button variant="outline" className="border-gray-200 text-gray-600 shadow-2xs" onClick={() => manager.setDrawerMode("none")}>
                            Cancel
                        </Button>
                        <Button variant="default" className="bg-brand-primary text-white shadow-md hover:shadow-lg" onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-medium text-sm">Loading details...</div>
            )}
        </Drawer>
    );
}