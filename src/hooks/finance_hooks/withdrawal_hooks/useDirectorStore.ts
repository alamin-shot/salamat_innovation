import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Director {
    id: string;
    shop: string;
    name: string;
    avatar: string;
    totalWithdrawalCount: number;
}

interface DirectorState {
    directors: Director[];
    addDirector: (director: Omit<Director, "id" | "totalWithdrawalCount">) => void;
    updateDirector: (id: string, updated: Partial<Director>) => void;
    deleteDirector: (id: string) => void;
    bulkDeleteDirectors: (ids: string[]) => void;
    incrementWithdrawalCount: (id: string) => void;
}

export const useDirectorStore = create<DirectorState>()(
    persist(
        (set) => ({
            directors: [
                { id: "1", shop: "TEKZO A-Block", name: "Mohammadun Nabi", avatar: "MN", totalWithdrawalCount: 16 },
                { id: "2", shop: "TEKZO A-Block", name: "Atick Hasan Sajib", avatar: "AH", totalWithdrawalCount: 215 },
            ],
            addDirector: (newDirector) =>
                set((state) => ({
                    directors: [{ ...newDirector, id: crypto.randomUUID(), totalWithdrawalCount: 0 }, ...state.directors],
                })),
            updateDirector: (id, updated) =>
                set((state) => ({
                    directors: state.directors.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deleteDirector: (id) =>
                set((state) => ({
                    directors: state.directors.filter((item) => item.id !== id),
                })),
            bulkDeleteDirectors: (ids) =>
                set((state) => ({
                    directors: state.directors.filter((item) => !ids.includes(item.id)),
                })),
            incrementWithdrawalCount: (id) =>
                set((state) => ({
                    directors: state.directors.map((item) =>
                        item.id === id ? { ...item, totalWithdrawalCount: item.totalWithdrawalCount + 1 } : item
                    ),
                })),
        }),
        { name: "tekzo_director_store" }
    )
);