"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useReportManager } from "@/hooks/report_hooks/useReportManager";
import { MasterReportTable } from "./tables/MasterReportTable";
import { ReportDetailDrawer } from "./drawers/ReportDetailDrawer";
import { PrintableReport } from "./print/PrintableReport";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import {
    Search, Download, Filter, Printer, ArrowLeft,
    TrendingUp, Package, ShoppingCart, RefreshCcw, FileBox,
    ShieldAlert, CreditCard, PiggyBank, Landmark, Briefcase, Activity
} from "lucide-react";

// --- THE HUB CATALOG CONFIGURATION ---
const REPORT_CATEGORIES = [
    {
        title: "Financials & Banking",
        items: [
            { id: "profit_loss", label: "Profit Loss Report", desc: "Calculate net and gross margins", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
            { id: "expense", label: "Expense", desc: "Track operating and transactional costs", icon: Briefcase, color: "text-rose-600", bg: "bg-rose-100" },
            { id: "deposit", label: "Deposit Report", desc: "Monitor incoming funds and deposits", icon: PiggyBank, color: "text-blue-600", bg: "bg-blue-100" },
            { id: "withdrawal", label: "Withdrawal Report", desc: "Oversee outbound transfers", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-100" },
            { id: "transaction", label: "Transactions", desc: "Full ledger of all system transactions", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-100" },
            { id: "total_bank", label: "Total Bank Amount", desc: "Current balances across all accounts", icon: Landmark, color: "text-violet-600", bg: "bg-violet-100" },
        ]
    },
    {
        title: "Inventory & Logistics",
        items: [
            { id: "stock", label: "Stock", desc: "Track available inventory and warehouse levels", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
            { id: "stock_transfer", label: "Stock Transfer", desc: "Track stock moves between warehouses", icon: RefreshCcw, color: "text-indigo-600", bg: "bg-indigo-100" },
            { id: "cash_transfer", label: "Cash Transfer", desc: "Internal cash movements and approvals", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100" },
            { id: "damage", label: "Damage Product", desc: "Monitor damaged or unsellable items", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-100" },
        ]
    },
    {
        title: "Trade & Commerce",
        items: [
            { id: "sale", label: "Sale", desc: "Overview of customer sales transactions", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-100" },
            { id: "sale_return", label: "Sales Return", desc: "Manage return requests and refunds", icon: RefreshCcw, color: "text-amber-600", bg: "bg-amber-100" },
            { id: "purchase", label: "Purchase", desc: "Track procurement and supplier orders", icon: FileBox, color: "text-blue-600", bg: "bg-blue-100" },
            { id: "purchase_return", label: "Purchase Return", desc: "Manage returned supplier merchandise", icon: RefreshCcw, color: "text-rose-600", bg: "bg-rose-100" },
        ]
    }
];

export function ReportClient() {
    const manager = useReportManager();
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Salamat_Report_${manager.activeReport}`,
        pageStyle: "@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; } * { border-color: #d1d5db !important; } }"
    });

    // --------------------------------------------------------
    // VIEW 1: THE MASTER CATALOG HUB
    // --------------------------------------------------------
    if (manager.activeReport === "hub") {
        return (
            <div className="flex flex-col w-full h-full gap-4 p-4 lg:p-6 bg-gray-50/50 overflow-y-auto">
                <div className="mb-4">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Report Catalog Hub</h1>
                    <p className="text-sm text-gray-500 mt-1">Select an analytics module to view real-time data.</p>
                </div>

                <div className="flex flex-col gap-8">
                    {REPORT_CATEGORIES.map((category, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">{category.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {category.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => manager.changeReportType(item.id)}
                                            className="erp-card bg-white p-4 hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group flex items-start gap-4 border border-gray-100"
                                        >
                                            <div className={`p-3 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${item.bg} ${item.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{item.label}</h3>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --------------------------------------------------------
    // VIEW 2: THE DATA SPOKE (Command Ribbon + Master Table)
    // --------------------------------------------------------
    return (
        <div className="flex flex-col w-full h-full gap-2 p-3 sm:p-4 bg-gray-50/50">

            {/* Immersive Breadcrumb Navigation */}
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => manager.changeReportType("hub")} className="text-gray-500 hover:text-gray-900 px-2">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hub
                </Button>
                <span className="text-gray-300">/</span>
                <span className="text-sm font-bold text-gray-900 capitalize px-2">{manager.activeReport.replace("_", " ")} Report</span>
            </div>

            {/* The Unified Command Ribbon */}
            <div className="erp-card bg-white p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm z-20 relative border border-gray-100">

                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="erp-input pl-9 h-9 bg-gray-50/50 w-full"
                            value={manager.searchQuery}
                            onChange={(e) => manager.setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="w-40 shrink-0">
                        <DatePicker
                            value={manager.dateRange.start}
                            onChange={(val) => manager.setDateRange(prev => ({ ...prev, start: val }))}
                            label="Start Date"
                        />
                    </div>
                    <div className="w-40 shrink-0">
                        <DatePicker
                            value={manager.dateRange.end}
                            onChange={(val) => manager.setDateRange(prev => ({ ...prev, end: val }))}
                            label="End Date"
                        />
                    </div>

                    <Button variant="outline" size="icon-sm" className="h-9 w-9 shrink-0 border-gray-200 bg-gray-50/50" title="Advanced Columns">
                        <Filter className="w-4 h-4 text-gray-600" />
                    </Button>
                </div>

                {/* Export Actions */}
                <div className="flex items-center gap-2 w-full lg:w-auto lg:justify-end">
                    <Button variant="outline" size="sm" onClick={() => handlePrint()} className="bg-white shadow-2xs h-9">
                        <Printer className="w-3.5 h-3.5 mr-1.5" /> Print A4
                    </Button>
                    <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs h-9">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* The Dynamic Master Table */}
            {/* NOTE: We wrap this in a conditional opacity to utilize the concurrent transition */}
            <div className={`flex-1 flex flex-col transition-opacity duration-200 ${manager.isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <MasterReportTable manager={manager} />
            </div>

            {/* Hidden Drawers & Print Engines */}
            <ReportDetailDrawer manager={manager} />
            <PrintableReport ref={printRef} manager={manager} />
        </div>
    );
}