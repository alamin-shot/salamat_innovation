"use client";
import { Drawer } from "@/components/ui/Drawer";
import { PayslipItem } from "@/types/payroll.types";
import { Button } from "@/components/ui/Button";

interface PayslipLedgerDrawerProps {
    viewTarget: PayslipItem | null;
    onClose: () => void;
}

export function PayslipLedgerDrawer({ viewTarget, onClose }: PayslipLedgerDrawerProps) {
    return (
        <Drawer title={`Ledger Preview - ${viewTarget?.employeeName || ""}`} isOpen={!!viewTarget} onClose={onClose} width="drawer-full-content">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto pb-12 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded overflow-hidden">
                        <div className="border-r border-gray-200 bg-white">
                            <div className="bg-emerald-50 p-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800 text-center border-b border-emerald-200">
                                Earnings & Allowances
                            </div>
                            <div className="p-4 flex flex-col gap-3 min-h-[250px]">
                                {viewTarget?.allowances.map((a, i) => (
                                    <div key={i} className="flex justify-between text-xs text-gray-700">
                                        <span>{a.name}</span>
                                        <span className="font-mono font-medium text-emerald-700">৳ {a.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white">
                            <div className="bg-rose-50 p-2 text-[10px] font-bold uppercase tracking-wider text-rose-800 text-center border-b border-rose-200">
                                Deductions & LOP
                            </div>
                            <div className="p-4 flex flex-col gap-3 min-h-[250px]">
                                {viewTarget?.deductions.map((d, i) => (
                                    <div key={i} className="flex justify-between text-xs text-gray-700">
                                        <span>{d.name}</span>
                                        <span className="font-mono font-medium text-rose-700">৳ {d.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 bg-gray-900 text-white rounded-lg p-4 flex justify-between items-center shadow-md">
                        <span className="font-bold text-xs uppercase tracking-widest">Net Payable Salary</span>
                        <span className="font-mono font-black text-2xl">৳ {viewTarget?.netSalary.toLocaleString()}</span>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>Close Ledger</Button>
                </div>
            </div>
        </Drawer>
    );
}