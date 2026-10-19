"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/useTableManager";
import { useCommandParams } from "@/hooks/useCommandParams";

export interface TelesaleRecord {
    id: string;
    date: string;
    customer: string;
    customerNumber: string;
    customerType: "New" | "Existing";
    address: string;
    customerDemand: string;
    media: "Messenger" | "WhatsApp" | "Phone Call" | "-";
    note: string;
    result: "Shop Visit" | "Follow Up" | "Waiting";
    salesmanName: string;
}

const initialTelesalesData: TelesaleRecord[] = [
    { id: "1", date: "16 Oct 2026", customer: "Jobayer", customerNumber: "01727866876", customerType: "New", address: "-", customerDemand: "Pixel 7", media: "Messenger", note: "Pujar chuti te ashbe. Pixel 7 (u) niben", result: "Shop Visit", salesmanName: "Jannat Ull Naeem Sarah" },
    { id: "2", date: "15 Oct 2026", customer: "Md rajaul jomadder", customerNumber: "01714862329", customerType: "New", address: "-", customerDemand: "iPhone 17 Pro Max", media: "WhatsApp", note: "Govt. Job koren. Pujar chuti te ashben sure. 256 japan variant niben orange color", result: "Shop Visit", salesmanName: "Jannat Ull Naeem Sarah" },
    { id: "3", date: "15 Oct 2026", customer: "Lima akhter", customerNumber: "01304235119", customerType: "New", address: "-", customerDemand: "CMF Phone 2 Pro", media: "WhatsApp", note: "", result: "Follow Up", salesmanName: "-" },
    { id: "4", date: "15 Oct 2026", customer: "Badhon", customerNumber: "01752431688", customerType: "New", address: "-", customerDemand: "Anker Zolo 20w Adapter", media: "WhatsApp", note: "", result: "Follow Up", salesmanName: "-" },
    { id: "5", date: "15 Oct 2026", customer: "Rakib", customerNumber: "01340969652", customerType: "New", address: "-", customerDemand: "iPhone 17 Pro Max", media: "Phone Call", note: "Will confirm by Friday evening", result: "Shop Visit", salesmanName: "-" },
    { id: "6", date: "15 Oct 2026", customer: "Nayon Ahmed", customerNumber: "0 1727-079298", customerType: "New", address: "-", customerDemand: "Oppo Reno 7A", media: "-", note: "", result: "Waiting", salesmanName: "-" },
    { id: "7", date: "10 Oct 2026", customer: "Mahim Hossain", customerNumber: "01813139356", customerType: "New", address: "-", customerDemand: "iPhone 17 Pro Max", media: "WhatsApp", note: "Interested in exchange offer", result: "Shop Visit", salesmanName: "Jannat Ull Naeem Sarah" },
    { id: "8", date: "09 Oct 2026", customer: "Arif Mondol", customerNumber: "01618073582", customerType: "New", address: "-", customerDemand: "iPhone 17 Pro Max", media: "WhatsApp", note: "Asked for bank EMI details", result: "Shop Visit", salesmanName: "-" },
    { id: "9", date: "09 Oct 2026", customer: "Tirtho", customerNumber: "01717015494", customerType: "New", address: "-", customerDemand: "Redmi Note 14 5G", media: "Messenger", note: "Coming to Jamuna Future Park branch", result: "Shop Visit", salesmanName: "Jannat Ull Naeem Sarah" },
    { id: "10", date: "09 Oct 2026", customer: "Rihan", customerNumber: "01856012476", customerType: "New", address: "-", customerDemand: "IQOO Z10 Turbo Pro", media: "WhatsApp", note: "Checking stock availability", result: "Shop Visit", salesmanName: "Jannat Ull Naeem Sarah" },
];

