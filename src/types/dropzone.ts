import * as React from "react";

export interface ImageDropzoneProps {
    label?: string;
    error?: string;
    helperText?: string;
    onFileSelect: (file: File) => void;
    maxSizeMB?: number;
    accept?: string;
    previewUrl?: string | null;
}