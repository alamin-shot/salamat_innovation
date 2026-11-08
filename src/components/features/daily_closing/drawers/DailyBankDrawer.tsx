"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Save, Landmark, FileText, Hash } from "lucide-react";
import { DailyBankRecord } from "@/types/daily_closing";

const BANK_OPTIONS = [
    { label: "City Bank (Main Branch)", value: "City Bank (Main Branch)" },
    { label: "Brac Bank (Corporate)", value: "Brac Bank (Corporate)" },
    { label: "Dutch Bangla Bank", value: "Dutch Bangla Bank" },
    { label: "Islami Bank", value: "Islami Bank" },
    { label: "Bkash Merchant", value: "Bkash Merchant" }
];

const TRANSACTION_TYPES = [
    { label: "Deposit (Inflow)", value: "Deposit" },
    { label: "Withdrawal (Outflow)", value: "Withdrawal" },
    { label: "Transfer (Internal)", value: "Transfer" }
];

function DailyBankFormContent({ record, manager }: { record: DailyBankRecord | null; manager: any }) {
    const [formData, setFormData] = useState({
        bankAccount: record?.bankAccount || "",
        transactionType: record?.transactionType || "Deposit",
        amount: record?.amount || 0,
        referenceNumber: record?.referenceNumber || "",
        notes: record?.notes || "",
        status: record?.status || "Pending",
        date: record?.date || manager.activeDate // Link to the currently active closing date
    });

    // Reset form when drawer opens/closes or record changes
    useEffect(() => {
        if (record) {
            setFormData({
                bankAccount: record.bankAccount,
                transactionType: record.transactionType,
                amount: record.amount,
                referenceNumber: record.referenceNumber,
                notes: record.notes,
                status: record.status,
                date: record.date
            });
        } else {
            setFormData({
                bankAccount: "",
                transactionType: "Deposit",
                amount: 0,
                referenceNumber: "",
                notes: "",
                status: "Pending",
                date: manager.activeDate
            });
        }
    }, [record, manager.activeDate]);

    const handleSave = () => {
        if (record?.id) {
            manager.store.updateDailyBankRecord(record.id, formData);
        } else {
            manager.store.addDailyBankRecord(formData);
        }
        manager.setDrawerMode("none");
    };

    const isValid = formData.bankAccount.trim() !== "" && formData.amount > 0;

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* LEAK 4 SEALED: pb-32 permanently applied to prevent CustomSelect dropdown clipping */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar pb-32 flex flex-col gap-6">

                {/* Block 1: Core Transaction Details */}
                <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-5 rounded-xl">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Landmark className="w-4 h-4 text-brand-primary" />
                        <h3 className="text-sm font-black text-gray-900">Transaction Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="erp-label">Bank Account <span className="text-rose-500">*</span></label>
                            <CustomSelect
                                value={formData.bankAccount}
                                onChange={val => setFormData({ ...formData, bankAccount: val as string })}
                                options={BANK_OPTIONS}
                                placeholder="Select bank account..."
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Transaction Type <span className="text-rose-500">*</span></label>
                            <CustomSelect
                                value={formData.transactionType}
                                onChange={val => setFormData({ ...formData, transactionType: val as any })}
                                options={TRANSACTION_TYPES}
                                placeholder="Select type"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Amount (BDT) <span className="text-rose-500">*</span></label>
                            <input
                                type="number"
                                className="erp-input font-bold text-gray-900"
                                placeholder="0.00"
                                value={formData.amount || ""}
                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                {/* Block 2: Reference & Notes */}
                <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-5 rounded-xl">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <h3 className="text-sm font-black text-gray-900">Reference & Documentation</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label flex items-center gap-1"><Hash className="w-3 h-3" /> Reference / Slip Number</label>
                            <input
                                type="text"
                                className="erp-input text-xs font-mono uppercase"
                                placeholder="e.g. DEP-998124"
                                value={formData.referenceNumber}
                                onChange={e => setFormData({ ...formData, referenceNumber: e.target.value })}
                            />
                            <span className="text-[10px] text-gray-400">Physical deposit slip number or digital transaction ID.</span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Administrative Notes</label>
                            <textarea
                                className="erp-input min-h-[80px] py-2 resize-none"
                                placeholder="Add any contextual notes regarding this transaction..."
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Sticky Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <Button variant="outline" className="border-gray-200 text-gray-600" onClick={() => manager.setDrawerMode("none")}>
                    Cancel
                </Button>
                <Button variant="default" className="bg-brand-primary text-white" onClick={handleSave} disabled={!isValid}>
                    <Save className="w-4 h-4 mr-2" />
                    {record?.id ? "Update Transaction" : "Save Transaction"}
                </Button>
            </div>
        </div>
    );
}

export function DailyBankDrawer({ manager }: { manager: any }) {
    const isOpen = manager.drawerMode === "bank_form";

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => {
                manager.setDrawerMode("none");
                setTimeout(() => manager.setActiveRecord(null), 300);
            }}
            title={manager.activeRecord?.id ? `Edit Record: ${manager.activeRecord.referenceNumber || manager.activeRecord.id}` : "Log Bank Transaction"}
            width="w-full sm:w-[calc(100vw-260px)]" // Standard Tier-1 sliding width
        >
            <DailyBankFormContent key={manager.activeRecord?.id || "new"} record={manager.activeRecord} manager={manager} />
        </Drawer>
    );
}