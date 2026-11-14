import { VideoLinkInfo } from "@/types/reels";

/** Recognises a YouTube, Facebook or direct video file link and how to play it. */
export function parseVideoLink(raw: string | null | undefined): VideoLinkInfo {
    const text = raw?.trim();
    if (!text) return { kind: "invalid" };
    let url: URL;
    try {
        url = new URL(text);
    } catch {
        return { kind: "invalid" };
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return { kind: "invalid" };
    const host = url.hostname.replace(/^www\.|^m\./, "");

    if (host === "youtu.be") {
        const id = url.pathname.slice(1).split("/")[0];
        return id ? { kind: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` } : { kind: "invalid" };
    }
    if (host === "youtube.com") {
        const id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/)?.[1];
        return id ? { kind: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` } : { kind: "invalid" };
    }
    if (host === "facebook.com" || host === "fb.watch") {
        return { kind: "facebook", embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(text)}&show_text=false` };
    }
    if (/\.(mp4|webm|ogg|mov)$/i.test(url.pathname)) return { kind: "file", src: text };
    return { kind: "invalid" };
}

export const VIDEO_LINK_LABEL: Record<VideoLinkInfo["kind"], string> = {
    youtube: "YouTube video",
    facebook: "Facebook video",
    file: "Video file",
    invalid: "Not a playable link",
};
