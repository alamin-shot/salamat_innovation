"use client";
import { useUserManager } from "@/hooks/user_hooks/useUserManager";
import { Button } from "@/components/ui/Button";
import { Trash2, ShieldBan } from "lucide-react";
import { BulkActionBar } from "@/components/ui/BulkActionBar";

export function UserRoleBulkActions({ manager }: { manager: ReturnType<typeof useUserManager> }) {
    if (manager.selectedIds.length === 0) return null;

    const handleDelete = () => {
        if (confirm(`Delete ${manager.selectedIds.length} selected items?`)) {
            if (manager.activeTab === "users") manager.store.deleteUsers(manager.selectedIds);
            else manager.store.deleteRoles(manager.selectedIds);
        }
    };

    return (
        <BulkActionBar
            selectedCount={manager.selectedIds.length}
            onClearSelection={() => manager.setSelectedIds([])}
        >
            <Button
                variant="default"
                size="sm"
                className="bg-rose-500 hover:bg-rose-600 border-none shadow-none text-white h-8 text-xs font-bold"
                onClick={handleDelete}
            >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Selected
            </Button>
            {manager.activeTab === "users" && (
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-white h-8 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                    <ShieldBan className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Suspend Users
                </Button>
            )}
        </BulkActionBar>
    );
}