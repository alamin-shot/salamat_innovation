// LAYER 1: Media library (future /api/media). Folders can be locked; Super Admin opens everything,
// Manager / Editor need the master PIN to open a locked folder (and everything inside it).

export type MediaFileType = "image" | "pdf" | "video";

export interface MediaFolder {
    id: string;
    name: string;
    /** null = top level */
    parentId: string | null;
    isLocked: boolean;
}

export interface MediaFile {
    id: string;
    name: string;
    url: string;
    type: MediaFileType;
    sizeBytes: number;
    /** Every file lives in a folder (loose files go to "Unfiled"). */
    folderId: string;
    /** YYYY-MM-DD */
    createdAt: string;
}

export type NewMediaFileInput = Omit<MediaFile, "id" | "createdAt">;

export interface MediaState {
    folders: MediaFolder[];
    files: MediaFile[];
    /** Mock master PIN until the NestJS auth service verifies PINs. */
    masterPin: string;
    createFolder: (name: string, parentId: string | null) => { ok: true; folder: MediaFolder } | { ok: false; error: "name_required" | "name_taken" };
    uploadFile: (file: NewMediaFileInput) => void;
    deleteFile: (id: string) => void;
    bulkDeleteFiles: (ids: string[]) => void;
    /** Removes the folder, its subfolders and their files. */
    deleteFolder: (id: string) => void;
    setFolderLock: (id: string, isLocked: boolean) => void;
    verifyPin: (pin: string) => boolean;
}

/** Roles that matter to the media lock (mock session until auth is wired). */
export type SessionRole = "Super Admin" | "Manager" | "Editor";

export interface SessionState {
    role: SessionRole;
    /** Locked folders opened with the PIN during this page session (never saved). */
    unlockedFolderIds: string[];
    setRole: (role: SessionRole) => void;
    grantFolderAccess: (folderId: string) => void;
}

export interface MediaStats {
    totalFiles: number;
    totalBytes: number;
    byType: Record<MediaFileType, { count: number; bytes: number }>;
    folders: number;
    lockedFolders: number;
}

export type MediaTypeFilter = MediaFileType | "";
