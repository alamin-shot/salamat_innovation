import { redirect } from "next/navigation";
import { HubBackLink } from "@/types/hub";

export type PageSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type QueryRecord = { [key: string]: string | string[] | undefined };

function toParams(incoming: QueryRecord, extra: Record<string, string>, drop: string[]): URLSearchParams {
    const params = new URLSearchParams();
    Object.entries(incoming).forEach(([key, value]) => {
        if (drop.includes(key)) return;
        if (typeof value === "string") params.set(key, value);
        else if (Array.isArray(value) && value[0] !== undefined) params.set(key, value[0]);
    });
    Object.entries(extra).forEach(([key, value]) => params.set(key, value));
    return params;
}

/**
 * Old standalone page → its full-page spoke route. Keeps the incoming query (e.g. an open drawer
 * `?drawer=…&id=…`) so bookmarks land on the same record. `extra` wins; an old `tab` (and any `drop` keys) is removed.
 */
export async function redirectToHub(path: string, searchParams: PageSearchParams, extra: Record<string, string> = {}, drop: string[] = []): Promise<never> {
    const params = toParams(await searchParams, extra, ["tab", ...drop]);
    const query = params.toString();
    redirect(query ? `${path}?${query}` : path);
}

/**
 * Hub page guard for links from before spokes had their own routes: `/admin/operations?tab=assets`
 * → `/admin/operations/assets` (other params kept). Does nothing when there is no valid `tab`.
 */
export async function redirectLegacyHubTab(hub: HubBackLink, searchParams: PageSearchParams, slugs: Readonly<Record<string, string>>): Promise<void> {
    const incoming = await searchParams;
    const tab = typeof incoming.tab === "string" ? incoming.tab : undefined;
    const slug = tab ? slugs[tab] : undefined;
    if (!slug) return;
    const query = toParams(incoming, {}, ["tab"]).toString();
    redirect(`${hub.href}/${slug}${query ? `?${query}` : ""}`);
}
