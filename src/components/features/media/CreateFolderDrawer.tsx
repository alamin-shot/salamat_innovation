"use client";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { MediaManagerType } from "@/hooks/media_hooks/useMediaManager";

interface CreateFolderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    manager: MediaManagerType;
}

export function CreateFolderDrawer({ isOpen, onClose, manager }: CreateFolderDrawerProps) {
    const [folderName, setFolderName] = useState("");

    const handleCreate = () => {
        manager.handleCreateFolder(folderName);
        setFolderName("");
        onClose();
    };

    return (
        <Drawer
            title="Create New Folder"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Folder Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="erp-input"
                            placeholder="e.g. Campaign Assets"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={onClose} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleCreate} className="px-8 h-9">Create</Button>
                </div>
            </div>
        </Drawer>
    );
}