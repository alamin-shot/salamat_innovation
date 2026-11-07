"use client";
import React, { memo } from "react";
import { useUserManager } from "@/hooks/user_hooks/useUserManager";
import { RoleRecord } from "@/store/useGlobalUserStore";
import { Edit, Trash2, Copy, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

const RoleRow = memo(({
    row, isSelected, onToggle, onEdit, onDelete, onDuplicate
}: {
    row: RoleRecord, isSelected: boolean, onToggle: (id: string, len: number) => void, onEdit: (row: RoleRecord) => void, onDelete: (id: string) => void, onDuplicate: (row: RoleRecord) => void
}) => (
    <tr className="hover:bg-gray-50/70 transition-colors group">
        <td className="p-3 text-center w-12">
            <input
                type="checkbox"
                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                checked={isSelected}
                onChange={() => onToggle(row.id, 1)}
            />
        </td>
        <td className="p-3">
            <span className="text-sm font-bold text-gray-900">{row.name}</span>
        </td>
        <td className="p-3">
            <span className="text-sm font-black text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {row.userCount} Users
            </span>
        </td>
        <td className="p-3">
            <span className="text-sm font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                {row.permissions.length} Permissions
            </span>
        </td>
        <td className="p-3 text-right">
            <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon-sm" onClick={() => onDuplicate(row)}>
                    <Copy className="w-4 h-4 text-emerald-500 hover:text-emerald-700" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row)}>
                    <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.id)}>
                    <Trash2 className="w-4 h-4 text-rose-500 hover:text-rose-700" />
                </Button>
            </div>
        </td>
    </tr>
));
RoleRow.displayName = "RoleRow";

export function RolesMasterTable({ manager }: { manager: ReturnType<typeof useUserManager> }) {
    const data = manager.paginatedData as RoleRecord[];

    const handleEdit = (row: RoleRecord) => {
        manager.setActiveRecord(row);
        manager.setDrawerMode("role_form");
    };

    const handleDuplicate = (row: RoleRecord) => {
        // Automatically creates a cloned role and opens it in the editor
        const clonedRole = { ...row, name: `${row.name} (Copy)` };
        manager.setActiveRecord(clonedRole);
        manager.setDrawerMode("role_form");
    };

    if (data.length === 0) {
        return (
            <div className="bg-white flex flex-col items-center justify-center border border-gray-200 text-center min-h-[350px] rounded-xl shadow-sm h-full">
                <ShieldAlert className="w-6 h-6 text-gray-300 mb-2" />
                <h3 className="text-sm font-black text-gray-900">No Roles Found</h3>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 flex flex-col h-full overflow-hidden shadow-sm rounded-xl">
            <div className="w-full overflow-auto custom-scrollbar flex-1 relative">
                <table className="w-full text-left border-collapse text-sm min-w-max">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="p-3 w-12 text-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    checked={manager.selectedIds.length === manager.processedData.length && manager.processedData.length > 0}
                                    onChange={() => manager.toggleSelection("ALL", manager.processedData.length)}
                                />
                            </th>
                            <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Role Name</th>
                            <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Assigned Users</th>
                            <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Total Permissions</th>
                            <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row) => (
                            <RoleRow
                                key={row.id}
                                row={row}
                                isSelected={manager.selectedIds.includes(row.id)}
                                onToggle={manager.toggleSelection}
                                onEdit={handleEdit}
                                onDelete={(id) => manager.store.deleteRoles([id])}
                                onDuplicate={handleDuplicate}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="border-t border-gray-200 bg-white p-3 flex justify-end shrink-0">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    Page {manager.currentPage} of {Math.max(1, Math.ceil(manager.processedData.length / manager.perPage))}
                </div>
            </div>
        </div>
    );
}