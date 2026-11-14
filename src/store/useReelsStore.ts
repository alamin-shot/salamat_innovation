import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReelRecord, ReelsState } from "@/types/reels";

// LAYER 2: Reels cache (future /api/reels).

const initialReels: ReelRecord[] = [
    { id: "1", productName: "iPhone 17 Pro Max", videoLink: null, status: "Active" },
    { id: "2", productName: "JBL Tune 770NC", videoLink: null, status: "Active" },
    { id: "3", productName: "VOLTME Powerlink Utron Series C to C", videoLink: null, status: "Active" },
    { id: "4", productName: "VOLTME Hypercore 10K LED Rollz", videoLink: null, status: "Active" },
    { id: "5", productName: "VOLTME Revo 240 Power Hub", videoLink: null, status: "Active" },
    { id: "6", productName: "Anker Nano 45W Smart Display", videoLink: null, status: "Active" },
];

export const useReelsStore = create<ReelsState>()(
    persist(
        (set) => ({
            reels: initialReels,
            addReel: (reelData) => set((state) => ({
                reels: [{ ...reelData, id: Date.now().toString() }, ...state.reels],
            })),
            updateReel: (id, updatedData) => set((state) => ({
                reels: state.reels.map((reel) => (reel.id === id ? { ...reel, ...updatedData } : reel)),
            })),
            deleteReel: (id) => set((state) => ({
                reels: state.reels.filter((reel) => reel.id !== id),
            })),
            deleteMultipleReels: (ids) => set((state) => ({
                reels: state.reels.filter((reel) => !ids.includes(reel.id)),
            })),
        }),
        {
            name: "erp-reels-storage-v2",
            version: 1,
            // version 1: placeholder paths (e.g. "/path/to/video1.jpg") were never real videos; clear them.
            migrate: (persisted) => {
                const state = persisted as { reels?: ReelRecord[] };
                return {
                    reels: (state.reels ?? initialReels).map((reel) => ({ ...reel, videoLink: reel.videoLink && /^https?:\/\//i.test(reel.videoLink) ? reel.videoLink : null })),
                } as ReelsState;
            },
        }
    )
);