export function useTelesalesManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();

    // Retained Drawer IDs for smooth drawer exit transitions
    const [retainedViewId, setRetainedViewId] = useState<string | null>(null);
    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "view-telesale" && activeId) setRetainedViewId(activeId);
        if (activeDrawer === "edit-telesale" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: TelesaleRecord, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.customer.toLowerCase().includes(lower) ||
            item.customerNumber.toLowerCase().includes(lower) ||
            item.customerDemand.toLowerCase().includes(lower) ||
            item.salesmanName.toLowerCase().includes(lower) ||
            item.media.toLowerCase().includes(lower) ||
            item.result.toLowerCase().includes(lower)
        );
    }, []);

    const table = useTableManager<TelesaleRecord>(initialTelesalesData, filterFn);

    const activeViewRecord = useMemo(
        () => table.data.find((r) => r.id === retainedViewId) || null,
        [table.data, retainedViewId]
    );

    const activeEditRecord = useMemo(
        () => table.data.find((r) => r.id === retainedEditId) || null,
        [table.data, retainedEditId]
    );

    // Expandable Filter Bar State (matching image_1236de.png)
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [filterDate, setFilterDate] = useState("");
    const [filterResult, setFilterResult] = useState("");
    const [filterSalesman, setFilterSalesman] = useState("");
    const [filterCustomerType, setFilterCustomerType] = useState("");

    // Column Visibility State
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        date: true,
        customer: true,
        customerNumber: true,
        address: true,
        customerDemand: true,
        media: true,
        note: true,
        result: true,
        salesmanName: true,
    });

    const toggleColumn = (key: keyof typeof cols) => {
        setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const showAllColumns = () => {
        const allTrue = Object.keys(cols).reduce((acc, k) => ({ ...acc, [k]: true }), {} as typeof cols);
        setCols(allTrue);
    };

    // Note Eye Popover State (matching image_123a5b.png)
    const [activeNoteRowId, setActiveNoteRowId] = useState<string | null>(null);

    const toggleNotePopover = (id: string) => {
        setActiveNoteRowId((prev) => (prev === id ? null : id));
    };

    const closeNotePopover = () => setActiveNoteRowId(null);

    // Apply Secondary Filter Bar + Pagination
    const advancedFilteredData = useMemo(() => {
        return table.filteredData.filter((item) => {
            if (filterResult && filterResult !== "All Results" && item.result !== filterResult) return false;
            if (filterSalesman && filterSalesman !== "All Salesmen" && item.salesmanName !== filterSalesman) return false;
            if (filterCustomerType && filterCustomerType !== "All Types" && item.customerType !== filterCustomerType) return false;
            if (filterDate && !item.date.toLowerCase().includes(filterDate.toLowerCase())) return false;
            return true;
        });
    }, [table.filteredData, filterResult, filterSalesman, filterCustomerType, filterDate]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return advancedFilteredData.slice(start, start + itemsPerPage);
    }, [advancedFilteredData, currentPage, itemsPerPage]);

    // Drawer Navigation Triggers
    const handleView = (id: string) => openView("drawer", "view-telesale", id);
    const handleEdit = (id: string) => openView("drawer", "edit-telesale", id);
    const handleCreate = () => openView("drawer", "create-telesale", undefined);

    // Inline Table Dropdown Updaters (Replaces "Update Result" modal)
    const handleResultChange = (id: string, newResult: TelesaleRecord["result"]) => {
        table.setData((prev) => prev.map((item) => (item.id === id ? { ...item, result: newResult } : item)));
        toast.success(`Result updated to ${newResult}.`);
    };

    const handleMediaChange = (id: string, newMedia: TelesaleRecord["media"]) => {
        table.setData((prev) => prev.map((item) => (item.id === id ? { ...item, media: newMedia } : item)));
        toast.success(`Media updated to ${newMedia}.`);
    };

    // Delete Handlers
    const handleDelete = (id: string) => {
        table.setData((prev) => prev.filter((item) => item.id !== id));
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Telesale record deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        table.setData((prev) => prev.filter((item) => !table.selectedIds.includes(item.id)));
        table.clearSelection();
        toast.success("Selected telesale records deleted.");
    };

    return {
        activeDrawer,
        closeView,
        retainedViewId,
        retainedEditId,
        activeViewRecord,
        activeEditRecord,
        table: {
            ...table,
            paginatedData,
        },
        cols,
        showColumnsMenu,
        setShowColumnsMenu,
        toggleColumn,
        showAllColumns,
        showFilterBar,
        setShowFilterBar,
        filterDate,
        setFilterDate,
        filterResult,
        setFilterResult,
        filterSalesman,
        setFilterSalesman,
        filterCustomerType,
        setFilterCustomerType,
        activeNoteRowId,
        toggleNotePopover,
        closeNotePopover,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        handleView,
        handleEdit,
        handleCreate,
        handleResultChange,
        handleMediaChange,
        handleDelete,
        handleBulkDelete,
    };
}