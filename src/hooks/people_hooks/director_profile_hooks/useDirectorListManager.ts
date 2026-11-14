import { useRouter } from "next/navigation";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { directorProfilePath } from "@/constants/directors";
import { useDirectorSummaries } from "./useDirectorSummaries";

export function useDirectorListManager() {
    const router = useRouter();
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const directorCards = useDirectorSummaries();

    const isEditOpen = activeDrawer === "edit-director" && !!activeId;
    const editId = useRetainedValue(isEditOpen ? activeId : null, isEditOpen);

    return {
        directorCards,
        isEditOpen,
        closeView,
        activeEditRecord: directorCards.find((card) => card.id === editId) ?? null,
        handleCreateNew: () => router.push("/admin/directors/create-directors"),
        handleViewProfile: (id: string) => router.push(directorProfilePath(id)),
        handleEditProfile: (id: string) => openView("drawer", "edit-director", id),
    };
}
