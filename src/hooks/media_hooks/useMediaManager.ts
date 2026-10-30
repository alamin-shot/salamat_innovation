"use client";
import { useState, useCallback } from "react";
import { useMediaStore } from "@/store/useMediaStore";
import { toast } from "sonner";

export function useMediaManager() {
    const store = useMediaStore();

    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

    // Filter current folders & files based on active folder view
    const currentFolders = store.folders.filter(f => f.parentId === store.currentFolderId);
    const currentFiles = store.files.filter(f => f.folderId === store.currentFolderId);

    // Breadcrumb path resolution
    const getBreadcrumbs = useCallback(() => {
        const crumbs = [{ id: null, name: "All Media" }];
        if (!store.currentFolderId) return crumbs;

        let current: string | null = store.currentFolderId;
        const trail = [];
        while (current) {
            const folder = store.folders.find(f => f.id === current);
            if (folder) {
                trail.unshift(folder);
                current = folder.parentId;
            } else {
                break;
            }
        }
        return [...crumbs, ...trail];
    }, [store.currentFolderId, store.folders]);

    const handleCreateFolder = (name: string) => {
        if (!name.trim()) {
            toast.error("Folder name is required");
            return;
        }
        store.createFolder(name);
        setIsCreateFolderOpen(false);
        toast.success("Folder created successfully");
    };

    const handleDeleteFile = (id: string) => {
        if (confirm("Delete this file?")) {
            store.deleteFile(id);
            toast.success("File deleted");
        }
    };

    const handleDeleteFolder = (id: string) => {
        if (confirm("Delete this folder and all its contents?")) {
            store.deleteFolder(id);
            toast.success("Folder deleted");
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedFileIds.length} selected files?`)) {
            store.bulkDeleteFiles(selectedFileIds);
            setSelectedFileIds([]);
            toast.success("Files deleted");
        }
    };

    return {
        currentFolderId: store.currentFolderId,
        currentFolders,
        currentFiles,
        breadcrumbs: getBreadcrumbs(),
        isCreateFolderOpen,
        setIsCreateFolderOpen,
        selectedFileIds,
        setSelectedFileIds,
        navigateToFolder: store.navigateToFolder,
        handleCreateFolder,
        handleDeleteFile,
        handleDeleteFolder,
        handleBulkDelete,
        uploadFile: store.uploadFile
    };
}

export type MediaManagerType = ReturnType<typeof useMediaManager>;