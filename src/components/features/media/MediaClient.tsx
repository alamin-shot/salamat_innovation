"use client";
import { useState } from "react";
import { useMediaManager } from "@/hooks/media_hooks/useMediaManager";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { MediaUploadDrawer } from "./MediaUploadDrawer";
import { CreateFolderDrawer } from "./CreateFolderDrawer";
import { Folder, FolderPlus, FileText, Image as ImageIcon, Trash2, ChevronRight, Upload } from "lucide-react";

export function MediaClient() {
    const manager = useMediaManager();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const toggleSelectFile = (id: string) => {
        manager.setSelectedFileIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        {manager.breadcrumbs.map((crumb, idx) => (
                            <div key={crumb.id || "root"} className="flex items-center gap-1.5">
                                {idx > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
                                <button
                                    onClick={() => manager.navigateToFolder(crumb.id)}
                                    className={`hover:text-brand-primary transition-colors ${idx === manager.breadcrumbs.length - 1 ? 'font-semibold text-gray-900' : ''}`}
                                >
                                    {crumb.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => manager.setIsCreateFolderOpen(true)} className="h-9 gap-2">
                        <FolderPlus className="h-4 w-4" /> Create Folder
                    </Button>
                    <Button variant="success" onClick={() => setIsUploadOpen(true)} className="h-9 gap-2">
                        <Upload className="h-4 w-4" /> Upload File
                    </Button>
                </div>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden p-6 gap-6">

                {/* Folders Section */}
                {manager.currentFolders.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Folders</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {manager.currentFolders.map(folder => (
                                <div
                                    key={folder.id}
                                    onClick={() => manager.navigateToFolder(folder.id)}
                                    className="group relative flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-brand-primary/5 hover:border-brand-primary/30 cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-2.5 truncate">
                                        <Folder className="h-5 w-5 text-amber-500 shrink-0" />
                                        <span className="text-sm font-medium text-gray-800 truncate">{folder.name}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); manager.handleDeleteFolder(folder.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <hr className="border-gray-100" />

                {/* Files Grid Section */}
                <div className="flex flex-col gap-3 flex-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Files</h3>
                    {manager.currentFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            <ImageIcon className="h-10 w-10 text-gray-300 mb-2" />
                            <p className="text-sm font-medium">No media files in this folder.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {manager.currentFiles.map(file => {
                                const isSelected = manager.selectedFileIds.includes(file.id);
                                return (
                                    <div
                                        key={file.id}
                                        onClick={() => toggleSelectFile(file.id)}
                                        className={`group relative flex flex-col rounded-lg border bg-white overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="absolute top-2 left-2 z-10">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => { }}
                                                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer h-4 w-4"
                                            />
                                        </div>

                                        <div className="h-32 w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                            {file.type === "image" ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={file.url} alt={file.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <FileText className="h-10 w-10 text-blue-500" />
                                            )}
                                        </div>

                                        <div className="p-3 flex flex-col gap-1">
                                            <span className="text-xs font-medium text-gray-900 truncate">{file.name}</span>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>{file.size}</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); manager.handleDeleteFile(file.id); }}
                                                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Action Bar */}
            {manager.selectedFileIds.length > 0 && (
                <BulkActionBar
                    selectedCount={manager.selectedFileIds.length}
                    onClearSelection={() => manager.setSelectedFileIds([])}
                >
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>
                        Delete Selected Files
                    </Button>
                </BulkActionBar>
            )}

            {/* Separated Drawers */}
            <CreateFolderDrawer
                isOpen={manager.isCreateFolderOpen}
                onClose={() => manager.setIsCreateFolderOpen(false)}
                manager={manager}
            />

            <MediaUploadDrawer
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                manager={manager}
            />
        </div>
    );
}