"use client";
import * as React from "react";
import { UploadCloud, X } from "lucide-react";
import { ImageDropzoneProps } from "@/types/dropzone";

export function ImageDropzone({
    label,
    error,
    helperText,
    onFileSelect,
    maxSizeMB = 2,
    accept = "image/*",
    previewUrl
}: ImageDropzoneProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > maxSizeMB * 1024 * 1024) {
                alert(`File exceeds maximum size of ${maxSizeMB}MB`);
                return;
            }
            onFileSelect(file);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-semibold text-brand-text">{label}</label>}

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-brand-bg/50 ${error ? "border-red-500 bg-red-50" : "border-brand-subtext/30 bg-brand-bg/10 hover:border-brand-primary/50"
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />

                {previewUrl ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-md border border-brand-subtext/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                            <span className="text-xs font-medium text-white">Change Image</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <UploadCloud className="mb-2 h-8 w-8 text-brand-primary" />
                        <p className="text-sm font-medium text-brand-text">
                            Drop files here or click to upload
                        </p>
                        <p className="mt-1 text-xs text-brand-subtext">
                            Max file size: {maxSizeMB}MB
                        </p>
                    </div>
                )}
            </div>

            {error && <span className="text-xs font-medium text-red-500 animate-in fade-in">{error}</span>}
            {!error && helperText && <span className="text-xs text-brand-subtext">{helperText}</span>}
        </div>
    );
}