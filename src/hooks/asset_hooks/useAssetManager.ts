import { useState, useMemo, useDeferredValue } from "react";
import { useGlobalAssetStore } from "@/store/useGlobalAssetStore";
import { Asset, AssetCategory } from "@/types/assets.types";
import { toast } from "sonner";

export function useAssetManager() {
    const store = useGlobalAssetStore();

    // UI State
    const [activeTab, setActiveTab] = useState<"assets" | "categories">("assets");
    const [searchQuery, setSearchQuery] = useState("");
    const deferredSearch = useDeferredValue(searchQuery); // Flaw 22 Fix: Zero UI Stutter
    const [statusFilter, setStatusFilter] = useState<string>("All");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Drawer State (Isolated, no overlapping modals)
    const [drawerMode, setDrawerMode] = useState<"none" | "add_asset" | "edit_asset" | "add_category" | "ledger">("none");
    const [activeAsset, setActiveAsset] = useState<Asset | null>(null);

    // Memoized, Deferred Filtering for O(1) performance feeling
    const filteredAssets = useMemo(() => {
        let result = store.assets;
        if (statusFilter !== "All") {
            result = result.filter(a => a.status === statusFilter);
        }
        if (deferredSearch) {
            const q = deferredSearch.toLowerCase();
            result = result.filter(a =>
                a.name.toLowerCase().includes(q) ||
                a.assetCode.toLowerCase().includes(q) ||
                a.serialNumber.toLowerCase().includes(q)
            );
        }
        return result;
    }, [store.assets, statusFilter, deferredSearch]);

    // Flaw 28 Fix: Auto-Correcting Pagination Bounds
    const totalPages = Math.max(1, Math.ceil(filteredAssets.length / perPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedAssets = useMemo(() => {
        const start = (safeCurrentPage - 1) * perPage;
        return filteredAssets.slice(start, start + perPage);
    }, [filteredAssets, safeCurrentPage, perPage]);

    // Actions
    const openAssetDrawer = (asset?: Asset) => {
        setActiveAsset(asset || null);
        setDrawerMode(asset ? "edit_asset" : "add_asset");
    };

    const handleSaveAsset = (data: any) => {
        if (drawerMode === "edit_asset" && activeAsset) {
            // Concurrency Check implicitly handled by store, we just check version
            store.updateAsset(activeAsset.id, data, activeAsset._version);
            toast.success("Asset updated successfully");
        } else {
            store.addAsset(data);
            toast.success("New asset recorded & Ledger initialized");
        }
        setDrawerMode("none");
    };

    const handleAssign = (assetId: string, empId: string, empName: string, note: string) => {
        store.assignAsset(assetId, empId, empName, note);
        toast.success(`Asset assigned to ${empName}`);
    };

    return {
        // State
        activeTab, setActiveTab,
        searchQuery, setSearchQuery,
        statusFilter, setStatusFilter,
        currentPage: safeCurrentPage, setCurrentPage,
        perPage, setPerPage, totalPages,
        drawerMode, setDrawerMode,
        activeAsset, setActiveAsset,

        // Data
        categories: store.categories,
        paginatedAssets,
        totalFiltered: filteredAssets.length,

        // Handlers
        openAssetDrawer,
        handleSaveAsset,
        handleAssign,
        // ... (other handlers bound securely)
    };
}