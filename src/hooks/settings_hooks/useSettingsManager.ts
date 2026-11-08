import { useState, useMemo } from "react";
import { useGlobalSettingsStore } from "@/store/useGlobalSettingsStore";

export type SettingsDrawerMode = "none" | "shop_form" | "payment_form" | "shipping_form" | "ecommerce_form";

export function useSettingsManager(activeList: "shops" | "paymentMethods" | "areaShipping" | "ecommerce") {
    const store = useGlobalSettingsStore();

    // --- UI & DRAWER STATE ---
    const [drawerMode, setDrawerMode] = useState<SettingsDrawerMode>("none");
    const [activeRecord, setActiveRecord] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // --- PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const toggleSelection = (id: string | "ALL", currentDataLength: number) => {
        if (id === "ALL") {
            setSelectedIds(selectedIds.length === currentDataLength && currentDataLength > 0 ? [] : processedData.map(t => t.id));
        } else {
            setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        }
    };

    // --- LEAK 6 SEALED: Pagination Garbage Collection ---
    const executeMassDelete = (deleteFn: (ids: string[]) => void) => {
        deleteFn(selectedIds);
        const remainingItemCount = processedData.length - selectedIds.length;
        const newMaxPage = Math.max(1, Math.ceil(remainingItemCount / perPage));
        if (currentPage > newMaxPage) {
            setCurrentPage(newMaxPage); // Auto-corrects to the nearest valid page
        }
        setSelectedIds([]); // Clear selection safely
    };

    // --- DATA PIPELINE ---
    const processedData = useMemo(() => {
        let data = store[activeList] as any[];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item => {
                // Search across flexible fields based on which list is active
                const nameMatch = item.name?.toLowerCase().includes(query);
                const areaMatch = item.area?.toLowerCase().includes(query);
                const phoneMatch = item.phone?.toLowerCase().includes(query);
                return nameMatch || areaMatch || phoneMatch;
            });
        }
        return data;
    }, [activeList, store, searchQuery]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return processedData.slice(start, start + perPage);
    }, [processedData, currentPage]);

    return {
        // Data & Search
        searchQuery, setSearchQuery,
        processedData, paginatedData,

        // UI & Selections
        drawerMode, setDrawerMode,
        activeRecord, setActiveRecord,
        selectedIds, setSelectedIds, toggleSelection,
        executeMassDelete,

        // Pagination
        currentPage, setCurrentPage, perPage,

        // Store Reference
        store
    };
}