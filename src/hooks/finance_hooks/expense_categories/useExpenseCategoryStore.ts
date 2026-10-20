import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ExpenseCategory {
    id: string;
    name: string;
    logo: string | null;
    totalCount: number;
}

interface ExpenseCategoryState {
    categories: ExpenseCategory[];
    addCategory: (category: Omit<ExpenseCategory, "id" | "totalCount">) => void;
    updateCategory: (id: string, updated: Partial<ExpenseCategory>) => void;
    deleteCategory: (id: string) => void;
    bulkDeleteCategories: (ids: string[]) => void;
}

export const useExpenseCategoryStore = create<ExpenseCategoryState>()(
    persist(
        (set) => ({
            categories: [
                { id: "1", name: "Mobile Recharge", logo: "📱", totalCount: 7 },
                { id: "2", name: "Phone Service", logo: "📞", totalCount: 6 },
                { id: "3", name: "Office Stationary", logo: "📎", totalCount: 1 },
                { id: "4", name: "Employee Conveyance (TA,DA)", logo: "🚕", totalCount: 31 },
                { id: "5", name: "Office Supplies", logo: "🗂️", totalCount: 4 },
                { id: "6", name: "Investor profit", logo: "💰", totalCount: 15 },
            ],
            addCategory: (newCategory) =>
                set((state) => ({
                    categories: [{ ...newCategory, id: crypto.randomUUID(), totalCount: 0 }, ...state.categories],
                })),
            updateCategory: (id, updated) =>
                set((state) => ({
                    categories: state.categories.map((item) =>
                        item.id === id ? { ...item, ...updated } : item
                    ),
                })),
            deleteCategory: (id) =>
                set((state) => ({
                    categories: state.categories.filter((item) => item.id !== id),
                })),
            bulkDeleteCategories: (ids) =>
                set((state) => ({
                    categories: state.categories.filter((item) => !ids.includes(item.id)),
                })),
        }),
        {
            name: "tekzo_expense_category_store",
        }
    )
);