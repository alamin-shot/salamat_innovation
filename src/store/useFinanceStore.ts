import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Director {
    id: string; fullName: string; title: string; email: string; phone: string; avatar: string | null;
}
export interface Transaction {
    id: string; directorId: string; amount: number; date: string; note: string; type: "deposit" | "withdrawal";
}

interface FinanceState {
    directors: Director[];
    transactions: Transaction[];
    addDirector: (d: Omit<Director, "id">) => void;
    updateDirector: (id: string, d: Partial<Director>) => void;
    deleteDirector: (id: string) => void;
    addTransaction: (t: Omit<Transaction, "id">) => void;
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set) => ({
            directors: [
                { id: "1", fullName: "Mohammadun Nabi", title: "Chairman", email: "nabi@gmail.com", phone: "01711000000", avatar: "MN" }
            ],
            transactions: [],
            addDirector: (newDir) => set((state) => ({ directors: [{ ...newDir, id: crypto.randomUUID() }, ...state.directors] })),
            updateDirector: (id, updated) => set((state) => ({ directors: state.directors.map(d => d.id === id ? { ...d, ...updated } : d) })),
            deleteDirector: (id) => set((state) => ({ directors: state.directors.filter(d => d.id !== id) })),
            addTransaction: (newTx) => set((state) => ({ transactions: [{ ...newTx, id: crypto.randomUUID() }, ...state.transactions] })),
        }),
        { name: "tekzo_finance_store" }
    )
);