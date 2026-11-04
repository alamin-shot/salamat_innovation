"use client";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useGlobalPayrollStore } from "@/store/useGlobalPayrollStore";
import { PayslipItem } from "@/types/payroll.types";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import { PayslipTable } from "./PayslipTable";
import { PayslipLedgerDrawer } from "../drawers/PayslipLedgerDrawer";
import { PrintablePayslip } from "../PrintablePayslip";


export function PayslipClient() {
    const store = useGlobalPayrollStore();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [viewTarget, setViewTarget] = useState<PayslipItem | null>(null);
    const [printTarget, setPrintTarget] = useState<PayslipItem | null>(null);

    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Payslip_${printTarget?.employeeName || "Doc"}`,
        pageStyle: "@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; } * { border-color: #e5e7eb !important; } }",
        onAfterPrint: () => setPrintTarget(null)
    });

    const triggerPrint = (ps: PayslipItem) => {
        setPrintTarget(ps);
        setTimeout(handlePrint, 100);
    };

    const handleBulkAction = (action: "Pay" | "Email") => {
        toast.success(`Bulk ${action === "Pay" ? "Marked as Paid" : "Emailed"} for ${selectedIds.length} payslips.`);
        setSelectedIds([]);
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Payslips</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Command center for payouts, ledgers, and document printing.</p>
                </div>
            </div>

            <PayslipTable
                payslips={store.payslips}
                selectedIds={selectedIds}
                onToggleSelect={(id) => setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])}
                onToggleSelectAll={(checked) => setSelectedIds(checked ? store.payslips.map(p => p.id) : [])}
                onView={setViewTarget}
                onPrint={triggerPrint}
            />

            {selectedIds.length > 0 && (
                <BulkActionBar selectedCount={selectedIds.length} onClearSelection={() => setSelectedIds([])}>
                    <Button variant="default" size="sm" onClick={() => handleBulkAction("Pay")}><CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Paid</Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("Email")}><Mail className="w-4 h-4 mr-1.5" /> Bulk Email PDF</Button>
                </BulkActionBar>
            )}

            <PayslipLedgerDrawer viewTarget={viewTarget} onClose={() => setViewTarget(null)} />

            <div className="hidden"><PrintablePayslip ref={printRef} payslip={printTarget} /></div>
        </div>
    );
}