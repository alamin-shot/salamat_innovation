"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useCommandParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Read active states directly from the URL
    const activeModal = searchParams.get("modal");
    const activeDrawer = searchParams.get("drawer");
    const activeId = searchParams.get("id");

    /**
     * Opens a specific view (modal or drawer) and optionally sets an ID.
     * Clears the opposite view type to prevent overlapping UI.
     */
    const openView = (type: "modal" | "drawer", viewName: string, id?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set(type, viewName);
        if (id) {
            params.set("id", id);
        } else {
            params.delete("id");
        }

        // Ensure we don't have a modal and a drawer open simultaneously in the URL
        params.delete(type === "modal" ? "drawer" : "modal");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    /**
     * Clears all view parameters from the URL, effectively closing any open modals or drawers.
     */
    const closeView = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("modal");
        params.delete("drawer");
        params.delete("id");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return {
        activeModal,
        activeDrawer,
        activeId,
        openView,
        closeView
    };
}