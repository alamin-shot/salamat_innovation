/** True for an absolute http(s) URL (rejects javascript:, data:, relative paths, …). */
export function isHttpUrl(value: string): boolean {
    try {
        const url = new URL(value.trim());
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}
