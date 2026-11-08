import { useState, useMemo, useCallback } from "react";

export function useSettingsDraft<T extends Record<string, any>>(
    initialData: T,
    requiredFields: (keyof T)[] = []
) {
    const [formData, setFormData] = useState<T>(initialData);

    // --- LEAK 5 SEALED: isDirty vs isValid ---
    const isDirty = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(initialData);
    }, [formData, initialData]);

    const isValid = useMemo(() => {
        for (const field of requiredFields) {
            const val = formData[field];
            if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
                return false;
            }
        }
        return true;
    }, [formData, requiredFields]);

    const resetDraft = useCallback(() => {
        setFormData(initialData);
    }, [initialData]);

    // --- LEAK 3 SEALED: Internal Tab Interceptor ---
    const handleTabIntent = (targetTab: string, onProceed: (tab: string) => void) => {
        if (isDirty) {
            // In a full implementation, you would trigger a custom Confirm Modal here.
            // For now, if dirty, we force them to decide via UI state.
            const confirmDiscard = window.confirm("You have unsaved changes. Discard them?");
            if (confirmDiscard) {
                resetDraft();
                onProceed(targetTab);
            }
        } else {
            onProceed(targetTab);
        }
    };

    return {
        formData,
        setFormData,
        isDirty,
        isValid,
        resetDraft,
        handleTabIntent
    };
}