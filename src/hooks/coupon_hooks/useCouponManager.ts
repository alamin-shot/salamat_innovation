"use client";
import { useState, useCallback } from "react";
import { useCouponStore, Coupon } from "@/store/useCouponStore";
import { toast } from "sonner";

export type CouponDrawerState = "none" | "add" | "edit";

export function useCouponManager() {
    const store = useCouponStore();

    // UI Routing State
    const [activeDrawer, setActiveDrawer] = useState<CouponDrawerState>("none");
    const [activeCouponId, setActiveCouponId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveCoupon = useCallback((): Coupon | undefined => {
        if (!activeCouponId) return undefined;
        return store.coupons.find(c => c.id === activeCouponId);
    }, [activeCouponId, store.coupons]);

    const openAddDrawer = useCallback(() => {
        setActiveCouponId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveCouponId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveCouponId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Omit<Coupon, "id">) => {
        // Date Validation
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            toast.error("End date must be after start date");
            return;
        }

        // Logic check: clear targets if type changed to 'all' or 'pre_owned'
        const finalData = { ...formData };
        if (finalData.type === "all" || finalData.type === "pre_owned") {
            finalData.targetIds = [];
        }

        if (activeDrawer === "add") {
            store.addCoupon(finalData);
            toast.success("Coupon created successfully");
        } else if (activeDrawer === "edit" && activeCouponId) {
            store.updateCoupon(activeCouponId, finalData);
            toast.success("Coupon updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeCouponId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this coupon?")) {
            store.deleteCoupon(id);
            toast.success("Coupon deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} coupons?`)) {
            store.bulkDeleteCoupons(selectedIds);
            setSelectedIds([]);
            toast.success("Coupons deleted");
        }
    }, [selectedIds, store]);

    const handleToggleStatus = useCallback((id: string) => {
        store.toggleStatus(id);
        toast.success("Coupon status updated");
    }, [store]);

    return {
        coupons: store.coupons,
        activeDrawer,
        activeCouponId,
        selectedIds,
        setSelectedIds,
        getActiveCoupon,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleToggleStatus
    };
}

export type CouponManagerType = ReturnType<typeof useCouponManager>;