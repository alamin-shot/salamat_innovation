"use client";
import { useExpensesManager } from "@/hooks/finance_hooks/expenses/useExpensesManager";
import { ExpensesTable } from "./ExpensesTable";
import { ExpenseFormDrawer } from "./form-drawer/ExpenseFormDrawer";
import { ExpenseVoucherDrawer } from "./voucher-drawer/ExpenseVoucherDrawer";
import { ExpenseReportDrawer } from "./report-drawer/ExpensesReportDrawer";

export function ExpensesClient() {
    const manager = useExpensesManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Expenses</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <ExpensesTable manager={manager} />
            </div>

            <ExpenseFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-expense"}
                onClose={manager.closeView}
            />

            <ExpenseVoucherDrawer
                record={manager.activeVoucherRecord}
                isOpen={manager.activeDrawer === "view-expense-voucher"}
                onClose={manager.closeView}
            />

            <ExpenseReportDrawer
                data={manager.activeReportData}
                isOpen={manager.activeDrawer === "view-expense-report"}
                onClose={manager.closeView}
            />
        </div>
    );
}