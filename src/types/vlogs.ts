// LAYER 1: Vlog (future NestJS resource: /api/vlogs). Independent of Reels and News.
import type { RecordStatus } from "@/types/products";

export interface Vlog {
    id: string;
    title: string;
    /** Public video link (YouTube, Facebook, Vimeo or a direct file URL), http(s) only. */
    videoUrl: string;
    /** Cover image URL; null shows a placeholder. */
    thumbnail: string | null;
    description: string;
    status: RecordStatus;
    /** YYYY-MM-DD */
    publishDate: string;
    /** ISO 8601 */
    createdAt: string;
    createdBy: string;
}

export type VlogInput = Pick<Vlog, "title" | "videoUrl" | "thumbnail" | "description" | "status" | "publishDate">;

export type VlogError = "title_required" | "video_url_invalid" | "publish_date_required" | "not_found";

export type VlogResult = { ok: true; id: string } | { ok: false; error: VlogError };

export interface VlogState {
    vlogs: Vlog[];
    addVlog: (input: VlogInput) => VlogResult;
    updateVlog: (id: string, input: VlogInput) => VlogResult;
    deleteVlogs: (ids: string[]) => void;
}
