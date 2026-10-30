import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SellDeviceStatus = "Pending" | "Contacted" | "Approved" | "Rejected";

export interface SellDeviceRequest {
    id: string;
    requestId: string;
    customerName: string;
    phone: string;
    deviceBrand: string;
    deviceModel: string;
    ramStorage: string;
    condition: string;
    expectedPrice: number;
    adminNote: string | null;
    status: SellDeviceStatus;
    createdAt: string;
}

interface SellDeviceStore {
    requests: SellDeviceRequest[];
    addRequest: (request: Omit<SellDeviceRequest, "id" | "requestId" | "createdAt">) => void;
    updateRequest: (id: string, updatedData: Partial<SellDeviceRequest>) => void;
    deleteRequest: (id: string) => void;
    bulkDeleteRequests: (ids: string[]) => void;
    updateStatus: (id: string, status: SellDeviceStatus) => void;
}

export const useSellDeviceStore = create<SellDeviceStore>()(
    persist(
        (set) => ({
            requests: [
                {
                    id: "1",
                    requestId: "SDR-2610-001",
                    customerName: "Fahim Rahman",
                    phone: "01711223344",
                    deviceBrand: "Apple",
                    deviceModel: "iPhone 13 Pro",
                    ramStorage: "8GB / 256GB",
                    condition: "Good - Minor Scratches",
                    expectedPrice: 55000,
                    adminNote: "Called customer, offered 50k. Waiting for reply.",
                    status: "Contacted",
                    createdAt: "2026-10-28T14:30:00.000Z"
                },
                {
                    id: "2",
                    requestId: "SDR-2610-002",
                    customerName: "Nusrat Jahan",
                    phone: "01811556677",
                    deviceBrand: "Samsung",
                    deviceModel: "Galaxy S22 Ultra",
                    ramStorage: "12GB / 512GB",
                    condition: "Flawless - Like New",
                    expectedPrice: 65000,
                    adminNote: null,
                    status: "Pending",
                    createdAt: "2026-10-29T10:15:00.000Z"
                }
            ],
            addRequest: (requestData) => set((state) => ({
                requests: [...state.requests, {
                    ...requestData,
                    id: Date.now().toString(),
                    requestId: `SDR-2610-00${state.requests.length + 3}`,
                    createdAt: new Date().toISOString()
                }]
            })),
            updateRequest: (id, updatedData) => set((state) => ({
                requests: state.requests.map(req => req.id === id ? { ...req, ...updatedData } : req)
            })),
            deleteRequest: (id) => set((state) => ({
                requests: state.requests.filter(req => req.id !== id)
            })),
            bulkDeleteRequests: (ids) => set((state) => ({
                requests: state.requests.filter(req => !ids.includes(req.id))
            })),
            updateStatus: (id, status) => set((state) => ({
                requests: state.requests.map(req => req.id === id ? { ...req, status } : req)
            }))
        }),
        { name: "erp-selldevice-storage-v1" }
    )
);