"use client";
import { Drawer } from "@/components/ui/Drawer";
import { useReportManager } from "@/hooks/report_hooks/useReportManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { FileText, Package, CheckCircle } from "lucide-react";

// --- SUB-VIEWS (These can be split into separate files later) ---

function SaleDetailView({ record }: { record: any }) {
    if (!record) return null;
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="erp-card bg-white p-4">
                    <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Customer</p>
                    <p className="text-sm font-bold text-gray-900">{record.customer}</p>
                </div>
                <div className="erp-card bg-white p-4">
                    <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Invoice / Date</p>
                    <p className="text-sm font-bold text-gray-900">{record.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <div className="erp-card bg-white p-4 flex flex-col justify-center items-end">
                    <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Total Amount</p>
                    <p className="text-xl font-black text-emerald-600">৳ {record.totalAmount.toLocaleString()}</p>
                </div>
            </div>

            <div className="erp-card bg-white p-0 overflow-hidden shadow-sm mt-2">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-sm font-bold text-gray-800">Sold Items Breakdown</h3>
                </div>
                <div className="overflow-x-auto p-4">
                    {/* Placeholder for relational Line Items data */}
                    <div className="text-center py-10 text-gray-400 text-xs italic">
                        Detailed line items will be populated from the relational API based on Invoice ID: {record.id}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DefaultDetailView({ record }: { record: any }) {
    if (!record) return null;
    return (
        <div className="erp-card bg-white p-6 flex flex-col items-center justify-center min-h-[300px] text-gray-500 text-sm">
            <FileText className="w-12 h-12 text-gray-200 mb-2" />
            <p>Select a specific report type to view formatted details.</p>
            <pre className="mt-4 p-4 bg-gray-50 rounded-lg text-xs font-mono text-left w-full max-w-lg overflow-auto">
                {JSON.stringify(record, null, 2)}
            </pre>
        </div>
    );
}

// --- MAIN DRAWER ROUTER ---

export function ReportDetailDrawer({ manager }: { manager: ReturnType<typeof useReportManager> }) {
    const isOpen = manager.drawerMode === "detail";
    const { activeReport, activeRecord } = manager;

    // Component Router
    const renderSubView = () => {
        switch (activeReport) {
            case "sale": return <SaleDetailView record={activeRecord} />;
            // Add case "profit_loss", case "damage", etc. here
            default: return <DefaultDetailView record={activeRecord} />;
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            title={`Report Details: ${activeReport.replace("_", " ").toUpperCase()}`}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full bg-gray-50/50 p-4 overflow-y-auto custom-scrollbar">
                {renderSubView()}
            </div>
        </Drawer>
    );
}