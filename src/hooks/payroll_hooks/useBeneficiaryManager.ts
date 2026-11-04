"use client";
import { useState, useMemo } from "react";
import { useGlobalPayrollStore } from "@/store/useGlobalPayrollStore";
import { BeneficiaryItem } from "@/types/payroll.types";
import { toast } from "sonner";

export function useBeneficiaryManager() {
    const store = useGlobalPayrollStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeId, setActiveId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return store.beneficiaries.filter((b) =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [store.beneficiaries, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    const getActiveItem = () => store.beneficiaries.find((b) => b.id === activeId) || null;

    const openAdd = () => { setActiveId(null); setDrawerMode("add"); };
    const openEdit = (id: string) => { setActiveId(id); setDrawerMode("edit"); };
    const closeDrawer = () => { setDrawerMode("none"); setTimeout(() => setActiveId(null), 300); };

    const handleSave = (payload: Omit<BeneficiaryItem, "id">) => {
        if (drawerMode === "edit" && activeId) {
            store.updateBeneficiary(activeId, payload);
            toast.success("Beneficiary updated");
        } else {
            store.addBeneficiary(payload);
            toast.success("Beneficiary created");
        }
        closeDrawer();
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this Beneficiary? Any attached Badge Values will also be removed.")) {
            store.deleteBeneficiary(id);
            toast.success("Beneficiary deleted");
        }
    };

    return {
        logs: paginated,
        searchQuery, setSearchQuery,
        drawerMode, openAdd, openEdit, closeDrawer, getActiveItem,
        handleSave, handleDelete,
        table: { currentPage, totalPages, perPage, onPageChange: setCurrentPage, onPerPageChange: (v: number) => { setPerPage(v); setCurrentPage(1); } }
    };
}
export type BeneficiaryManagerType = ReturnType<typeof useBeneficiaryManager>;