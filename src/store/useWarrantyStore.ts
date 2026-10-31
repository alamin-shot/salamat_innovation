import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WarrantyStatus = "Pending" | "Processing" | "Resolved" | "Rejected";

export interface WarrantyRequest {
    id: string;
    ticketNumber: string;
    customerName: string;
    phone: string;
    productName: string;
    serialNumber: string;
    issueDescription: string;
    adminNote: string | null;
    status: WarrantyStatus;
    createdAt: string;
}

interface WarrantyStore {
    requests: WarrantyRequest[];
    addRequest: (request: Omit<WarrantyRequest, "id" | "ticketNumber" | "createdAt">) => void;
    updateRequest: (id: string, updatedData: Partial<WarrantyRequest>) => void;
    deleteRequest: (id: string) => void;
    bulkDeleteRequests: (ids: string[]) => void;
    updateStatus: (id: string, status: WarrantyStatus) => void;
}

export const useWarrantyStore = create<WarrantyStore>()(
    persist(
        (set) => ({
            requests: [
                {
                    id: "1",
                    ticketNumber: "WR-2610-001",
                    customerName: "Mahmud Hasan",
                    phone: "01711000000",
                    productName: "Samsung Galaxy Z Fold 5",
                    serialNumber: "354123098765432",
                    issueDescription: "Inner display has a green line appearing down the middle after the recent update.",
                    adminNote: "Sent to Samsung official service center on Oct 28.",
                    status: "Processing",
                    createdAt: "2026-10-27T09:15:00.000Z"
                },
                {
                    id: "2",
                    ticketNumber: "WR-2610-002",
                    customerName: "Sadia Islam",
                    phone: "01811000000",
                    productName: "Anker Soundcore Liberty 4",
                    serialNumber: "SN88776655",
                    issueDescription: "Left earbud is not charging when placed in the case.",
                    adminNote: null,
                    status: "Pending",
                    createdAt: "2026-10-30T11:20:00.000Z"
                }
            ],
            addRequest: (requestData) => set((state) => ({
                requests: [...state.requests, {
                    ...requestData,
                    id: Date.now().toString(),
                    ticketNumber: `WR-2610-00${state.requests.length + 3}`,
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
        { name: "erp-warranty-storage-v1" }
    )
);