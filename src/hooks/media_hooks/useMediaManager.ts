import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useMediaStore } from "@/store/useMediaStore";
import { useSessionStore } from "@/store/useSessionStore";
import { MediaFile, MediaFolder, MediaTypeFilter, NewMediaFileInput } from "@/types/media";
import { SESSION_ROLES } from "@/constants/media";
import { UNFILED_FOLDER_ID } from "@/mocks/media.mock";
import { blockingFolder, canOpenFolder, folderChain, isFolderLocked, mediaStats } from "@/utils/mediaRules";

/**
 * Media library: folder-first landing view, folder browsing, search / type filter across the folders the
 * current role may open, and the PIN flow for locked folders. The open folder lives in the URL (?folder=).
 */
export function useMediaManager() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const folders = useMediaStore((state) => state.folders);
    const files = useMediaStore((state) => state.files);
    const store = useMediaStore.getState;
    const role = useSessionStore((state) => state.role);
    const unlockedIds = useSessionStore((state) => state.unlockedFolderIds);
    const setRole = useSessionStore((state) => state.setRole);
    const grantFolderAccess = useSessionStore((state) => state.grantFolderAccess);

    const folderParam = searchParams.get("folder");
    const currentFolder = folders.find((folder) => folder.id === folderParam) ?? null;
    const currentFolderId = currentFolder?.id ?? null;

    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("");
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    /** Folder the user tried to open and must unlock with the PIN. */
    const [pinFolderId, setPinFolderId] = useState<string | null>(null);

    const canOpen = useCallback((folderId: string | null) => canOpenFolder(folders, folderId, role, unlockedIds), [folders, role, unlockedIds]);
    const isLocked = useCallback((folderId: string) => isFolderLocked(folders, folderId), [folders]);

    const isFiltering = searchQuery.trim() !== "" || typeFilter !== "";
    const isCurrentAccessible = canOpen(currentFolderId);
    const view: "landing" | "folder" | "results" = isFiltering ? "results" : currentFolder ? "folder" : "landing";

    const visibleFolders = useMemo(() => folders.filter((folder) => folder.parentId === currentFolderId), [folders, currentFolderId]);

    /** Files shown: the open folder's (if allowed), or search / filter hits in every folder this role may open. */
    const visibleFiles = useMemo<MediaFile[]>(() => {
        if (view === "landing") return [];
        if (view === "folder") return isCurrentAccessible ? files.filter((file) => file.folderId === currentFolderId) : [];
        const q = searchQuery.trim().toLowerCase();
        return files.filter((file) => canOpen(file.folderId)
            && (!typeFilter || file.type === typeFilter)
            && (!q || file.name.toLowerCase().includes(q)));
    }, [view, files, currentFolderId, isCurrentAccessible, searchQuery, typeFilter, canOpen]);

    const stats = useMemo(() => mediaStats(folders, files), [folders, files]);
    const breadcrumbs = useMemo(() => [{ id: null as string | null, name: "All Media" }, ...folderChain(folders, currentFolderId).reverse().map((folder) => ({ id: folder.id as string | null, name: folder.name }))], [folders, currentFolderId]);
    const folderPath = useCallback((folderId: string) => folderChain(folders, folderId).reverse().map((folder) => folder.name).join(" / "), [folders]);

    const navigateToFolder = useCallback((folderId: string | null) => {
        setSelectedFileIds([]);
        setSearchQuery("");
        setTypeFilter("");
        router.push(folderId ? `${pathname}?folder=${folderId}` : pathname);
    }, [router, pathname, setSelectedFileIds, setSearchQuery, setTypeFilter]);

    /** Opens a folder, or asks for the PIN when a lock is in the way. */
    const openFolder = useCallback((folderId: string) => {
        const blocker = blockingFolder(folders, folderId, role, unlockedIds);
        if (blocker) {
            setPinFolderId(folderId);
            return;
        }
        navigateToFolder(folderId);
    }, [folders, role, unlockedIds, navigateToFolder, setPinFolderId]);

    const pinTarget: MediaFolder | null = pinFolderId ? blockingFolder(folders, pinFolderId, role, unlockedIds) : null;

    /** Checks the PIN; on success unlocks the blocking folder and continues into the requested one. */
    const submitPin = (pin: string): boolean => {
        if (!pinFolderId || !pinTarget) return false;
        if (!store().verifyPin(pin)) return false;
        grantFolderAccess(pinTarget.id);
        const requested = pinFolderId;
        const stillBlocked = blockingFolder(folders, requested, role, [...unlockedIds, pinTarget.id]);
        if (stillBlocked) {
            toast.success(`${pinTarget.name} unlocked. ${stillBlocked.name} is locked too.`);
            return true;
        }
        setPinFolderId(null);
        toast.success(`${pinTarget.name} unlocked for this session.`);
        navigateToFolder(requested);
        return true;
    };

    const toggleLock = (folder: MediaFolder) => {
        if (role !== "Super Admin") return toast.error("Only a Super Admin can lock or unlock folders.");
        store().setFolderLock(folder.id, !folder.isLocked);
        toast.success(folder.isLocked ? `${folder.name} unlocked.` : `${folder.name} locked. Managers and Editors now need the PIN.`);
    };

    const handleCreateFolder = (name: string): boolean => {
        const result = store().createFolder(name, currentFolderId);
        if (!result.ok) {
            toast.error(result.error === "name_taken" ? "A folder with this name already exists here." : "Folder name is required.");
            return false;
        }
        toast.success("Folder created successfully");
        return true;
    };

    /** Uploads land in the open folder, or in "Unfiled" from the landing view. */
    const uploadFile = (file: Omit<NewMediaFileInput, "folderId">) => {
        const folderId = currentFolderId && isCurrentAccessible ? currentFolderId : UNFILED_FOLDER_ID;
        store().uploadFile({ ...file, folderId });
        toast.success(`Uploaded to ${folders.find((folder) => folder.id === folderId)?.name ?? "Unfiled"}.`);
    };

    const handleDeleteFile = (id: string) => {
        if (confirm("Delete this file?")) {
            store().deleteFile(id);
            setSelectedFileIds((prev) => prev.filter((selected) => selected !== id));
            toast.success("File deleted");
        }
    };

    const handleDeleteFolder = (folder: MediaFolder) => {
        if (!canOpen(folder.id)) return toast.error("Unlock this folder before deleting it.");
        if (folder.id === UNFILED_FOLDER_ID) return toast.error("The Unfiled folder can't be deleted.");
        if (confirm(`Delete "${folder.name}" and everything inside it?`)) {
            store().deleteFolder(folder.id);
            toast.success("Folder deleted");
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedFileIds.length} selected files?`)) {
            store().bulkDeleteFiles(selectedFileIds);
            setSelectedFileIds([]);
            toast.success("Files deleted");
        }
    };

    return {
        role,
        setRole: (value: string) => {
            const next = SESSION_ROLES.find((option) => option === value);
            if (next) { setRole(next); setPinFolderId(null); }
        },
        isSuperAdmin: role === "Super Admin",
        view,
        currentFolder,
        isCurrentAccessible,
        currentBlocker: currentFolder ? blockingFolder(folders, currentFolderId, role, unlockedIds) : null,
        breadcrumbs,
        folderPath,
        visibleFolders,
        visibleFiles,
        stats,
        searchQuery, setSearchQuery,
        typeFilter, setTypeFilter,
        canOpen,
        isLocked,
        navigateToFolder,
        openFolder,
        pinTarget,
        requestPinFor: (folderId: string) => setPinFolderId(folderId),
        closePin: () => setPinFolderId(null),
        submitPin,
        toggleLock,
        selectedFileIds, setSelectedFileIds,
        isCreateFolderOpen, setIsCreateFolderOpen,
        isUploadOpen, setIsUploadOpen,
        handleCreateFolder,
        uploadFile,
        handleDeleteFile,
        handleDeleteFolder,
        handleBulkDelete,
    };
}

export type MediaManagerType = ReturnType<typeof useMediaManager>;
