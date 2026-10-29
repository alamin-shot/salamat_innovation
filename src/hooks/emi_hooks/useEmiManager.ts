"use client";
import { useState, useCallback } from "react";
import { useEmiStore, EmiBank } from "@/store/useEmiStore";
import { toast } from "sonner";

export type EmiDrawerState = "none" | "add" | "edit";

export function useEmiManager() {
    const store = useEmiStore();

    const [activeDrawer, setActiveDrawer] = useState<EmiDrawerState>("none");
    const [activeBankId, setActiveBankId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveBank = useCallback((): EmiBank | undefined => {
        if (!activeBankId) return undefined;
        return store.banks.find(b => b.id === activeBankId);
    }, [activeBankId, store.banks]);

    const openAddDrawer = useCallback(() => {
        setActiveBankId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveBankId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveBankId(null), 300);
    }, []);

    const generateGatewayKey = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const handleSubmit = useCallback((formData: Omit<EmiBank, "id">) => {
        if (!formData.bankName.trim()) {
            toast.error("Bank name is required");
            return;
        }

        if (activeDrawer === "add") {
            store.addBank(formData);
            toast.success("EMI Bank configuration added");
        } else if (activeDrawer === "edit" && activeBankId) {
            store.updateBank(activeBankId, formData);
            toast.success("EMI Bank configuration updated");
        }
        closeDrawer();
    }, [activeDrawer, activeBankId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this bank?")) {
            store.deleteBank(id);
            toast.success("Bank deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} banks?`)) {
            store.bulkDeleteBanks(selectedIds);
            setSelectedIds([]);
            toast.success("Banks deleted");
        }
    }, [selectedIds, store]);

    return {
        banks: store.banks,
        activeDrawer,
        activeBankId,
        selectedIds,
        setSelectedIds,
        getActiveBank,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        generateGatewayKey
    };
}

export type EmiManagerType = ReturnType<typeof useEmiManager>;