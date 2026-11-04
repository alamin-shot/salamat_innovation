import * as React from "react";
import { PayslipItem } from "@/types/payroll.types";

interface PrintablePayslipProps {
    payslip: PayslipItem | null;
}

export const PrintablePayslip = React.forwardRef<HTMLDivElement, PrintablePayslipProps>(({ payslip }, ref) => {
    if (!payslip) return null;

    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] p-[20mm] bg-white text-black font-sans box-border">
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Salamat Innovation</h1>
                    <p className="text-sm text-gray-600 mt-1">Official Employee Payslip</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">Payslip ID: {payslip.id.toUpperCase()}</p>
                    <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
                <div>
                    <p className="font-bold text-gray-500 uppercase text-[10px] tracking-widest mb-1">Employee Name</p>
                    <p className="font-bold text-lg">{payslip.employeeName}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-500 uppercase text-[10px] tracking-widest mb-1">Basic Salary</p>
                    <p className="font-mono text-lg font-bold">৳ {payslip.basicSalary.toLocaleString()}</p>
                </div>
            </div>

            {/* T-Account Ledger */}
            <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded mb-8">
                {/* Earnings */}
                <div className="border-r border-gray-300">
                    <div className="bg-gray-100 p-2 border-b border-gray-300 text-xs font-bold uppercase tracking-wider text-center">Earnings & Allowances</div>
                    <div className="p-4 flex flex-col gap-2 min-h-[200px]">
                        {payslip.allowances.map((a, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>{a.name}</span>
                                <span className="font-mono">৳ {a.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Deductions */}
                <div>
                    <div className="bg-gray-100 p-2 border-b border-gray-300 text-xs font-bold uppercase tracking-wider text-center">Deductions & Statutory</div>
                    <div className="p-4 flex flex-col gap-2 min-h-[200px]">
                        {payslip.deductions.map((d, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>{d.name}</span>
                                <span className="font-mono">৳ {d.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Net Payable Footer */}
            <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-lg print:border-gray-900 print:bg-gray-900 !print:text-white">
                <span className="font-bold uppercase tracking-widest text-sm">Net Payable Amount</span>
                <span className="font-mono font-black text-2xl">৳ {payslip.netSalary.toLocaleString()}</span>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-32 text-center text-sm">
                <div>
                    <div className="border-t border-gray-400 pt-2 w-48 mx-auto font-bold">Employee Signature</div>
                </div>
                <div>
                    <div className="border-t border-gray-400 pt-2 w-48 mx-auto font-bold">Authorized Signatory</div>
                </div>
            </div>
        </div>
    );
});
PrintablePayslip.displayName = "PrintablePayslip";