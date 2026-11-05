import { useState, useMemo, useDeferredValue } from "react";
import { useGlobalCommsStore } from "@/store/useGlobalCommsStore";

export function useCommsManager() {
    const store = useGlobalCommsStore();
    const [typeFilter, setTypeFilter] = useState("All");
    const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
    // NEW: Sub-Module Routing State
    const [activeModule, setActiveModule] = useState<"holidays" | "events" | "announcements">("holidays");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // UI State
    const [searchQuery, setSearchQuery] = useState("");
    const deferredSearch = useDeferredValue(searchQuery);

    // Pagination & Drawers (retained from previous phase)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [drawerMode, setDrawerMode] = useState<"none" | "holiday" | "event" | "announcement">("none");
    const [activeRecord, setActiveRecord] = useState<any | null>(null);
    const totalPages = useMemo(() => {
        let activeLength = 0;
        if (activeModule === "holidays") activeLength = store.holidays.length;
        if (activeModule === "events") activeLength = store.events.length;
        if (activeModule === "announcements") activeLength = store.announcements.length;

        return Math.max(1, Math.ceil(activeLength / perPage));
    }, [activeModule, store.holidays, store.events, store.announcements, perPage]);

    const paginatedFeed: any[] = [];
    return {
        activeTab, setActiveTab,
        typeFilter, setTypeFilter,
        paginatedFeed,
        activeModule, setActiveModule,
        searchQuery, setSearchQuery,
        deferredSearch,
        currentPage, setCurrentPage,
        perPage, setPerPage,
        drawerMode, setDrawerMode,
        activeRecord, setActiveRecord,
        totalPages,
        selectedDate, setSelectedDate,
        holidays: store.holidays,
        events: store.events,
        announcements: store.announcements
    };
}