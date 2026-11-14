import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SeoPlatform } from "@/types/seo";
import { SEO_PLATFORM_PARAM, SEO_PLATFORMS } from "@/constants/seo";

/**
 * The SEO hub's Salamat / TEKZO switch. It lives in the URL (`?platform=`), so every spoke reads
 * the same value, a reload keeps it, and tab changes (which keep other params) carry it along.
 */
export function useSeoPlatform() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const requested = searchParams.get(SEO_PLATFORM_PARAM);
    const platform: SeoPlatform = SEO_PLATFORMS.find((value) => value === requested) ?? "salamat";

    const setPlatform = useCallback((next: SeoPlatform) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(SEO_PLATFORM_PARAM, next);
        // A drawer or page from the other platform must not stay open.
        ["drawer", "modal", "id", "page"].forEach((key) => params.delete(key));
        startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
    }, [pathname, router, searchParams]);

    return { platform, setPlatform, isPending };
}
