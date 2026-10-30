import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MediaFolder {
    id: string;
    name: string;
    parentId: string | null; // null means root
}

export interface MediaFile {
    id: string;
    name: string;
    url: string;
    type: "image" | "pdf" | "video";
    size: string;
    folderId: string | null; // null means root
    createdAt: string;
}

interface MediaStore {
    folders: MediaFolder[];
    files: MediaFile[];
    currentFolderId: string | null; // null = root view

    // Actions
    navigateToFolder: (folderId: string | null) => void;
    createFolder: (name: string) => void;
    uploadFile: (file: { name: string; url: string; type: "image" | "pdf" | "video"; size: string; folderId?: string | null }) => void;
    deleteFile: (id: string) => void;
    deleteFolder: (id: string) => void;
    bulkDeleteFiles: (ids: string[]) => void;
}

export const useMediaStore = create<MediaStore>()(
    persist(
        (set) => ({
            folders: [
                { id: "f_voltme", name: "VOLTME", parentId: null },
                { id: "f_salamat", name: "Salamat Innovation", parentId: null },
                { id: "f_tekzo", name: "TEKZO", parentId: null },
                { id: "f_demo", name: "Demo", parentId: null },
                { id: "f_sub_demo_1", name: "Motorola Edge 70 Fusion", parentId: "f_demo" },
            ],
            files: [
                { id: "m_1", name: "Professional LinkedIn Headshot (1)", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", type: "image", size: "1.2 MB", folderId: null, createdAt: "2026-10-29" },
                { id: "m_2", name: "Authorization PDF Document", url: "#", type: "pdf", size: "450 KB", folderId: null, createdAt: "2026-10-29" },
                { id: "m_3", name: "Honor X6e Black", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", type: "image", size: "2.1 MB", folderId: null, createdAt: "2026-10-29" },
                { id: "m_4", name: "Demo Subfile Asset", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", type: "image", size: "1.8 MB", folderId: "f_sub_demo_1", createdAt: "2026-10-29" },
            ],
            currentFolderId: null,

            navigateToFolder: (folderId) => set({ currentFolderId: folderId }),

            createFolder: (name) => set((state) => ({
                folders: [...state.folders, { id: `f_${Date.now()}`, name, parentId: state.currentFolderId }]
            })),

            uploadFile: (fileData) => set((state) => ({
                files: [...state.files, { ...fileData, id: `m_${Date.now()}`, folderId: state.currentFolderId, createdAt: new Date().toISOString().split('T')[0] }]
            })),

            deleteFile: (id) => set((state) => ({
                files: state.files.filter(f => f.id !== id)
            })),

            deleteFolder: (id) => set((state) => ({
                folders: state.folders.filter(f => f.id !== id && f.parentId !== id),
                files: state.files.filter(f => f.folderId !== id)
            })),

            bulkDeleteFiles: (ids) => set((state) => ({
                files: state.files.filter(f => !ids.includes(f.id))
            }))
        }),
        { name: "erp-media-storage-v1" }
    )
);