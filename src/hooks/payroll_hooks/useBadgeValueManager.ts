"use client";
import { useState, useEffect } from "react";
import { useGlobalPayrollStore } from "@/store/useGlobalPayrollStore";
import { BadgeValueItem, ComputationBase } from "@/types/payroll.types";
import { toast } from "sonner";

export function useBadgeValueManager() {
    const store = useGlobalPayrollStore();

    const [localBadges, setLocalBadges] = useState<BadgeValueItem[]>([]);

    // Initialize local state from global store on mount
    useEffect(() => {
        setLocalBadges(store.badgeValues);
    }, [store.badgeValues]);

    const activeBeneficiaries = store.beneficiaries.filter(b => b.status === "Active");

    const addBadge = (defaultType: "Allowance" | "Deduction" | "Statutory") => {
        const availableBens = activeBeneficiaries.filter(b => b.type === defaultType);
        if (availableBens.length === 0) {
            toast.error(`No active ${defaultType} beneficiaries exist. Add one first.`);
            return;
        }
        const newBadge: BadgeValueItem = {
            id: `bv-${Date.now()}`,
            beneficiaryId: availableBens[0].id,
            amount: 0,
            computationBase: "Fixed Amount"
        };
        setLocalBadges([...localBadges, newBadge]);
    };

    const updateBadge = (id: string, key: keyof BadgeValueItem, value: any) => {
        setLocalBadges(localBadges.map(b => b.id === id ? { ...b, [key]: value } : b));
    };

    const removeBadge = (id: string) => {
        setLocalBadges(localBadges.filter(b => b.id !== id));
    };

    const handleSaveAll = () => {
        // Validation
        const hasZeros = localBadges.some(b => b.amount < 0);
        if (hasZeros) {
            toast.error("Amounts cannot be negative");
            return;
        }
        store.saveBadgeValues(localBadges);
        toast.success("Global Badge Values saved and synced for upcoming payruns.");
    };

    return {
        localBadges,
        activeBeneficiaries,
        addBadge, updateBadge, removeBadge, handleSaveAll
    };
}