"use client";
import { FileText } from "lucide-react";
import { usePayrunManager } from "@/hooks/payroll_hooks/usePayrunManager";

export function PayrunGrid({ manager }: { manager: ReturnType<typeof usePayrunManager> }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {manager.payruns.map(pr => (
                <div key={pr.id} className="erp-card bg-white p-5 border border-gray-100 rounded-xl shadow-sm flex flex-col gap-4 hover:border-brand-primary/30 transition">
                    <div className="flex items-start justify-between border-b border-gray-50 pb-3">
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">{pr.title}</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Generated: {pr.generatedOn}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">Completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                        <FileText className="w-4 h-4 text-brand-primary" /> {pr.totalPayslips} Payslips Generated
                    </div>
                </div>
            ))}
        </div>
    );
}