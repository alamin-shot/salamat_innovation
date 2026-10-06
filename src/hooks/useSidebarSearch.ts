import { useState, useMemo } from "react";
import { NAVIGATION_DATA } from "@/constants/navigation";

export function useSidebarSearch() {
    const [search, setSearch] = useState("");

    const filteredNav = useMemo(() => {
        if (!search) return NAVIGATION_DATA;
        const lowerSearch = search.toLowerCase();
        return NAVIGATION_DATA.map((section) => ({
            ...section,
            items: section.items.filter((item) => item.title.toLowerCase().includes(lowerSearch)),
        })).filter((section) => section.items.length > 0);
    }, [search]);

    return { search, setSearch, filteredNav };
}