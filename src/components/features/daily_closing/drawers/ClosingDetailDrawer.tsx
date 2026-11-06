"use client";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { Drawer } from "@/components/ui/Drawer";
import { Receipt, User, Clock, CreditCard, Activity } from "lucide-react";

export function ClosingDetailDrawer({ manager }: { manager: ReturnType<typeof useClosingManager> }) {
    const isOpen = manager.drawerMode === "transaction";
    const record = manager.activeRecord;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => {
                manager.setDrawerMode("none");
                setTimeout(() => manager.setActiveRecord(null), 300); // Clear after animation
            }}
            title={`Transaction Details: ${record?.invoiceNumber || "N/A"}`}
            className="w-full sm:w-[calc(100vw-260px)] xl:w-[600px]"
        >
            {record ? (
                <div className="flex flex-col h-full bg-gray-50/50 p-4 sm:p-6 overflow-y-auto gap-4">

                    {/* Status & Master Info */}
                    <div className="erp-card bg-white p-4 flex items-center justify-between border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 uppercase">Reference</span>
                                <span className="text-base font-black text-gray-900">{record.invoiceNumber}</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${record.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                            record.status === "Due" ? "bg-rose-100 text-rose-700" :
                                "bg-amber-100 text-amber-700"
                            }`}>
                            {record.status.replace("_", " ")}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Party/Customer Info */}
                        <div className="erp-card bg-white p-4 border border-gray-200 flex flex-col gap-3">
                            <h3 className="text-xs font-black text-gray-400 uppercase flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                <User className="w-3.5 h-3.5" /> Entities
                            </h3>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400">Party / Customer</span>
                                <span className="text-sm font-bold text-gray-900">{record.party}</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                                <span className="text-[10px] font-bold text-gray-400">Handled By</span>
                                <span className="text-sm font-bold text-gray-700">{record.sellerOrCreator}</span>
                            </div>
                        </div>

                        {/* Financial Math */}
                        <div className="erp-card bg-white p-4 border border-gray-200 flex flex-col gap-3">
                            <h3 className="text-xs font-black text-gray-400 uppercase flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                <CreditCard className="w-3.5 h-3.5" /> Ledger Data
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Payment Method</span>
                                <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{record.paymentMethod}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Grand Total</span>
                                <span className="text-sm font-black text-gray-900">{record.total.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Paid Amount</span>
                                <span className="text-sm font-black text-emerald-600">{record.paidAmount.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Due Amount</span>
                                <span className="text-sm font-black text-rose-600">{record.dueAmount.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Audit Trail */}
                    <div className="erp-card bg-white p-4 border border-gray-200 flex flex-col gap-3 mt-auto">
                        <h3 className="text-xs font-black text-gray-400 uppercase flex items-center gap-1.5 border-b border-gray-100 pb-2">
                            <Activity className="w-3.5 h-3.5" /> System Audit
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            Transaction recorded on {record.date} during EOD cycle.
                        </div>
                    </div>

                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-medium text-sm">Loading details...</div>
            )}
        </Drawer>
    );
}