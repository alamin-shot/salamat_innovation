"use client";
import { ChevronRight, FolderPlus, Image as ImageIcon, Lock, Search, ShieldCheck, Upload, X } from "lucide-react";
import { useMediaManager } from "@/hooks/media_hooks/useMediaManager";
import { useMediaStore } from "@/store/useMediaStore";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MEDIA_TYPE_LABELS, SESSION_ROLES } from "@/constants/media";
import { MediaFileType } from "@/types/media";
import { MediaUploadDrawer } from "./MediaUploadDrawer";
import { CreateFolderDrawer } from "./CreateFolderDrawer";
import { MediaOverview } from "./MediaOverview";
import { MediaFolderCard } from "./MediaFolderCard";
import { MediaFileCard } from "./MediaFileCard";
import { FolderPinModal } from "./FolderPinModal";

export function MediaClient() {
    const manager = useMediaManager();
    const files = useMediaStore((state) => state.files);
    const fileCount = (folderId: string) => files.filter((file) => file.folderId === folderId).length;
    const toggleSelectFile = (id: string) => manager.setSelectedFileIds((prev) => (prev.includes(id) ? prev.filter((selected) => selected !== id) : [...prev, id]));

    return (
        <div className="flex min-h-full w-full flex-col gap-4 p-4">
            {/* Header & Actions */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                        {manager.breadcrumbs.map((crumb, idx) => (
                            <div key={crumb.id ?? "root"} className="flex items-center gap-1.5">
                                {idx > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
                                <button type="button" onClick={() => manager.navigateToFolder(crumb.id)} className={`transition-colors hover:text-brand-primary ${idx === manager.breadcrumbs.length - 1 ? "font-semibold text-gray-900" : ""}`}>
                                    {crumb.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Mock session role until auth is wired: lets Manager / Editor locks be tested. */}
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-2 py-1" title="Mock session role (until login is connected)">
                        <ShieldCheck className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">View as</span>
                        <div className="w-36"><CustomSelect size="sm" value={manager.role} onChange={manager.setRole} options={SESSION_ROLES} /></div>
                    </div>
                    <Button variant="outline" onClick={() => manager.setIsCreateFolderOpen(true)} className="h-9 gap-2" disabled={manager.view === "folder" && !manager.isCurrentAccessible}>
                        <FolderPlus className="h-4 w-4" /> Create Folder
                    </Button>
                    <Button variant="success" onClick={() => manager.setIsUploadOpen(true)} className="h-9 gap-2" disabled={manager.view === "folder" && !manager.isCurrentAccessible}>
                        <Upload className="h-4 w-4" /> Upload File
                    </Button>
                </div>
            </div>

            {/* Search + type filter (files only appear here, inside a folder, or from a category) */}
            <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input value={manager.searchQuery} onChange={(e) => manager.setSearchQuery(e.target.value)} placeholder="Search files in all folders you can open" className="erp-input w-full pl-9" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {(Object.keys(MEDIA_TYPE_LABELS) as MediaFileType[]).map((type) => (
                        <button key={type} type="button" onClick={() => manager.setTypeFilter(manager.typeFilter === type ? "" : type)} className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${manager.typeFilter === type ? "border-brand-primary bg-brand-primary/10 text-brand-text" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                            {MEDIA_TYPE_LABELS[type]}
                        </button>
                    ))}
                    {(manager.searchQuery || manager.typeFilter) && (
                        <button type="button" onClick={() => { manager.setSearchQuery(""); manager.setTypeFilter(""); }} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                            <X className="h-3 w-3" /> Clear
                        </button>
                    )}
                </div>
            </div>

            {manager.view === "landing" && <MediaOverview stats={manager.stats} onPickType={manager.setTypeFilter} />}

            {/* Locked folder opened directly (e.g. from a link) */}
            {manager.view === "folder" && !manager.isCurrentAccessible && manager.currentBlocker && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/40 p-12 text-center">
                    <Lock className="h-10 w-10 text-amber-500" />
                    <h3 className="text-sm font-bold text-gray-800">{manager.currentBlocker.name} is locked</h3>
                    <p className="text-xs text-gray-500">Enter the PIN to view or manage its contents.</p>
                    <Button variant="success" onClick={() => manager.requestPinFor(manager.currentFolder?.id ?? "")}>Enter PIN</Button>
                </div>
            )}

            {manager.view !== "results" && (manager.view === "landing" || manager.isCurrentAccessible) && (
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Folders</h3>
                    {manager.visibleFolders.length === 0 ? (
                        <p className="text-sm text-gray-400">No folders here.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {manager.visibleFolders.map((folder) => (
                                <MediaFolderCard
                                    key={folder.id}
                                    folder={folder}
                                    fileCount={fileCount(folder.id)}
                                    isLocked={manager.isLocked(folder.id)}
                                    canOpen={manager.canOpen(folder.id)}
                                    canManageLocks={manager.isSuperAdmin}
                                    onOpen={manager.openFolder}
                                    onToggleLock={manager.toggleLock}
                                    onDelete={manager.handleDeleteFolder}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(manager.view === "results" || (manager.view === "folder" && manager.isCurrentAccessible)) && (
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {manager.view === "results" ? `Files · ${manager.visibleFiles.length} result${manager.visibleFiles.length === 1 ? "" : "s"}` : "Files"}
                    </h3>
                    {manager.visibleFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-12 text-gray-400">
                            <ImageIcon className="mb-2 h-10 w-10 text-gray-300" />
                            <p className="text-sm font-medium">{manager.view === "results" ? "No files match in the folders you can open." : "No media files in this folder."}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {manager.visibleFiles.map((file) => (
                                <MediaFileCard
                                    key={file.id}
                                    file={file}
                                    isSelected={manager.selectedFileIds.includes(file.id)}
                                    location={manager.view === "results" ? manager.folderPath(file.folderId) : undefined}
                                    onToggle={toggleSelectFile}
                                    onDelete={manager.handleDeleteFile}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {manager.selectedFileIds.length > 0 && (
                <BulkActionBar selectedCount={manager.selectedFileIds.length} onClearSelection={() => manager.setSelectedFileIds([])}>
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>Delete Selected Files</Button>
                </BulkActionBar>
            )}

            <CreateFolderDrawer isOpen={manager.isCreateFolderOpen} onClose={() => manager.setIsCreateFolderOpen(false)} manager={manager} />
            <MediaUploadDrawer isOpen={manager.isUploadOpen} onClose={() => manager.setIsUploadOpen(false)} manager={manager} />

            {manager.pinTarget && (
                <FolderPinModal key={manager.pinTarget.id} folderName={manager.pinTarget.name} role={manager.role} onSubmit={manager.submitPin} onClose={manager.closePin} />
            )}
        </div>
    );
}
