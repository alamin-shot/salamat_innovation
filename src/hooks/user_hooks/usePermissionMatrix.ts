import { useState, useCallback } from "react";
import { PermissionModule } from "@/store/useGlobalUserStore";

export function usePermissionMatrix(initialPermissions: string[] = [], matrix: PermissionModule[]) {
    // We use a Set for O(1) lookups and instant toggles in the UI
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set(initialPermissions));

    const togglePermission = useCallback((actionId: string, requires?: string[]) => {
        setSelectedPermissions(prev => {
            const next = new Set(prev);
            if (next.has(actionId)) {
                next.delete(actionId);
            } else {
                next.add(actionId);
                // SMART DEPENDENCY: Auto-grant required read-access if checking an edit/delete box
                if (requires) {
                    requires.forEach(req => next.add(req));
                }
            }
            return next;
        });
    }, []);

    const grantModuleFullAccess = useCallback((module: PermissionModule) => {
        setSelectedPermissions(prev => {
            const next = new Set(prev);
            module.actions.forEach(action => next.add(action.id));
            return next;
        });
    }, []);

    const revokeModuleAccess = useCallback((module: PermissionModule) => {
        setSelectedPermissions(prev => {
            const next = new Set(prev);
            module.actions.forEach(action => next.delete(action.id));
            return next;
        });
    }, []);

    // Helper to color-code the accordion headers
    const getModuleStatus = useCallback((module: PermissionModule) => {
        const granted = module.actions.filter(a => selectedPermissions.has(a.id)).length;
        if (granted === 0) return "none";
        if (granted === module.actions.length) return "full";
        return "partial";
    }, [selectedPermissions]);

    return {
        selectedPermissions,
        togglePermission,
        grantModuleFullAccess,
        revokeModuleAccess,
        getModuleStatus,
        // Utility to export back to the global store when "Save" is clicked
        exportPermissions: () => Array.from(selectedPermissions)
    };
}