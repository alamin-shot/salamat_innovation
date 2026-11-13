import * as React from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface UnsavedChangesConfirmProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/** Shown when a drawer is closed while its form still has unsaved edits. */
export function UnsavedChangesConfirm({ isOpen, onConfirm, onCancel }: UnsavedChangesConfirmProps) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            title="Discard unsaved changes?"
            message="Some variant changes have not been saved. Leaving now will discard them."
            confirmLabel="Discard Changes"
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
}
