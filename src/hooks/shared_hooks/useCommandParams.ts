"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useCommandParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();


    const activeModal = searchParams.get("modal");
    const activeDrawer = searchParams.get("drawer");
    const activeId = searchParams.get("id");

    const activeTab = searchParams.get("tab");

    const setTab = (tabName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabName);
        params.delete("modal");
        params.delete("drawer");
        params.delete("id");
        params.delete("page"); // Reset pagination when switching tabs
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const openView = (type: "modal" | "drawer", viewName: string, id?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set(type, viewName);
        if (id) {
            params.set("id", id);
        } else {
            params.delete("id");
        }


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
        activeTab,
        openView,
        setTab,
        closeView
    };
}