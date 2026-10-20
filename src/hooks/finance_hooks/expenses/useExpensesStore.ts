import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ExpenseItem {
    id: string;
    shopName: string;
    title: string;
    invoiceNumber: string;
    date: string;
    category: string;
    attachments: number;
    note: string;
    paymentMethod: string;
    amount: number;
    createdBy: string;
}

interface ExpensesState {
    expenses: ExpenseItem[];
    addExpense: (expense: Omit<ExpenseItem, "id">) => void;
    updateExpense: (id: string, updated: Partial<ExpenseItem>) => void;
    deleteExpense: (id: string) => void;
    bulkDeleteExpenses: (ids: string[]) => void;
}

export const useExpensesStore = create<ExpensesState>()(
    persist(
        (set) => ({
            expenses: [
                { id: "1", shopName: "TEKZO A-Block", title: "cha coffee", invoiceNumber: "EXP-1790", date: "2026-10-18", category: "Entertainment / Client Treats", attachments: 0, note: "-", paymentMethod: "Cash", amount: 150.0, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "2", shopName: "TEKZO A-Block", title: "Ta Da", invoiceNumber: "EXP-1789", date: "2026-10-18", category: "Employee Conveyance (TA, DA)", attachments: 0, note: "-", paymentMethod: "Cash", amount: 300.0, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "3", shopName: "TEKZO A-Block", title: "Foysal Salary for the month of september", invoiceNumber: "EXP-1788", date: "2026-10-18", category: "Salaries & Wages", attachments: 0, note: "-", paymentMethod: "Cash", amount: 30000.0, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "4", shopName: "TEKZO A-Block", title: "cha", invoiceNumber: "EXP-1787", date: "2026-10-17", category: "Entertainment / Client Treats", attachments: 0, note: "-", paymentMethod: "Cash", amount: 50.0, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "5", shopName: "TEKZO A-Block", title: "Glass Cover", invoiceNumber: "EXP-1786", date: "2026-10-17", category: "Small Tools or Accessories", attachments: 0, note: "-", paymentMethod: "Cash", amount: 450.0, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "6", shopName: "TEKZO A-Block", title: "Nayeem Convance", invoiceNumber: "EXP-1785", date: "2026-10-17", category: "Employee Conveyance (TA, DA)", attachments: 0, note: "-", paymentMethod: "Cash", amount: 450.0, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "7", shopName: "TEKZO A-Block", title: "poli iens", invoiceNumber: "EXP-1784", date: "2026-10-15", category: "Small Tools or Accessories", attachments: 0, note: "Urgent purchase", paymentMethod: "Cash", amount: 450.0, createdBy: "Md Zihadul Islam Sazzad" },
            ],
            addExpense: (newExpense) =>
                set((state) => ({
                    expenses: [{ ...newExpense, id: crypto.randomUUID() }, ...state.expenses],
                })),
            updateExpense: (id, updated) =>
                set((state) => ({
                    expenses: state.expenses.map((item) =>
                        item.id === id ? { ...item, ...updated } : item
                    ),
                })),
            deleteExpense: (id) =>
                set((state) => ({
                    expenses: state.expenses.filter((item) => item.id !== id),
                })),
            bulkDeleteExpenses: (ids) =>
                set((state) => ({
                    expenses: state.expenses.filter((item) => !ids.includes(item.id)),
                })),
        }),
        {
            name: "tekzo_expenses_store",
        }
    )
);