import { create } from "zustand";
import { SessionState } from "@/types/media";

// LAYER 2 (mock): the signed-in user's role and PIN-unlocked folders. Not saved — a reload signs back
// in as Super Admin and forgets unlocked folders. The NestJS auth session replaces this.

export const useSessionStore = create<SessionState>()((set) => ({
    role: "Super Admin",
    unlockedFolderIds: [],
    // Switching role starts a fresh session (no folders unlocked).
    setRole: (role) => set({ role, unlockedFolderIds: [] }),
    grantFolderAccess: (folderId) => set((state) => ({
        unlockedFolderIds: state.unlockedFolderIds.includes(folderId) ? state.unlockedFolderIds : [...state.unlockedFolderIds, folderId],
    })),
}));
