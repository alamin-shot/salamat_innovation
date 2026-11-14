"use client";
import * as React from "react";
import { Plus, Search, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { useVlogsManager } from "@/hooks/vlog_hooks/useVlogsManager";
import { VlogRow } from "./VlogRow";
import { VlogForm } from "./VlogForm";
import { VlogPlayer } from "./VlogPlayer";

/** Vlog spoke of the News & Vlog hub (its own store; Reels is a separate module). */
export function VlogsSpoke() {
    const m = useVlogsManager();
    const { table } = m;

    return (
        <div className="flex flex-col w-full gap-2">
            <div className="flex justify-end">
                <Button variant="success" onClick={m.openAdd} className="h-9 px-4 gap-2"><Plus className="h-4 w-4" /> Add Vlog</Button>
            </div>

            <div className="erp-card flex flex-col bg-white overflow-hidden p-0">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Search vlogs..." value={table.searchQuery} onChange={(e) => table.setSearchQuery(e.target.value)} className="erp-input pl-9 w-full" />
                    </div>
                </div>

                {table.filteredData.length === 0 ? (
                    <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                        <Video className="h-8 w-8 text-brand-subtext/60" />
                        <h3 className="text-sm font-bold text-brand-text">No vlogs found</h3>
                        <p className="text-xs text-brand-subtext">Publish a vlog with a YouTube, Vimeo or video link.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableHeadCell>Vlog</TableHeadCell>
                                <TableHeadCell>Publish Date</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell>Created By</TableHeadCell>
                                <TableHeadCell className="text-right">Action</TableHeadCell>
                            </TableHeader>
                            <TableBody>
                                {table.paginatedData.map((vlog) => (
                                    <VlogRow key={vlog.id} vlog={vlog} onPreview={m.openPreview} onEdit={m.openEdit} onDelete={m.requestDelete} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination currentPage={table.currentPage} totalPages={table.totalPages} onPageChange={table.setCurrentPage} itemsPerPage={table.itemsPerPage} onItemsPerPageChange={table.setItemsPerPage} />
            </div>

            <Drawer title={m.editing ? "Edit Vlog" : "Add Vlog"} isOpen={m.isFormOpen} onClose={m.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
                {m.isFormOpen && (
                    <div className="pb-32">
                        <VlogForm key={m.editing?.id ?? "new"} vlog={m.editing} onCancel={m.closeDrawer} onSaved={m.closeDrawer} />
                    </div>
                )}
            </Drawer>

            <Drawer title="Vlog Preview" isOpen={m.isPreviewOpen} onClose={m.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
                {m.previewing && (
                    <div className="mx-auto flex max-w-4xl flex-col gap-4 pb-32">
                        <VlogPlayer videoUrl={m.previewing.videoUrl} title={m.previewing.title} />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{m.previewing.title}</h2>
                            <p className="text-xs text-gray-500">Published {m.previewing.publishDate} · {m.previewing.status}</p>
                        </div>
                        {m.previewing.description && <p className="whitespace-pre-line text-sm text-gray-700">{m.previewing.description}</p>}
                    </div>
                )}
            </Drawer>

            <ConfirmModal
                isOpen={m.pendingDeleteId !== null}
                title="Delete vlog?"
                message="This vlog will be removed from the storefront. This cannot be undone."
                onConfirm={m.confirmDelete}
                onCancel={m.cancelDelete}
            />
        </div>
    );
}
