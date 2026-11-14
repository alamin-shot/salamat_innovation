import { useCallback } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { useOurTeamStore } from "@/store/useOurTeamStore";
import { TeamMember } from "@/types/ourTeam";

const matches = (member: TeamMember, query: string) => {
    const q = query.toLowerCase();
    return [member.name, member.designation, member.description, member.status].some((text) => text.toLowerCase().includes(q));
};

/** Our Team list: search, selection and the add / edit / view drawers. */
export function useOurTeamManager() {
    const members = useOurTeamStore((state) => state.members);
    const deleteMembers = useOurTeamStore((state) => state.deleteMembers);
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const table = useListControls(members, matches);

    const isFormOpen = activeDrawer === "add-member" || (activeDrawer === "edit-member" && !!activeId);
    const isViewOpen = activeDrawer === "view-member" && !!activeId;
    const formId = useRetainedValue(activeDrawer === "edit-member" ? activeId : null, isFormOpen);
    const viewId = useRetainedValue(isViewOpen ? activeId : null, isViewOpen);

    const { setSelectedIds } = table;
    const handleDelete = useCallback((id: string) => {
        deleteMembers([id]);
        setSelectedIds((prev) => prev.filter((selected) => selected !== id));
        toast.success("Team member deleted.");
    }, [deleteMembers, setSelectedIds]);

    const handleBulkDelete = () => {
        const count = table.selectedIds.length;
        deleteMembers(table.selectedIds);
        table.clearSelection();
        toast.success(`${count} team member(s) deleted.`);
    };

    return {
        table,
        isFormOpen,
        isViewOpen,
        editing: members.find((member) => member.id === formId) ?? null,
        viewed: members.find((member) => member.id === viewId) ?? null,
        openAdd: () => openView("drawer", "add-member"),
        openEdit: useCallback((id: string) => openView("drawer", "edit-member", id), [openView]),
        openDetails: useCallback((id: string) => openView("drawer", "view-member", id), [openView]),
        closeView,
        handleDelete,
        handleBulkDelete,
    };
}

export type OurTeamManager = ReturnType<typeof useOurTeamManager>;
