"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/useTableManager";
import { useCommandParams } from "@/hooks/useCommandParams";

export interface PersonRecord {
    id: string;
    initials: string;
    name: string;
    type: "Online Customer" | "Offline Customer" | "Supplier";
    status: "Active" | "Inactive";
    businessName: string;
    phoneNumber: string;
    secondaryPhone?: string;
    email: string;
    address: string;
    district: string;
    area: string;
    rating: string;
    note: string;
    priceDocument: string;
    createdAt: string;
    dateOfBirth: string;
    gender: string;
}

const initialPeopleData: PersonRecord[] = [
    { id: "1", initials: "Y", name: "Yasin", type: "Online Customer", status: "Active", businessName: "—", phoneNumber: "+8801608797891", email: "yasin8999@gmail.com", address: "-", district: "-", area: "-", rating: "Unrated", note: "", priceDocument: "", createdAt: "1 hour ago", dateOfBirth: "-", gender: "-" },
    { id: "2", initials: "RM", name: "Roghupoti Mohanto", type: "Offline Customer", status: "Active", businessName: "—", phoneNumber: "01608197533", email: "mohantotirtho@gmail.com", address: "-", district: "-", area: "-", rating: "5 ★", note: "Regular store buyer", priceDocument: "", createdAt: "7 hours ago", dateOfBirth: "-", gender: "-" },
    { id: "3", initials: "MR", name: "Mohammad Fahad Rahman", type: "Offline Customer", status: "Active", businessName: "—", phoneNumber: "01312852463", email: "mohammadfahadrahman@gmail.com", address: "-", district: "-", area: "-", rating: "4 ★", note: "", priceDocument: "", createdAt: "10 hours ago", dateOfBirth: "-", gender: "-" },
    { id: "4", initials: "MA", name: "Md Alamin", type: "Online Customer", status: "Active", businessName: "—", phoneNumber: "+8801518461669", email: "alamin.coder284@gmail.com", address: "-", district: "-", area: "-", rating: "5 ★", note: "", priceDocument: "", createdAt: "10 hours ago", dateOfBirth: "-", gender: "-" },
    { id: "5", initials: "RD", name: "Roman Dey", type: "Online Customer", status: "Active", businessName: "—", phoneNumber: "+8801865603792", email: "romandey87@gmail.com", address: "-", district: "-", area: "-", rating: "Unrated", note: "", priceDocument: "", createdAt: "11 hours ago", dateOfBirth: "-", gender: "-" },
    { id: "6", initials: "AM", name: "Al Mukit", type: "Offline Customer", status: "Active", businessName: "—", phoneNumber: "01815893266", email: "-", address: "-", district: "-", area: "-", rating: "Unrated", note: "", priceDocument: "", createdAt: "20 hours ago", dateOfBirth: "-", gender: "-" },
    { id: "7", initials: "S", name: "Sayem", type: "Offline Customer", status: "Active", businessName: "—", phoneNumber: "01776643395", email: "-", address: "-", district: "-", area: "-", rating: "3 ★", note: "", priceDocument: "", createdAt: "22 hours ago", dateOfBirth: "-", gender: "-" },
    { id: "8", initials: "SM", name: "Salim Miazi", type: "Supplier", status: "Active", businessName: "MR Telecom", phoneNumber: "01966792299", email: "-", address: "JFP Block A, Level 4", district: "Dhaka", area: "Bashundhara", rating: "5 ★", note: "Primary wholesale vendor", priceDocument: "mr-telecom-q4.pdf", createdAt: "22 hours ago", dateOfBirth: "-", gender: "-" },
    { id: "9", initials: "NI", name: "Nahid islam", type: "Online Customer", status: "Active", businessName: "—", phoneNumber: "+8801758351324", email: "ni845347@gmail.com", address: "-", district: "-", area: "-", rating: "Unrated", note: "", priceDocument: "", createdAt: "23 hours ago", dateOfBirth: "-", gender: "-" },
    { id: "10", initials: "SW", name: "Sha Won", type: "Online Customer", status: "Active", businessName: "—", phoneNumber: "+8801857416574", email: "shawonofficee77@gmail.com", address: "-", district: "-", area: "-", rating: "Unrated", note: "", priceDocument: "", createdAt: "23 hours ago", dateOfBirth: "-", gender: "-" },
];

