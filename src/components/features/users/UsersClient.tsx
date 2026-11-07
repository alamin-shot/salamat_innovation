"use client";
import { useUserManager } from "@/hooks/user_hooks/useUserManager";

import { UsersMasterTable } from "./tables/UsersMasterTable";
import { UserFormDrawer } from "./drawers/UserFormDrawer";
import { UserRoleHeader } from "./componenets/UserRoleHeader";
import { UserRoleBulkActions } from "./componenets/UserRoleBulkActions";

export function UsersClient() {
    const manager = useUserManager("users");

    return (
        // Fix: Use flex-col and h-full instead of absolute inset-0 to prevent layout blowout
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            <UserRoleHeader manager={manager} title="System Users" subtitle="Manage employee accounts and access." buttonText="Add User" />

            {/* Fix: Ensure this container allows the table to flex properly without overflowing */}
            <div className="flex-1 overflow-hidden p-3 sm:p-4">
                <UsersMasterTable manager={manager} />
            </div>

            <UserRoleBulkActions manager={manager} />
            <UserFormDrawer manager={manager} />
        </div>
    );
}