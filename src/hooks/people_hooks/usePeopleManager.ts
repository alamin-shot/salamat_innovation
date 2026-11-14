"use client";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { usePeopleStore } from "@/store/usePeopleStore";
import { PersonRecord } from "@/types/people";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";

// Types live in types/people.ts and records in usePeopleStore; re-exported for existing imports.
export type { PersonRecord };

export function usePeopleManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();

    // Drawer ids are kept while a drawer slides out (no effect needed).
    const isViewOpen = activeDrawer === "view-people" && !!activeId;
    const isEditOpen = activeDrawer === "edit-people" && !!activeId;
    const retainedViewId = useRetainedValue(isViewOpen ? activeId : null, isViewOpen);
    const retainedEditId = useRetainedValue(isEditOpen ? activeId : null, isEditOpen);
    const [activeDetailTab, setActiveDetailTab] = useState("overview");

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

    const people = usePeopleStore((state) => state.people);
    const updatePerson = usePeopleStore((state) => state.updatePerson);
    const deletePeople = usePeopleStore((state) => state.deletePeople);
    const table = useListControls<PersonRecord>(people, filterFn);

    const activePerson = useMemo(
        () => people.find((p) => p.id === retainedViewId) || null,
        [people, retainedViewId]
    );
    const activeEditPerson = useMemo(
        () => people.find((p) => p.id === retainedEditId) || null,
        [people, retainedEditId]
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
        lifecycle: true,
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
    const totalPages = Math.max(1, Math.ceil(typeFilteredData.length / itemsPerPage));

    // Drawer Navigation Triggers
    const handleView = (id: string) => {
        setActiveDetailTab("overview");
        openView("drawer", "view-people", id);
    };

    /** Table "Lifecycle" button: opens the detail drawer straight on the Lifecycle tab. */
    const handleViewLifecycle = (id: string) => {
        setActiveDetailTab("lifecycle");
        openView("drawer", "view-people", id);
    };

    const handleEdit = (id: string) => openView("drawer", "edit-people", id);
    /** "Add Customer" / "Add Supplier": the button decides the type, the form never asks. */
    const handleCreate = (kind: "customer" | "supplier") => openView("drawer", kind === "customer" ? "create-customer" : "create-supplier", undefined);

    // Inline Cell Updaters
    // Type is locked after creation (set by the creating context), so there is no type-change handler.

    const handleStatusChange = (id: string, newStatus: PersonRecord["status"]) => {
        updatePerson(id, { status: newStatus });
        toast.success(`Status updated to ${newStatus}.`);
    };

    const handleRatingChange = (id: string, newRating: string) => {
        updatePerson(id, { rating: newRating });
        toast.success(`Customer rating updated to ${newRating}.`);
    };

    const handleNoteSave = (id: string) => {
        updatePerson(id, { note: noteDraft });
        setActiveNoteRowId(null);
        toast.success("Note saved successfully.");
    };

    const handlePriceDocChange = (id: string, fileName: string) => {
        updatePerson(id, { priceDocument: fileName });
        toast.success(`Price document "${fileName}" uploaded.`);
    };

    // Delete Handlers
    const handleDelete = (id: string) => {
        deletePeople([id]);
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Person record deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        deletePeople(table.selectedIds);
        table.clearSelection();
        toast.success("Selected people records deleted.");
    };

    return {
        activeDrawer,
        closeView,
        retainedViewId,
        retainedEditId,
        activePerson,
        activeEditPerson,
        isViewOpen,
        isEditOpen,
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
        totalPages,
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
        handleViewLifecycle,
        handleEdit,
        handleCreate,
        handleStatusChange,
        handleRatingChange,
        handleNoteSave,
        handlePriceDocChange,
        handleDelete,
        handleBulkDelete,
    };
}
export type PeopleManager = ReturnType<typeof usePeopleManager>;
