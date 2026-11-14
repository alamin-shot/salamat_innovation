import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { useVlogStore } from "@/store/useVlogStore";
import { Vlog } from "@/types/vlogs";

const matches = (vlog: Vlog, query: string): boolean => {
    const q = query.toLowerCase();
    return vlog.title.toLowerCase().includes(q) || vlog.description.toLowerCase().includes(q);
};

/** Vlog spoke: newest publish date first, search, pagination, form / preview drawers and delete. */
export function useVlogsManager() {
    const vlogs = useVlogStore((state) => state.vlogs);
    const deleteVlogs = useVlogStore((state) => state.deleteVlogs);
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();

    const sorted = useMemo(() => [...vlogs].sort((a, b) => b.publishDate.localeCompare(a.publishDate)), [vlogs]);
    const table = useListControls(sorted, matches);

    const isFormOpen = activeDrawer === "vlog-form";
    const isPreviewOpen = activeDrawer === "vlog-preview" && !!activeId;
    const formId = useRetainedValue(isFormOpen ? activeId : null, isFormOpen);
    const previewId = useRetainedValue(isPreviewOpen ? activeId : null, isPreviewOpen);

    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const confirmDelete = useCallback(() => {
        if (pendingDeleteId) {
            deleteVlogs([pendingDeleteId]);
            table.setSelectedIds((prev) => prev.filter((id) => id !== pendingDeleteId));
            toast.success("Vlog deleted.");
        }
        setPendingDeleteId(null);
    }, [deleteVlogs, pendingDeleteId, table]);

    return {
        table,
        isFormOpen,
        isPreviewOpen,
        editing: vlogs.find((vlog) => vlog.id === formId) ?? null,
        previewing: vlogs.find((vlog) => vlog.id === previewId) ?? null,
        openAdd: () => openView("drawer", "vlog-form"),
        openEdit: (id: string) => openView("drawer", "vlog-form", id),
        openPreview: (id: string) => openView("drawer", "vlog-preview", id),
        closeDrawer: closeView,
        pendingDeleteId,
        requestDelete: setPendingDeleteId,
        cancelDelete: () => setPendingDeleteId(null),
        confirmDelete,
    };
}
