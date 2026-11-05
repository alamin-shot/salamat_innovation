import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { Asset, AssetCategory, AssetLedgerLog } from "@/types/assets.types";

// IndexedDB Storage Adapter to prevent 5MB LocalStorage Crashes
const idbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => (await get(name)) || null,
    setItem: async (name: string, value: string): Promise<void> => await set(name, value),
    removeItem: async (name: string): Promise<void> => await del(name),
};

interface AssetStore {
    categories: AssetCategory[];
    assets: Asset[];
    ledgerLogs: AssetLedgerLog[];
    categorySequences: Record<string, number>; // Atomic code generation

    // Actions
    addCategory: (cat: Omit<AssetCategory, "id">) => void;
    addAsset: (asset: Omit<Asset, "id" | "assetCode" | "_version" | "currentDepreciatedValue">) => void;
    updateAsset: (id: string, updates: Partial<Asset>, expectedVersion: number) => void;
    assignAsset: (id: string, empId: string, empName: string, note: string) => void;
    returnAsset: (id: string, conditionNote: string, repairCost?: number) => void;
}

export const useGlobalAssetStore = create<AssetStore>()(
    persist(
        (set, get) => ({
            categories: [],
            assets: [],
            ledgerLogs: [],
            categorySequences: {},

            addCategory: (cat) => set((state) => ({
                categories: [...state.categories, { ...cat, id: crypto.randomUUID() }]
            })),

            addAsset: (payload) => set((state) => {
                const category = state.categories.find(c => c.id === payload.categoryId);
                const prefix = category?.prefix || "AST-";
                const seq = (state.categorySequences[payload.categoryId] || 0) + 1;
                const newCode = `${prefix}${seq.toString().padStart(4, "0")}`;

                const newAsset: Asset = {
                    ...payload,
                    id: crypto.randomUUID(),
                    assetCode: newCode,
                    currentDepreciatedValue: payload.purchaseCost, // Initial calc
                    _version: 1
                };

                const log: AssetLedgerLog = {
                    id: crypto.randomUUID(),
                    assetId: newAsset.id,
                    action: "Purchased",
                    timestamp: new Date().toISOString(),
                    cost: payload.purchaseCost,
                    note: "Initial Purchase"
                };

                return {
                    assets: [...state.assets, newAsset],
                    ledgerLogs: [...state.ledgerLogs, log],
                    categorySequences: { ...state.categorySequences, [payload.categoryId]: seq }
                };
            }),

            updateAsset: (id, updates, expectedVersion) => set((state) => {
                const idx = state.assets.findIndex(a => a.id === id);
                if (idx === -1) return state;
                if (state.assets[idx]._version !== expectedVersion) {
                    console.error("Concurrency Error: Asset modified by another user.");
                    return state; // In UI, we will catch this and toast an error
                }
                const newAssets = [...state.assets];
                newAssets[idx] = { ...newAssets[idx], ...updates, _version: expectedVersion + 1 };
                return { assets: newAssets };
            }),

            assignAsset: (id, empId, empName, note) => set((state) => {
                const idx = state.assets.findIndex(a => a.id === id);
                if (idx === -1 || state.assets[idx].status !== "Available") return state;

                const newAssets = [...state.assets];
                newAssets[idx] = {
                    ...newAssets[idx],
                    status: "Assigned",
                    assignedToId: empId,
                    assignedToName: empName,
                    _version: newAssets[idx]._version + 1
                };

                const log: AssetLedgerLog = {
                    id: crypto.randomUUID(),
                    assetId: id,
                    action: "Assigned",
                    timestamp: new Date().toISOString(),
                    employeeId: empId,
                    employeeName: empName,
                    note
                };

                return { assets: newAssets, ledgerLogs: [...state.ledgerLogs, log] };
            }),

            returnAsset: (id, note, repairCost) => set((state) => {
                const idx = state.assets.findIndex(a => a.id === id);
                if (idx === -1 || state.assets[idx].status !== "Assigned") return state;

                const newAssets = [...state.assets];
                const empId = newAssets[idx].assignedToId;
                const empName = newAssets[idx].assignedToName;

                newAssets[idx] = {
                    ...newAssets[idx],
                    status: repairCost ? "Under Maintenance" : "Available",
                    assignedToId: undefined,
                    assignedToName: undefined,
                    _version: newAssets[idx]._version + 1
                };

                const log: AssetLedgerLog = {
                    id: crypto.randomUUID(),
                    assetId: id,
                    action: "Returned",
                    timestamp: new Date().toISOString(),
                    employeeId: empId,
                    employeeName: empName,
                    cost: repairCost,
                    note
                };

                return { assets: newAssets, ledgerLogs: [...state.ledgerLogs, log] };
            })
        }),
        {
            name: "erp-asset-engine-v1",
            storage: createJSONStorage(() => idbStorage),
            version: 1, // Ready for future schema migrations
        }
    )
);