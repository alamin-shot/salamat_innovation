
import { useRouter, useSearchParams } from "next/navigation";
import { useGlobalIntegrationsStore } from "@/store/useGlobalIntegrationsStore";
import { IntegrationTabKey, IntegrationDrawerMode } from "@/types/integrations";
import { useMemo, useState, useTransition } from "react";

export function useIntegrationManager() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const store = useGlobalIntegrationsStore();

    // Tab routing state
    const activeTab = (searchParams.get("tab") as IntegrationTabKey) || "hub";

    // Table & Control state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    // Drawer state
    const [drawerMode, setDrawerMode] = useState<IntegrationDrawerMode>("none");
    const [activeRecord, setActiveRecord] = useState<any>(null);

    const handleRouteChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        startTransition(() => {
            router.push(`?${params.toString()}`);
            setSelectedIds([]);
            setSearchQuery("");
            setCurrentPage(1);
        });
    };

    // Filtered data pipeline for webhooks or connection logs
    const activeTabData = useMemo(() => {
        if (activeTab === "developer_api") {
            return store.webhooks.filter(w =>
                w.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.subscribedEvents.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        return store.connections.filter(c =>
            c.category === activeTab || activeTab === "hub" ||
            (activeTab === "sales_channels" && c.category === "sales_channels") ||
            (activeTab === "chat_channels" && c.category === "chat_channels") ||
            (activeTab === "logistics_couriers" && c.category === "logistics_couriers") ||
            (activeTab === "accounting_finance" && c.category === "accounting_finance")
        );
    }, [activeTab, searchQuery, store.webhooks, store.connections]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return activeTabData.slice(start, start + perPage);
    }, [activeTabData, currentPage]);

    const toggleSelection = (id: string) => {
        if (id === "ALL") {
            setSelectedIds(selectedIds.length === activeTabData.length ? [] : activeTabData.map((i: any) => i.id));
            return;
        }
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    return {
        activeTab,
        handleRouteChange,
        isPending,
        searchQuery,
        setSearchQuery,
        selectedIds,
        setSelectedIds,
        toggleSelection,
        currentPage,
        setCurrentPage,
        perPage,
        drawerMode,
        setDrawerMode,
        activeRecord,
        setActiveRecord,
        activeTabData,
        paginatedData,
        store
    };
}