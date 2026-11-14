"use client";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Pagination } from "@/components/ui/Pagination";
import { useOurTeamManager } from "@/hooks/our_team_hooks/useOurTeamManager";
import { TeamMemberRow } from "./TeamMemberRow";
import { TeamMemberFormDrawer } from "./TeamMemberFormDrawer";
import { TeamMemberViewDrawer } from "./TeamMemberViewDrawer";

export function OurTeamClient() {
    const manager = useOurTeamManager();
    const { table } = manager;

    return (
        <div className="flex min-h-full w-full flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Our Team</h1>
                <Button variant="success" onClick={manager.openAdd} className="h-9 gap-2 px-4">
                    <Plus className="h-4 w-4" /> Add Our Team
                </Button>
            </div>

            <div className="flex flex-col overflow-hidden bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <div className="relative w-full max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search Our Team..." value={table.searchQuery} onChange={(e) => table.setSearchQuery(e.target.value)} className="erp-input w-full pl-9" />
                    </div>
                </div>

                {table.filteredData.length === 0 ? (
                    <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                        <Users className="h-8 w-8 text-brand-subtext/60" />
                        <h3 className="text-sm font-bold text-brand-text">No team members found</h3>
                        <p className="text-xs text-brand-subtext">Add a member to show them on the Our Team page.</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-brand-subtext">
                            <thead className="border-b border-brand-subtext/20 bg-brand-primary/5 text-brand-text">
                                <tr>
                                    <th className="w-12 p-4">
                                        <input type="checkbox" checked={table.isAllSelected} onChange={(e) => table.handleSelectAll(e.target.checked)} className="cursor-pointer rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                                    </th>
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Designation</th>
                                    <th className="p-4 font-semibold">Description</th>
                                    <th className="p-4 font-semibold">Profile Picture</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 text-right font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-subtext/10">
                                {table.paginatedData.map((member) => (
                                    <TeamMemberRow
                                        key={member.id}
                                        member={member}
                                        isSelected={table.selectedIds.includes(member.id)}
                                        onToggle={table.handleSelectRow}
                                        onView={manager.openDetails}
                                        onEdit={manager.openEdit}
                                        onDelete={manager.handleDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination currentPage={table.currentPage} totalPages={table.totalPages} onPageChange={table.setCurrentPage} itemsPerPage={table.itemsPerPage} onItemsPerPageChange={table.setItemsPerPage} />
            </div>

            {table.selectedIds.length > 0 && (
                <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>Delete Selected</Button>
                </BulkActionBar>
            )}

            <TeamMemberFormDrawer member={manager.editing} isOpen={manager.isFormOpen} onClose={manager.closeView} />
            <TeamMemberViewDrawer member={manager.viewed} isOpen={manager.isViewOpen} onClose={manager.closeView} />
        </div>
    );
}
