import { useState, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGlobalUserStore, UserRecord, RoleRecord } from "@/store/useGlobalUserStore";

export type UserTabKey = "users" | "roles";
export type UserDrawerMode = "none" | "user_form" | "role_form";

export function useUserManager(moduleType: "users" | "roles") {
    const store = useGlobalUserStore();


    // --- UI STATE ---
    const activeTab = moduleType;
    const [drawerMode, setDrawerMode] = useState<UserDrawerMode>("none");
    const [activeRecord, setActiveRecord] = useState<UserRecord | RoleRecord | null>(null);
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

    // --- DATA PIPELINE (Filter -> Paginate) ---
    const processedData = useMemo(() => {
        let data: any[] = activeTab === "users" ? store.users : store.roles;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.name.toLowerCase().includes(query) ||
                (item.email && item.email.toLowerCase().includes(query)) ||
                (item.role && item.role.toLowerCase().includes(query))
            );
        }
        return data;
    }, [activeTab, store.users, store.roles, searchQuery]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return processedData.slice(start, start + perPage);
    }, [processedData, currentPage]);

    return {
        // Core Routing
        activeTab,

        // Data & Search
        searchQuery, setSearchQuery,
        processedData, paginatedData,

        // UI & Selections
        drawerMode, setDrawerMode,
        activeRecord, setActiveRecord,
        selectedIds, setSelectedIds, toggleSelection,

        // Pagination
        currentPage, setCurrentPage, perPage,

        // Store Actions mapped for UI
        store
    };
}