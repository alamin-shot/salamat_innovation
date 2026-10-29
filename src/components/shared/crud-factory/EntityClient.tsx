"use client";
import { useGenericManager } from "@/hooks/crud_hooks/useGenericManager";
import { EntitySchemaField, EntityTable } from "./EntityTable";
import { EntityDrawer } from "./EntityDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
// import { Pagination } from "@/components/ui/Pagination"; // Assumed global standard
import { Plus } from "lucide-react";

interface EntityClientProps {
    title: string;
    moduleKey: string;
    schema: EntitySchemaField[];
}

export function EntityClient({ title, moduleKey, schema }: EntityClientProps) {
    const manager = useGenericManager(moduleKey);

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                <Button variant="success" onClick={manager.openAddDrawer} className="h-9 px-4 gap-2">
                    <Plus className="h-4 w-4" /> Add {title}
                </Button>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder={`Search ${title}...`}
                        className="erp-input max-w-xs"
                    />
                </div>

                <EntityTable schema={schema} manager={manager} />

                {/* <Pagination table={manager.table} /> - To be wired to standard pagination hook */}
            </div>

            {/* Global Standard Bulk Action Bar */}
            {manager.selectedIds.length > 0 && (
                <BulkActionBar
                    selectedCount={manager.selectedIds.length}
                    onClearSelection={() => manager.setSelectedIds([])}
                >
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>
                        Delete Selected
                    </Button>
                </BulkActionBar>
            )}

            <EntityDrawer title={title} schema={schema} manager={manager} />
        </div>
    );
}