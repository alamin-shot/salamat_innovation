import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TenureRate {
    tenure: string; // e.g. "3 Months"
    enabled: boolean;
    chargeRate: number; // percentage
    active: boolean;
}

export interface EmiBank {
    id: string;
    bankName: string;
    gatewayKey: string;
    status: "Active" | "Inactive";
    tenureRates: TenureRate[];
}

interface EmiStore {
    banks: EmiBank[];
    addBank: (bank: Omit<EmiBank, "id">) => void;
    updateBank: (id: string, updatedData: Partial<EmiBank>) => void;
    deleteBank: (id: string) => void;
    bulkDeleteBanks: (ids: string[]) => void;
}

const DEFAULT_TENURES: TenureRate[] = [
    { tenure: "3 Months", enabled: true, chargeRate: 3.09, active: true },
    { tenure: "6 Months", enabled: true, chargeRate: 4.71, active: true },
    { tenure: "9 Months", enabled: true, chargeRate: 6.85, active: true },
    { tenure: "12 Months", enabled: true, chargeRate: 9.29, active: true },
    { tenure: "18 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "24 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "30 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "36 Months", enabled: false, chargeRate: 0, active: true },
];

export const useEmiStore = create<EmiStore>()(
    persist(
        (set) => ({
            banks: [
                {
                    id: "1",
                    bankName: "AB Bank PLC",
                    gatewayKey: "abbank",
                    status: "Active",
                    tenureRates: JSON.parse(JSON.stringify(DEFAULT_TENURES))
                },
                {
                    id: "2",
                    bankName: "BRAC Bank PLC",
                    gatewayKey: "bracbank",
                    status: "Active",
                    tenureRates: [
                        { tenure: "3 Months", enabled: true, chargeRate: 3.09, active: true },
                        { tenure: "6 Months", enabled: true, chargeRate: 4.71, active: true },
                        { tenure: "9 Months", enabled: true, chargeRate: 6.85, active: true },
                        { tenure: "12 Months", enabled: true, chargeRate: 9.29, active: true },
                        { tenure: "18 Months", enabled: true, chargeRate: 12.88, active: true },
                        { tenure: "24 Months", enabled: true, chargeRate: 18.34, active: true },
                        { tenure: "30 Months", enabled: false, chargeRate: 0, active: true },
                        { tenure: "36 Months", enabled: false, chargeRate: 0, active: true },
                    ]
                }
            ],
            addBank: (bankData) => set((state) => ({
                banks: [...state.banks, { ...bankData, id: Date.now().toString() }]
            })),
            updateBank: (id, updatedData) => set((state) => ({
                banks: state.banks.map(bank => bank.id === id ? { ...bank, ...updatedData } : bank)
            })),
            deleteBank: (id) => set((state) => ({
                banks: state.banks.filter(bank => bank.id !== id)
            })),
            bulkDeleteBanks: (ids) => set((state) => ({
                banks: state.banks.filter(bank => !ids.includes(bank.id))
            }))
        }),
        { name: "erp-emi-banks-storage-v1" }
    )
);