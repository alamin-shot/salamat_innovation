import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";

/**
 * URL-driven View / Create drawers for one Operations spoke (`?drawer=…&id=…`).
 * The hub keeps `?tab=`, so a drawer link always reopens on the right spoke.
 * The viewed id is retained while the drawer slides out.
 */
export function useSpokeDrawers(viewName: string, createName: string) {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();

    const isViewOpen = activeDrawer === viewName && !!activeId;
    const viewId = useRetainedValue(isViewOpen ? activeId : null, isViewOpen);

    return {
        isViewOpen,
        viewId,
        isCreateOpen: activeDrawer === createName,
        openViewDrawer: (id: string) => openView("drawer", viewName, id),
        openCreateDrawer: () => openView("drawer", createName),
        closeDrawer: closeView,
    };
}
