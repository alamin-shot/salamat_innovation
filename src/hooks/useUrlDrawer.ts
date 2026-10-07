import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useUrlDrawer(drawerId: string) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("drawer") === drawerId;

    const openDrawer = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("drawer", drawerId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [drawerId, pathname, router, searchParams]);

    const closeDrawer = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("drawer");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    return { isOpen, openDrawer, closeDrawer };
}