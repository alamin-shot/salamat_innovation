import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HubHome, HubTabState } from "@/types/hub";
import { HUB_HOME, HUB_SPOKE_SCOPED_PARAMS } from "@/constants/hub";

/**
 * `?tab=` routing for a hub. Unknown or missing tabs fall back to the portal, so a bad link
 * never renders a blank page. Other params (e.g. SEO `platform`) survive a tab change;
 * spoke-scoped ones (drawer, id, page, search) are cleared.
 */
export function useHubTab<TabKey extends string>(tabs: readonly TabKey[]): HubTabState<TabKey> {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const requested = searchParams.get("tab");
    const activeTab: TabKey | HubHome = tabs.find((tab) => tab === requested) ?? HUB_HOME;

    const openTab = useCallback((tab: TabKey | HubHome) => {
        const params = new URLSearchParams(searchParams.toString());
        HUB_SPOKE_SCOPED_PARAMS.forEach((key) => params.delete(key));
        if (tab === HUB_HOME) {
            params.delete("tab");
        } else {
            params.set("tab", tab);
        }
        const query = params.toString();
        startTransition(() => {
            router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
        });
    }, [pathname, router, searchParams]);

    return { activeTab, isPending, openTab };
}
