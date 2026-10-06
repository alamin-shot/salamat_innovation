import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useSidebarLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Automatically close mobile sidebar when the route changes
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleSidebar = () => setIsMobileOpen((prev) => !prev);
    const closeSidebar = () => setIsMobileOpen(false);

    return { isMobileOpen, toggleSidebar, closeSidebar };
}