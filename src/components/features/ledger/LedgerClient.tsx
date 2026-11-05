"use client";
import { useLedgerManager } from "@/hooks/ledger_hooks/useLedgerManager";
import { AccountsDashboard } from "./dashboards/AccountsDashboard";
import { JournalDashboard } from "./dashboards/JournalDashboard";
import { Users, BookOpen, ScrollText } from "lucide-react";
import { AccountDrawer } from "./drawers/AccountDrawer";
import { TransactionDrawer } from "./drawers/TransactionDrawer";
import { ReconciliationDashboard } from "./dashboards/ReconciliationDashboard";

export function LedgerClient() {
    const manager = useLedgerManager();

    return (
        <div className="flex flex-col w-full h-full gap-2 p-3 sm:p-4">
            {/* Top-Level Module Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Global Ledger</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage accounts, track global transactions, and reconcile statements.</p>
                </div>

                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 w-full sm:w-auto shadow-sm">
                    <button onClick={() => manager.setActiveModule("accounts")} className={`flex items-center gap-2 flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeModule === "accounts" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"}`}>
                        <Users className="w-3.5 h-3.5" /> Accounts
                    </button>
                    <button onClick={() => manager.setActiveModule("journal")} className={`flex items-center gap-2 flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeModule === "journal" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"}`}>
                        <BookOpen className="w-3.5 h-3.5" /> Master Journal
                    </button>
                    <button onClick={() => manager.setActiveModule("reconciliation")} className={`flex items-center gap-2 flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeModule === "reconciliation" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"}`}>
                        <ScrollText className="w-3.5 h-3.5" /> Reconciliation
                    </button>
                </div>
            </div>

            {/* Dynamic Dashboard Rendering */}
            <div className="flex-1 flex flex-col min-h-0">
                {manager.activeModule === "accounts" && <AccountsDashboard manager={manager} />}
                {manager.activeModule === "journal" && <JournalDashboard manager={manager} />}
                {manager.activeModule === "reconciliation" && <ReconciliationDashboard manager={manager} />} {/* <-- UPDATE THIS LINE */}
            </div>

            {/* Hidden Drawers (To be built in Phase 3) */}
            <AccountDrawer manager={manager} />
            <TransactionDrawer manager={manager} />
        </div>
    );
}