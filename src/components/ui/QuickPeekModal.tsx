"use client";
import * as React from "react";
import { X, Edit2, ExternalLink } from "lucide-react";

interface QuickPeekModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onAdvancedEdit?: () => void;
    children: (isEditMode: boolean, setIsEditMode: (val: boolean) => void) => React.ReactNode;
}

export function QuickPeekModal({ isOpen, onClose, title, onAdvancedEdit, children }: QuickPeekModalProps) {
    const [isEditMode, setIsEditMode] = React.useState(false);

    // Reset edit mode when modal closes
    React.useEffect(() => {
        if (!isOpen) setTimeout(() => setIsEditMode(false), 300);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[500px] flex flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-brand-subtext/10 px-5 py-4">
                    <h2 className="text-lg font-bold text-brand-text">
                        {title} {isEditMode && <span className="text-brand-primary text-sm font-medium ml-2">(Edit Mode)</span>}
                    </h2>
                    <div className="flex items-center gap-1 sm:gap-2">
                        {!isEditMode && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-colors hover:bg-amber-100"
                                title="Quick Edit"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                        )}
                        {onAdvancedEdit && (
                            <button
                                onClick={onAdvancedEdit}
                                className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
                                title="Open Full Drawer"
                            >
                                <span className="hidden sm:inline">Advanced</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-subtext transition-colors hover:bg-brand-bg hover:text-brand-text"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body - We use a render prop to pass down the edit state */}
                <div className="p-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children(isEditMode, setIsEditMode)}
                </div>
            </div>
        </div>
    );
}