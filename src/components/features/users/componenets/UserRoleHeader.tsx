"use client";
import { useUserManager } from "@/hooks/user_hooks/useUserManager";
import { Button } from "@/components/ui/Button";
import { Search, Plus } from "lucide-react";

export function UserRoleHeader({
    manager, title, subtitle, buttonText
}: {
    manager: ReturnType<typeof useUserManager>, title: string, subtitle: string, buttonText: string
}) {
    const isUsers = manager.activeTab === "users";

    return (
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">{title}</h1>
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-full sm:w-80 shrink-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="erp-input pl-9 h-9 w-full text-sm font-medium bg-white"
                        value={manager.searchQuery}
                        onChange={(e) => manager.setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    variant="default"
                    className="bg-brand-primary text-white shadow-md hover:shadow-lg shrink-0"
                    onClick={() => {
                        manager.setActiveRecord(null);
                        manager.setDrawerMode(isUsers ? "user_form" : "role_form");
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" /> {buttonText}
                </Button>
            </div>
        </div>
    );
}