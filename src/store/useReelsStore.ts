import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReelStatus = "Active" | "Inactive";

export interface ReelRecord {
    id: string;
    productName: string;
    videoLink: string | null; // Represents the uploaded file/image link
    status: ReelStatus;
}

interface ReelsStore {
    reels: ReelRecord[];
    addReel: (reel: Omit<ReelRecord, "id">) => void;
    updateReel: (id: string, updatedData: Partial<Omit<ReelRecord, "id">>) => void;
    deleteReel: (id: string) => void;
    deleteMultipleReels: (ids: string[]) => void;
}

// Initializing with data matching your screenshot
const initialReels: ReelRecord[] = [
    { id: "1", productName: "iPhone 17 Pro Max", videoLink: "/path/to/video1.jpg", status: "Active" },
    { id: "2", productName: "JBL Tune 770NC", videoLink: null, status: "Active" },
    { id: "3", productName: "VOLTME Powerlink Utron Series C to C", videoLink: null, status: "Active" },
    { id: "4", productName: "VOLTME Hypercore 10K LED Rollz", videoLink: null, status: "Active" },
    { id: "5", productName: "VOLTME Revo 240 Power Hub", videoLink: null, status: "Active" },
    { id: "6", productName: "Anker Nano 45W Smart Display", videoLink: null, status: "Active" },
];

export const useReelsStore = create<ReelsStore>()(
    persist(
        (set) => ({
            reels: initialReels,
            addReel: (reelData) => set((state) => ({
                reels: [{ ...reelData, id: Date.now().toString() }, ...state.reels]
            })),
            updateReel: (id, updatedData) => set((state) => ({
                reels: state.reels.map(reel => reel.id === id ? { ...reel, ...updatedData } : reel)
            })),
            deleteReel: (id) => set((state) => ({
                reels: state.reels.filter(reel => reel.id !== id)
            })),
            deleteMultipleReels: (ids) => set((state) => ({
                reels: state.reels.filter(reel => !ids.includes(reel.id))
            }))
        }),
        { name: "erp-reels-storage-v2" }
    )
);