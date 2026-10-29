import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EliteTier {
    id: string;
    name: string;
    tagline: string;
    points: number;
    logo: string | null;
    banner: string | null;
    benefits: string[];
}

interface EliteStore {
    tiers: EliteTier[];
    addTier: (tier: Omit<EliteTier, "id">) => void;
    updateTier: (id: string, updatedData: Partial<Omit<EliteTier, "id">>) => void;
    deleteTier: (id: string) => void;
}

// Initializing with data matching your screenshot's aesthetic
const initialTiers: EliteTier[] = [
    {
        id: "1",
        name: "Platinum",
        tagline: "Pinch Your Pennies, Not Your Style",
        points: 50000,
        logo: null,
        banner: null,
        benefits: [
            "Triple Reward Points (Earn 3x reward points on every eligible purchase...)",
            "Exclusive Platinum Pricing (Unlock the best member-only prices on flagship smartphones...)",
            "First Access to New Launches (Receive priority access and pre-order privileges...)",
            "Premium Birthday Privilege (Enjoy a premium birthday gift, exclusive voucher...)"
        ]
    },
    {
        id: "2",
        name: "Gold",
        tagline: "Retro Vibe, Modern Deals",
        points: 25000,
        logo: null,
        banner: null,
        benefits: [
            "Double Reward Points on all electronics",
            "Free standard shipping on orders over 1000 BDT"
        ]
    },
    {
        id: "3",
        name: "Silver",
        tagline: "Your Wallet Will Thank You",
        points: 10000,
        logo: null,
        banner: null,
        benefits: [
            "1.5x Reward Points on all purchases",
            "Early access to seasonal sales"
        ]
    },
    {
        id: "4",
        name: "Bronze",
        tagline: "Deals to Delight Your Day",
        points: 0,
        logo: null,
        banner: null,
        benefits: [
            "Standard Reward Points",
            "Welcome bonus voucher"
        ]
    }
];

export const useEliteStore = create<EliteStore>()(
    persist(
        (set) => ({
            tiers: initialTiers,
            addTier: (tierData) => set((state) => ({
                tiers: [...state.tiers, { ...tierData, id: Date.now().toString() }]
            })),
            updateTier: (id, updatedData) => set((state) => ({
                tiers: state.tiers.map(tier => tier.id === id ? { ...tier, ...updatedData } : tier)
            })),
            deleteTier: (id) => set((state) => ({
                tiers: state.tiers.filter(tier => tier.id !== id)
            }))
        }),
        { name: "erp-elite-storage-v2" }
    )
);