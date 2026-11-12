"use client";
import * as React from "react";
import { UploadCloud, Film, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ProductVideo } from "@/types/products";
import { MAX_PRODUCT_VIDEOS, PRODUCT_VIDEO_HELPER_TEXT, PRODUCT_VIDEO_LIMIT_MESSAGE } from "@/constants/products";
import { takeWithinLimit } from "@/utils/productRules";

interface ProductVideoUploaderProps {
    videos: ProductVideo[];
    onChange: (videos: ProductVideo[]) => void;
}

const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/** Video upload area limited to MAX_PRODUCT_VIDEOS files. Files are held as metadata until the API upload is wired. */
export function ProductVideoUploader({ videos, onChange }: ProductVideoUploaderProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isLimitReached = videos.length >= MAX_PRODUCT_VIDEOS;

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const incoming: ProductVideo[] = Array.from(fileList).map((file, index) => ({
            id: `vid-${Date.now()}-${index}`,
            name: file.name,
            sizeBytes: file.size,
        }));
        const { accepted, rejected } = takeWithinLimit(videos.length, incoming, MAX_PRODUCT_VIDEOS);
        if (accepted.length > 0) {
            onChange([...videos, ...accepted]);
        }
        if (rejected > 0) {
            toast.error(PRODUCT_VIDEO_LIMIT_MESSAGE);
        }
    };

    const removeVideo = (id: string) => onChange(videos.filter((video) => video.id !== id));

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Product Videos</label>
                <span className={`text-xs font-semibold ${isLimitReached ? "text-amber-600" : "text-brand-subtext"}`}>
                    {videos.length} / {MAX_PRODUCT_VIDEOS}
                </span>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                }}
            />

            {isLimitReached ? (
                <div className="flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-4 text-amber-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-semibold">{PRODUCT_VIDEO_LIMIT_MESSAGE} Remove a video to upload another.</span>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFiles(e.dataTransfer.files);
                    }}
                    className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-600/40 bg-emerald-50/30 py-6 transition-colors hover:border-emerald-600/70 hover:bg-emerald-50"
                >
                    <UploadCloud className="mb-2 h-6 w-6 text-emerald-600" />
                    <span className="text-sm font-bold text-brand-text">Drop files here or click to upload</span>
                    <span className="text-xs font-medium text-emerald-600 mt-1">Upload Files</span>
                </div>
            )}

            <p className="text-xs text-brand-subtext">{PRODUCT_VIDEO_HELPER_TEXT}</p>

            {videos.length > 0 && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {videos.map((video) => (
                        <div key={video.id} className="flex items-center gap-3 rounded-lg border border-brand-subtext/20 bg-white p-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                                <Film className="h-4 w-4" />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate text-sm font-medium text-brand-text">{video.name}</span>
                                <span className="text-xs text-brand-subtext">{formatSize(video.sizeBytes)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeVideo(video.id)}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Remove video"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
