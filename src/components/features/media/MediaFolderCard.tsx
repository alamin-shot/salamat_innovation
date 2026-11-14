import * as React from "react";
import { Folder, FolderLock, Lock, LockOpen, Trash2 } from "lucide-react";
import { MediaFolder } from "@/types/media";

interface MediaFolderCardProps {
    folder: MediaFolder;
    fileCount: number;
    /** Locked here or above. */
    isLocked: boolean;
    canOpen: boolean;
    canManageLocks: boolean;
    onOpen: (id: string) => void;
    onToggleLock: (folder: MediaFolder) => void;
    onDelete: (folder: MediaFolder) => void;
}

export const MediaFolderCard = React.memo(function MediaFolderCard({ folder, fileCount, isLocked, canOpen, canManageLocks, onOpen, onToggleLock, onDelete }: MediaFolderCardProps) {
    const Icon = isLocked ? FolderLock : Folder;
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onOpen(folder.id)}
            onKeyDown={(e) => { if (e.key === "Enter") onOpen(folder.id); }}
            className={`group relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${isLocked && !canOpen ? "border-amber-200 bg-amber-50/40" : "border-gray-200 bg-gray-50 hover:border-brand-primary/30 hover:bg-brand-primary/5"}`}
        >
            <div className="flex items-start justify-between gap-2">
                <Icon className={`h-8 w-8 shrink-0 ${isLocked ? "text-amber-600" : "text-amber-500"}`} />
                <div className="flex items-center gap-0.5">
                    {canManageLocks && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onToggleLock(folder); }}
                            title={folder.isLocked ? "Unlock folder" : "Lock folder"}
                            className={`rounded p-1 transition-colors ${folder.isLocked ? "text-amber-600 hover:bg-amber-100" : "text-gray-400 opacity-0 hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"}`}
                        >
                            {folder.isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                        </button>
                    )}
                    {!canManageLocks && isLocked && <Lock className="h-4 w-4 text-amber-600" aria-label="Locked" />}
                    {canOpen && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onDelete(folder); }}
                            title="Delete folder"
                            className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>
            <div className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-800">{folder.name}</span>
                <span className="text-xs text-gray-500">{isLocked && !canOpen ? "PIN required" : `${fileCount} file${fileCount === 1 ? "" : "s"}`}</span>
            </div>
        </div>
    );
});
MediaFolderCard.displayName = "MediaFolderCard";