export function usePeopleManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();

    // Retained Drawer IDs & Active View Tab
    const [retainedViewId, setRetainedViewId] = useState<string | null>(null);
    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState("overview");

    useEffect(() => {
        if (activeDrawer === "view-people" && activeId) setRetainedViewId(activeId);
        if (activeDrawer === "edit-people" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: PersonRecord, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.name.toLowerCase().includes(lower) ||
            item.phoneNumber.toLowerCase().includes(lower) ||
            item.email.toLowerCase().includes(lower) ||
            item.businessName.toLowerCase().includes(lower) ||
            item.type.toLowerCase().includes(lower)
        );
    }, []);

    const table = useTableManager<PersonRecord>(initialPeopleData, filterFn);

    const activePerson = useMemo(
        () => table.data.find((p) => p.id === retainedViewId) || null,
        [table.data, retainedViewId]
    );

    // Inline Popover States for Table Cells (Zero useState in UI files)
    const [activeNoteRowId, setActiveNoteRowId] = useState<string | null>(null);
    const [noteDraft, setNoteDraft] = useState("");
    const [activeAddressRowId, setActiveAddressRowId] = useState<string | null>(null);

    const openNotePopover = (id: string, currentNote: string) => {
        if (activeNoteRowId === id) {
            setActiveNoteRowId(null);
        } else {
            setNoteDraft(currentNote);
            setActiveNoteRowId(id);
        }
    };

    const closeNotePopover = () => setActiveNoteRowId(null);

    const toggleAddressPopover = (id: string) => {
        setActiveAddressRowId((prev) => (prev === id ? null : id));
    };

    const closeAddressPopover = () => setActiveAddressRowId(null);

    // Filter by Type State
    const [typeFilter, setTypeFilter] = useState<string>("All");
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Column Visibility State
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        name: true,
        type: true,
        status: true,
        businessName: true,
        phoneNumber: true,
        email: true,
        address: true,
        district: true,
        area: true,
        rating: true,
        note: true,
        priceDocument: true,
        history: true,
        createdAt: true,
        dateOfBirth: true,
        gender: true,
    });

    const toggleColumn = (key: keyof typeof cols) => {
        setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const showAllColumns = () => {
        const allTrue = Object.keys(cols).reduce((acc, k) => ({ ...acc, [k]: true }), {} as typeof cols);
        setCols(allTrue);
    };

    // Apply Type Filter + Pagination
    const typeFilteredData = useMemo(() => {
        if (typeFilter === "All") return table.filteredData;
        return table.filteredData.filter((item) => item.type === typeFilter);
    }, [table.filteredData, typeFilter]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return typeFilteredData.slice(start, start + itemsPerPage);
    }, [typeFilteredData, currentPage, itemsPerPage]);

    // Drawer Navigation Triggers
    const handleView = (id: string) => {
        setActiveDetailTab("overview");
        openView("drawer", "view-people", id);
    };

    const handleViewHistory = (id: string) => {
        setActiveDetailTab("orders");
        openView("drawer", "view-people", id);
    };

    const handleEdit = (id: string) => openView("drawer", "edit-people", id);
    const handleCreate = () => openView("drawer", "create-people", undefined);

    // Inline Cell Updaters
    const handleTypeChange = (id: string, newType: PersonRecord["type"]) => {
        table.setData((prev) => prev.map((item) => (item.id === id ? { ...item, type: newType } : item)));
        toast.success(`Type updated to ${newType}.`);
    };

    const handleStatusChange = (id: string, newStatus: PersonRecord["status"]) => {
        table.setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
        toast.success(`Status updated to ${newStatus}.`);
    };

    const handleRatingChange = (id: string, newRating: string) => {
        table.setData((prev) => prev.map((item) => (item.id === id ? { ...item, rating: newRating } : item)));
        toast.success(`Customer rating updated to ${newRating}.`);
    };

    const handleNoteSave = (id: string) => {
        table.setData((prev) => prev.map((item) => (item.id === id ? { ...item, note: noteDraft } : item)));
        setActiveNoteRowId(null);
        toast.success("Note saved successfully.");
    };

    const handlePriceDocChange = (id: string, fileName: string) => {
        table.setData((prev) => prev.map((item) => (item.id === id ? { ...item, priceDocument: fileName } : item)));
        toast.success(`Price document "${fileName}" uploaded.`);
    };

    // Delete Handlers
    const handleDelete = (id: string) => {
        table.setData((prev) => prev.filter((item) => item.id !== id));
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Person record deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        table.setData((prev) => prev.filter((item) => !table.selectedIds.includes(item.id)));
        table.clearSelection();
        toast.success("Selected people records deleted.");
    };

    return {
        activeDrawer,
        closeView,
        retainedViewId,
        retainedEditId,
        activePerson,
        activeDetailTab,
        setActiveDetailTab,
        table: {
            ...table,
            paginatedData,
        },
        cols,
        showColumnsMenu,
        setShowColumnsMenu,
        toggleColumn,
        showAllColumns,
        typeFilter,
        setTypeFilter,
        showFilterMenu,
        setShowFilterMenu,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        activeNoteRowId,
        noteDraft,
        setNoteDraft,
        openNotePopover,
        closeNotePopover,
        activeAddressRowId,
        toggleAddressPopover,
        closeAddressPopover,
        handleView,
        handleViewHistory,
        handleEdit,
        handleCreate,
        handleTypeChange,
        handleStatusChange,
        handleRatingChange,
        handleNoteSave,
        handlePriceDocChange,
        handleDelete,
        handleBulkDelete,
    };
}