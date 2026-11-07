"use client";
import { useUserManager } from "@/hooks/user_hooks/useUserManager";
import { RolesMasterTable } from "./tables/RolesMasterTable";
import { RolePermissionDrawer } from "./drawers/RolePermissionDrawer";
import { UserRoleHeader } from "./componenets/UserRoleHeader";
import { UserRoleBulkActions } from "./componenets/UserRoleBulkActions";

export function RolesClient() {
    const manager = useUserManager("roles");

    return (
        // Fix: Use flex-col and h-full instead of absolute inset-0 to prevent layout blowout
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            <UserRoleHeader manager={manager} title="Roles & Permissions" subtitle="Architect granular module permissions." buttonText="Create Role" />

            {/* Fix: Ensure this container allows the table to flex properly without overflowing */}
            <div className="flex-1 overflow-hidden p-3 sm:p-4">
                <RolesMasterTable manager={manager} />
            </div>

            <UserRoleBulkActions manager={manager} />
            <RolePermissionDrawer manager={manager} />
        </div>
    );
}