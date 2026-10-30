"use client";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Upload } from "lucide-react";
import { MediaManagerType } from "@/hooks/media_hooks/useMediaManager";

interface MediaUploadDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    manager: MediaManagerType;
}

export function MediaUploadDrawer({ isOpen, onClose, manager }: MediaUploadDrawerProps) {
    const handleUploadMock = () => {
        manager.uploadFile({
            name: `Uploaded Asset ${Math.floor(Math.random() * 100)}`,
            url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
            type: "image",
            size: "1.4 MB"
        });
        onClose();
    };

    return (
        <Drawer
            title="Upload Media Files"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-brand-primary/5 cursor-pointer transition-colors">
                        <Upload className="h-10 w-10 text-brand-primary" />
                        <span className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={onClose} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleUploadMock} className="px-8 h-9">Upload</Button>
                </div>
            </div>
        </Drawer>
    );
}