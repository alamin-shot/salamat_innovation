import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useDepositStore } from "./useDepositStore";
import { useGlobalDirectorsStore } from "@/store/useGlobalDirectorsStore";

export function useDepositManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { deposits, deleteDeposit, bulkDeleteDeposits } = useDepositStore();
    const directors = useGlobalDirectorsStore((state) => state.directors);

    const isEditOpen = activeDrawer === "edit-deposit" && !!activeId;
    const retainedEditId = useRetainedValue(isEditOpen ? activeId : null, isEditOpen);

    // Director names come from the Directors store; they are joined before search so a director can be searched by name.
    const rows = useMemo(() => deposits.map((d) => {
        const dir = directors.find((director) => director.id === d.directorId);
        return { ...d, directorName: dir?.fullName || "Unknown", directorAvatar: dir ? dir.fullName.split(/\s+/).map((part) => part[0]).join("").substring(0, 2).toUpperCase() : "-" };
    }), [deposits, directors]);

    const filterFn = useCallback((item: (typeof rows)[number], query: string) => {
        const q = query.toLowerCase();
        return [item.title, item.shopName, item.directorName].some((text) => text.toLowerCase().includes(q));
    }, []);

    const table = useListControls(rows, filterFn);

    const activeEditRecord = useMemo(() => deposits.find((d) => d.id === retainedEditId) || null, [deposits, retainedEditId]);

    // Note Popover State
    const [activeNoteRowId, setActiveNoteRowId] = useState<string | null>(null);
    const toggleNotePopover = (id: string) => setActiveNoteRowId((prev) => (prev === id ? null : id));
    const closeNotePopover = () => setActiveNoteRowId(null);

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({ director: true, shopName: true, title: true, date: true, contact: true, attachments: true, note: true, amount: true, createdBy: true });
    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ director: true, shopName: true, title: true, date: true, contact: true, attachments: true, note: true, amount: true, createdBy: true });

    const { currentPage, setCurrentPage, itemsPerPage, setItemsPerPage } = table;

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; }>({
        isOpen: false, title: "", message: "", onConfirm: () => { }
    });
    const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

    const handleEdit = (id: string) => openView("drawer", "edit-deposit", id);

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Deposit",
            message: "Are you sure you want to permanently delete this deposit? This action cannot be undone.",
            onConfirm: () => {
                deleteDeposit(id);
                table.setSelectedIds((p) => p.filter((i) => i !== id));
                toast.success("Deposit deleted.");
                closeConfirm();
            }
        });
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        setConfirmModal({
            isOpen: true,
            title: "Delete Selected Deposits",
            message: `Are you sure you want to permanently delete ${table.selectedIds.length} deposits?`,
            onConfirm: () => {
                bulkDeleteDeposits(table.selectedIds);
                table.clearSelection();
                toast.success("Selected deposits deleted.");
                closeConfirm();
            }
        });
    };

    const handleViewAttachment = (id: string) => {
        toast.info("Viewing attachment...", { id: `attachment-${id}` });
    };

    return {
        activeDrawer, closeView, activeEditRecord, isEditOpen, table,
        cols, showColumnsMenu, setShowColumnsMenu, toggleColumn, showAllColumns,
        activeNoteRowId, toggleNotePopover, closeNotePopover, currentPage, setCurrentPage,
        itemsPerPage, setItemsPerPage, handleEdit, handleDelete, handleBulkDelete, handleViewAttachment,
        confirmModal, closeConfirm
    };
}

export type DepositManagerType = ReturnType<typeof useDepositManager>;