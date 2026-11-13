import { useCallback, useRef, useState } from "react";
import { UnsavedChangesGuard, UnsavedChangesHandle } from "@/types/products";

/**
 * Asks the mounted form (via `formRef`) whether it has unsaved edits before closing.
 * The form is only asked at close time, so it never has to report every keystroke upward.
 */
export function useUnsavedChangesGuard(): UnsavedChangesGuard {
    const formRef = useRef<UnsavedChangesHandle | null>(null);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const run = useCallback((action: () => void) => {
        if (formRef.current?.hasUnsavedChanges()) {
            setPendingAction(() => action);
            return;
        }
        action();
    }, []);

    const confirm = () => {
        setPendingAction(null);
        pendingAction?.();
    };

    return {
        formRef,
        run,
        isConfirmOpen: pendingAction !== null,
        confirm,
        cancel: () => setPendingAction(null),
    };
}
