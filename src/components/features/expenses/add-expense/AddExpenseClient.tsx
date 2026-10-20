"use client";
import { useAddExpenseManager } from "@/hooks/finance_hooks/add_expenses/useAddExpenseManager";
import { AddExpenseForm } from "./AddExpenseForm";

export function AddExpenseClient() {
    const manager = useAddExpenseManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Expense</h1>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 max-w-5xl">
                <AddExpenseForm manager={manager} />
            </div>
        </div>
    );
}