// LAYER 1: Reels videos (future /api/reels).

export type ReelStatus = "Active" | "Inactive";

export interface ReelRecord {
    id: string;
    productName: string;
    /** YouTube / Facebook / direct video (.mp4, .webm) link, or null when none is set. */
    videoLink: string | null;
    status: ReelStatus;
}

export type ReelInput = Omit<ReelRecord, "id">;

export interface ReelsState {
    reels: ReelRecord[];
    addReel: (reel: ReelInput) => void;
    updateReel: (id: string, updatedData: Partial<ReelInput>) => void;
    deleteReel: (id: string) => void;
    deleteMultipleReels: (ids: string[]) => void;
}

/** How a video link is played in the preview. */
export type VideoLinkInfo =
    | { kind: "youtube"; embedUrl: string }
    | { kind: "facebook"; embedUrl: string }
    | { kind: "file"; src: string }
    | { kind: "invalid" };
