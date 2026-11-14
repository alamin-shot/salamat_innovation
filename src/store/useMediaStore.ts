import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MediaFile, MediaFolder, MediaState } from "@/types/media";
import { INITIAL_MEDIA_FILES, INITIAL_MEDIA_FOLDERS, UNFILED_FOLDER_ID } from "@/mocks/media.mock";
import { descendantIds, parseSizeLabel } from "@/utils/mediaRules";

// LAYER 2: Media cache (future /api/media). Which folder is open is URL state, not stored here.

/** Mock master PIN until the NestJS auth service verifies PINs. */
const MOCK_MASTER_PIN = "1234";

export const useMediaStore = create<MediaState>()(
    persist(
        (set, get) => ({
            folders: INITIAL_MEDIA_FOLDERS,
            files: INITIAL_MEDIA_FILES,
            masterPin: MOCK_MASTER_PIN,

            createFolder: (name, parentId) => {
                const trimmed = name.trim();
                if (!trimmed) return { ok: false, error: "name_required" };
                const taken = get().folders.some((folder) => folder.parentId === parentId && folder.name.toLowerCase() === trimmed.toLowerCase());
                if (taken) return { ok: false, error: "name_taken" };
                const folder: MediaFolder = { id: `f_${Date.now()}`, name: trimmed, parentId, isLocked: false };
                set((state) => ({ folders: [...state.folders, folder] }));
                return { ok: true, folder };
            },

            uploadFile: (fileData) => set((state) => ({
                files: [...state.files, { ...fileData, id: `m_${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] }],
            })),

            deleteFile: (id) => set((state) => ({ files: state.files.filter((file) => file.id !== id) })),

            bulkDeleteFiles: (ids) => set((state) => ({ files: state.files.filter((file) => !ids.includes(file.id)) })),

            deleteFolder: (id) => set((state) => {
                const removed = descendantIds(state.folders, id);
                return {
                    folders: state.folders.filter((folder) => !removed.includes(folder.id)),
                    files: state.files.filter((file) => !removed.includes(file.folderId)),
                };
            }),

            setFolderLock: (id, isLocked) => set((state) => ({
                folders: state.folders.map((folder) => (folder.id === id ? { ...folder, isLocked } : folder)),
            })),

            verifyPin: (pin) => pin === get().masterPin,
        }),
        {
            name: "erp-media-storage-v1",
            version: 1,
            // Saved state never includes the PIN (it comes from code), nor the open folder.
            partialize: (state) => ({ folders: state.folders, files: state.files }),
            // version 1: folder locks, an "Unfiled" folder for loose files, numeric file sizes.
            migrate: (persisted) => {
                type OldFile = Omit<MediaFile, "sizeBytes" | "folderId"> & { size?: string; sizeBytes?: number; folderId: string | null };
                const state = persisted as { folders?: (Omit<MediaFolder, "isLocked"> & { isLocked?: boolean })[]; files?: OldFile[] };
                const folders: MediaFolder[] = (state.folders ?? INITIAL_MEDIA_FOLDERS).map((folder) => ({ ...folder, isLocked: folder.isLocked ?? false }));
                if (!folders.some((folder) => folder.id === UNFILED_FOLDER_ID)) folders.push({ id: UNFILED_FOLDER_ID, name: "Unfiled", parentId: null, isLocked: false });
                const source: OldFile[] = state.files ?? INITIAL_MEDIA_FILES;
                const files: MediaFile[] = source.map((file) => ({
                    id: file.id,
                    name: file.name,
                    url: file.url,
                    type: file.type,
                    sizeBytes: file.sizeBytes ?? parseSizeLabel(file.size ?? ""),
                    folderId: file.folderId ?? UNFILED_FOLDER_ID,
                    createdAt: file.createdAt,
                }));
                return { folders, files } as MediaState;
            },
        }
    )
);
