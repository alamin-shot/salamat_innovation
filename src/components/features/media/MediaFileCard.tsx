import * as React from "react";
import Image from "next/image";
import { FileText, Film, Trash2 } from "lucide-react";
import { MediaFile } from "@/types/media";
import { formatBytes } from "@/utils/mediaRules";

interface MediaFileCardProps {
    file: MediaFile;
    isSelected: boolean;
    /** Shown in search results so you know where the file lives. */
    location?: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const MediaFileCard = React.memo(function MediaFileCard({ file, isSelected, location, onToggle, onDelete }: MediaFileCardProps) {
    return (
        <div
            onClick={() => onToggle(file.id)}
            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white transition-all ${isSelected ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20" : "border-gray-200 hover:border-gray-300"}`}
        >
            <div className="absolute left-2 top-2 z-10">
                <input type="checkbox" checked={isSelected} onChange={() => onToggle(file.id)} onClick={(e) => e.stopPropagation()} className="h-4 w-4 cursor-pointer rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            </div>

            <div className="relative flex h-32 w-full items-center justify-center overflow-hidden bg-gray-100">
                {file.type === "image" && (file.url.startsWith("http") || file.url.startsWith("data:")) ? (
                    <Image src={file.url} alt={file.name} fill unoptimized sizes="240px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : file.type === "video" ? (
                    <Film className="h-10 w-10 text-violet-500" />
                ) : (
                    <FileText className="h-10 w-10 text-blue-500" />
                )}
            </div>

            <div className="flex flex-col gap-1 p-3">
                <span className="truncate text-xs font-medium text-gray-900" title={file.name}>{file.name}</span>
                {location && <span className="truncate text-[10px] text-gray-400" title={location}>{location}</span>}
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{formatBytes(file.sizeBytes)}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(file.id); }} title="Delete file" className="opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
});
MediaFileCard.displayName = "MediaFileCard";
