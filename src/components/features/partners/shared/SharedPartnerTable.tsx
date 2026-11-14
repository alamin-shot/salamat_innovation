import { FileSearch, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { SharedPartnerManagerType } from "@/hooks/partner_hooks/shared/useSharedPartnerManager";
import { SharedPartnerToolbar } from "./SharedPartnerToolbar";
import { PartnerRow } from "./PartnerRow";

export function SharedPartnerTable({ manager }: { manager: SharedPartnerManagerType }) {
    const { table, cols } = manager;

    return (
        <div className="relative flex w-full flex-col bg-white">
            <SharedPartnerToolbar manager={manager} />

            {table.filteredData.length === 0 ? (
                <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <FileSearch className="h-10 w-10 text-gray-300" />
                    <h3 className="text-sm font-bold text-brand-text">Nothing to show here</h3>
                    <p className="text-xs text-brand-subtext">{table.searchQuery ? "No match for this search." : `Add a ${manager.labels.one.toLowerCase()} to get started.`}</p>
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-12 text-center">
                                <input type="checkbox" checked={table.isAllSelected} onChange={(e) => table.handleSelectAll(e.target.checked)} className="h-4 w-4 cursor-pointer rounded text-emerald-600" />
                            </TableHeadCell>
                            {cols.customer && <TableHeadCell>{manager.isApplications ? "Applicant" : "Partner"}</TableHeadCell>}
                            {cols.tier && <TableHeadCell>Tier</TableHeadCell>}
                            {cols.businessName && <TableHeadCell>Business Name</TableHeadCell>}
                            {cols.primaryPhone && <TableHeadCell>Primary Phone</TableHeadCell>}
                            {cols.secondaryPhone && <TableHeadCell>Secondary Phone</TableHeadCell>}
                            {cols.email && <TableHeadCell>Email</TableHeadCell>}
                            {cols.tradeLicense && <TableHeadCell>Trade License</TableHeadCell>}
                            {cols.address && <TableHeadCell>Address</TableHeadCell>}
                            {cols.status && <TableHeadCell className="w-36">Status</TableHeadCell>}
                            <TableHeadCell className="min-w-[140px] pr-4 text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {table.paginatedData.map((row) => (
                                <PartnerRow
                                    key={row.id}
                                    row={row}
                                    cols={cols}
                                    isApplication={manager.isApplications}
                                    isSelected={table.selectedIds.includes(row.id)}
                                    onToggleSelect={table.handleSelectRow}
                                    onView={manager.handleView}
                                    onEdit={manager.handleEdit}
                                    onDelete={manager.handleDelete}
                                    onToggleStatus={manager.handleToggleStatus}
                                    onApprove={manager.startApprove}
                                    onReject={manager.handleReject}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Pagination currentPage={table.currentPage} totalPages={table.totalPages} onPageChange={table.setCurrentPage} itemsPerPage={table.itemsPerPage} onItemsPerPageChange={table.setItemsPerPage} />

            <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
                <Button type="button" variant="destructive-ghost" size="sm" onClick={manager.handleBulkDelete} className="gap-2 text-red-400">
                    <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Delete Selected</span>
                </Button>
            </BulkActionBar>
        </div>
    );
}
