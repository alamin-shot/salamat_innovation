"use client";
import { useExpenseCategoriesManager } from "@/hooks/finance_hooks/expense_categories/useExpenseCategoriesManager";
import { ExpenseCategoriesTable } from "./ExpenseCategoriesTable";
import { ExpenseCategoryFormDrawer } from "./form-drawer/ExpenseCategoryFormDrawer";

export function ExpenseCategoriesClient() {
    const manager = useExpenseCategoriesManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Expense Category List</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <ExpenseCategoriesTable manager={manager} />
            </div>

            <ExpenseCategoryFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-expense-category"}
                onClose={manager.closeView}
            />
        </div>
    );
}