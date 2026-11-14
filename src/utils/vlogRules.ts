import { VlogError, VlogInput } from "@/types/vlogs";
import { isHttpUrl } from "@/utils/urlRules";

export { isHttpUrl };

/** First problem with a vlog form, or null. */
export function vlogInputError(input: VlogInput): VlogError | null {
    if (!input.title.trim()) return "title_required";
    if (!isHttpUrl(input.videoUrl)) return "video_url_invalid";
    if (!input.publishDate) return "publish_date_required";
    return null;
}

/**
 * Embeddable player URL for previews, or null when the link is not a known video host
 * (the preview then shows a plain link instead).
 */
export function toVlogEmbedUrl(videoUrl: string): string | null {
    if (!isHttpUrl(videoUrl)) return null;
    const url = new URL(videoUrl.trim());
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
        const id = url.pathname.slice(1);
        return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
        const id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1];
        return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
        const id = url.pathname.match(/^\/(\d+)/)?.[1];
        return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
}
