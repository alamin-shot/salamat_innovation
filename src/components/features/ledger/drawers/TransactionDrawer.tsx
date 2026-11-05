"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Save, FileText, Calculator } from "lucide-react";
import { useLedgerManager } from "@/hooks/ledger_hooks/useLedgerManager";

export function TransactionDrawer({ manager }: { manager: ReturnType<typeof useLedgerManager> }) {
    const isOpen = manager.drawerMode === "transaction";

    // Smart Form State
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [isTaxInclusive, setIsTaxInclusive] = useState(false);
    const [lineItems, setLineItems] = useState([{ id: "1", description: "", amount: 0, coaId: "" }]);

    // Auto-calculates total from the dynamic line items array
    const totalAmount = lineItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    const taxAmount = isTaxInclusive ? totalAmount * 0.15 : 0; // Example 15% VAT split

    useEffect(() => {
        if (!isOpen) {
            // Reset form on close
            setPaymentMethod("Cash");
            setIsTaxInclusive(false);
            setLineItems([{ id: "1", description: "", amount: 0, coaId: "" }]);
        }
    }, [isOpen]);

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            title="Create Journal Entry"
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full bg-gray-50/50">
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

                    {/* Core Transaction Details */}
                    <div className="erp-card p-4 flex flex-col gap-4 bg-white">
                        <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-brand-primary" /> Entry Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="erp-label">Account / Entity</label>
                                <CustomSelect size="sm" value="" options={manager.accountsWithAging.map(a => ({ value: a.id, label: a.name }))} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="erp-label">Transaction Type</label>
                                <CustomSelect size="sm" value="Debit" options={["Debit", "Credit"]} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="erp-label">Date</label>
                                <input type="date" className="erp-input bg-gray-50" /> {/* NOTE: Replace with custom <DatePicker> in production */}
                            </div>
                        </div>

                        {/* Smart Fields: React to Payment Method */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="erp-label">Payment Method</label>
                                <CustomSelect size="sm" value={paymentMethod} onChange={setPaymentMethod} options={["Cash", "Bank Transfer", "Check"]} />
                            </div>

                            {(paymentMethod === "Bank Transfer" || paymentMethod === "Check") && (
                                <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                                    <label className="erp-label">Reference / Check #</label>
                                    <input type="text" className="erp-input" placeholder="e.g., CHK-99201" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Split Line Items (Cost Centers & CoA) */}
                    <div className="erp-card p-4 flex flex-col gap-2 bg-white">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-brand-primary" /> Line Items & Splits
                            </h3>
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setLineItems([...lineItems, { id: Date.now().toString(), description: "", amount: 0, coaId: "" }])}>
                                <Plus className="w-3 h-3 mr-1" /> Add Split
                            </Button>
                        </div>

                        {lineItems.map((item, idx) => (
                            <div key={item.id} className="flex flex-col md:flex-row gap-2 items-end bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="flex-1 w-full flex flex-col gap-1">
                                    <label className="erp-label text-[9px]">Chart of Accounts</label>
                                    <CustomSelect size="sm" value={item.coaId} options={manager.chartOfAccounts.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))} />
                                </div>
                                <div className="flex-1 w-full flex flex-col gap-1">
                                    <label className="erp-label text-[9px]">Description</label>
                                    <input type="text" className="erp-input h-8 text-xs" placeholder="Particulars..." />
                                </div>
                                <div className="w-full md:w-32 flex flex-col gap-1">
                                    <label className="erp-label text-[9px]">Amount (৳)</label>
                                    <input type="number" className="erp-input h-8 text-xs font-mono" value={item.amount} onChange={(e) => {
                                        const newItems = [...lineItems];
                                        newItems[idx].amount = Number(e.target.value);
                                        setLineItems(newItems);
                                    }} />
                                </div>
                                {lineItems.length > 1 && (
                                    <Button variant="destructive-ghost" size="icon-sm" className="h-8 w-8 mb-px shrink-0" onClick={() => setLineItems(lineItems.filter(l => l.id !== item.id))}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tax & Total Summary */}
                    <div className="flex flex-col items-end gap-1 p-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer mb-2">
                            <input type="checkbox" checked={isTaxInclusive} onChange={(e) => setIsTaxInclusive(e.target.checked)} className="rounded text-brand-primary" />
                            Auto-Split 15% VAT (Tax Inclusive)
                        </label>
                        {isTaxInclusive && (
                            <p className="text-xs font-mono text-gray-500">Base: ৳{(totalAmount - taxAmount).toLocaleString()} | VAT: ৳{taxAmount.toLocaleString()}</p>
                        )}
                        <p className="text-xl font-black text-gray-900 mt-1">Total: ৳{totalAmount.toLocaleString()}</p>
                    </div>

                </div>

                <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-2">
                    <Button variant="outline" onClick={() => manager.setDrawerMode("none")}>Cancel</Button>
                    <Button variant="default"><Save className="w-4 h-4 mr-2" /> Post to Ledger</Button>
                </div>
            </div>
        </Drawer>
    );
}