import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CouponType = "all" | "brand" | "product" | "pre_owned";
export type CouponVisibility = "Public" | "Private";
export type CouponStatus = "Active" | "Inactive";

export interface Coupon {
    id: string;
    code: string;
    type: CouponType;
    targetIds?: string[]; // Holds selected Brand IDs or Product IDs if type is not "all"
    discountAmount: number;
    startDate: string; // ISO string
    endDate: string; // ISO string
    usageLimit: number | null;
    minPurchaseAmount: number | null;
    visibility: CouponVisibility;
    status: CouponStatus;
}

interface CouponStore {
    coupons: Coupon[];
    addCoupon: (coupon: Omit<Coupon, "id">) => void;
    updateCoupon: (id: string, updatedData: Partial<Coupon>) => void;
    deleteCoupon: (id: string) => void;
    bulkDeleteCoupons: (ids: string[]) => void;
    toggleStatus: (id: string) => void;
}

export const useCouponStore = create<CouponStore>()(
    persist(
        (set) => ({
            coupons: [
                {
                    id: "1",
                    code: "AKRAM001",
                    type: "all",
                    discountAmount: 200,
                    startDate: "2026-07-22T00:00:00.000Z",
                    endDate: "2026-08-31T23:59:59.000Z",
                    usageLimit: null,
                    minPurchaseAmount: null,
                    visibility: "Private",
                    status: "Inactive"
                },
                {
                    id: "2",
                    code: "S23USED",
                    type: "pre_owned",
                    discountAmount: 300,
                    startDate: "2026-06-28T00:00:00.000Z",
                    endDate: "2026-07-31T23:59:59.000Z",
                    usageLimit: 100,
                    minPurchaseAmount: 5000,
                    visibility: "Public",
                    status: "Active"
                }
            ],
            addCoupon: (couponData) => set((state) => ({
                coupons: [...state.coupons, { ...couponData, id: Date.now().toString() }]
            })),
            updateCoupon: (id, updatedData) => set((state) => ({
                coupons: state.coupons.map(coupon => coupon.id === id ? { ...coupon, ...updatedData } : coupon)
            })),
            deleteCoupon: (id) => set((state) => ({
                coupons: state.coupons.filter(coupon => coupon.id !== id)
            })),
            bulkDeleteCoupons: (ids) => set((state) => ({
                coupons: state.coupons.filter(coupon => !ids.includes(coupon.id))
            })),
            toggleStatus: (id) => set((state) => ({
                coupons: state.coupons.map(coupon =>
                    coupon.id === id
                        ? { ...coupon, status: coupon.status === "Active" ? "Inactive" : "Active" }
                        : coupon
                )
            }))
        }),
        { name: "erp-coupon-storage-v1" }
    )
);