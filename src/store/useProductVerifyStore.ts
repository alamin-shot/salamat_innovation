import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VerifyStatus = "Pending" | "Approved" | "Rejected" | "Active";

export interface ProductVerifyRequest {
    id: string;
    userName: string;
    phone: string;
    productName: string;
    shopName: string;
    qrCode: string;
    verifiedDate: string;
    fullAddress: string;
    attachmentUrl: string | null;
    status: VerifyStatus;
}

interface ProductVerifyStore {
    requests: ProductVerifyRequest[];
    updateStatus: (id: string, status: VerifyStatus) => void;
    deleteRequest: (id: string) => void;
    bulkDeleteRequests: (ids: string[]) => void;
}

export const useProductVerifyStore = create<ProductVerifyStore>()(
    persist(
        (set) => ({
            requests: [
                {
                    id: "1",
                    userName: "Rana Ajmed",
                    phone: "01407158194",
                    productName: "VOLTME Revo 20 Mini Bundle iRex Cable CTL",
                    shopName: "Apple&Series",
                    qrCode: "0001683126",
                    verifiedDate: "2026-03-28",
                    fullAddress: "Araihazar, Araihazar, 1450",
                    attachmentUrl: "#",
                    status: "Pending"
                },
                {
                    id: "2",
                    userName: "Pronob Chakraborty",
                    phone: "01648394118",
                    productName: "Aecooly Portable Handheld Fan Halo 02",
                    shopName: "Gadget & Gear",
                    qrCode: "0001689999",
                    verifiedDate: "2026-10-25",
                    fullAddress: "Dhanmondi, Dhaka",
                    attachmentUrl: null,
                    status: "Active"
                }
            ],
            updateStatus: (id, status) => set((state) => ({
                requests: state.requests.map(req => req.id === id ? { ...req, status } : req)
            })),
            deleteRequest: (id) => set((state) => ({
                requests: state.requests.filter(req => req.id !== id)
            })),
            bulkDeleteRequests: (ids) => set((state) => ({
                requests: state.requests.filter(req => !ids.includes(req.id))
            }))
        }),
        { name: "erp-product-verify-storage-v1" }
    )
);