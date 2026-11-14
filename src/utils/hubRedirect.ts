import { redirect } from "next/navigation";

export type PageSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Old standalone page → its hub tab. Keeps the incoming query (e.g. an open drawer `?drawer=…&id=…`)
 * so bookmarks and shared links land on the same record. `extra` wins over incoming params.
 */
export async function redirectToHub(hubPath: string, searchParams: PageSearchParams, extra: Record<string, string>): Promise<never> {
    const incoming = await searchParams;
    const params = new URLSearchParams();
    Object.entries(incoming).forEach(([key, value]) => {
        if (typeof value === "string") params.set(key, value);
        else if (Array.isArray(value) && value[0] !== undefined) params.set(key, value[0]);
    });
    Object.entries(extra).forEach(([key, value]) => params.set(key, value));
    redirect(`${hubPath}?${params.toString()}`);
}
