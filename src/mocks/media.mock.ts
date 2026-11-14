import { MediaFile, MediaFolder } from "@/types/media";

export const UNFILED_FOLDER_ID = "f_unfiled";

export const INITIAL_MEDIA_FOLDERS: MediaFolder[] = [
    { id: "f_voltme", name: "VOLTME", parentId: null, isLocked: false },
    // Brand assets: locked so Manager / Editor need the PIN.
    { id: "f_salamat", name: "Salamat Innovation", parentId: null, isLocked: true },
    { id: "f_tekzo", name: "TEKZO", parentId: null, isLocked: false },
    { id: "f_demo", name: "Demo", parentId: null, isLocked: false },
    { id: "f_sub_demo_1", name: "Motorola Edge 70 Fusion", parentId: "f_demo", isLocked: false },
    { id: UNFILED_FOLDER_ID, name: "Unfiled", parentId: null, isLocked: false },
];

export const INITIAL_MEDIA_FILES: MediaFile[] = [
    { id: "m_1", name: "Professional LinkedIn Headshot (1)", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", type: "image", sizeBytes: 1258291, folderId: UNFILED_FOLDER_ID, createdAt: "2026-10-29" },
    { id: "m_2", name: "Authorization PDF Document", url: "#", type: "pdf", sizeBytes: 460800, folderId: UNFILED_FOLDER_ID, createdAt: "2026-10-29" },
    { id: "m_3", name: "Honor X6e Black", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", type: "image", sizeBytes: 2202010, folderId: UNFILED_FOLDER_ID, createdAt: "2026-10-29" },
    { id: "m_4", name: "Demo Subfile Asset", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", type: "image", sizeBytes: 1887437, folderId: "f_sub_demo_1", createdAt: "2026-10-29" },
];
