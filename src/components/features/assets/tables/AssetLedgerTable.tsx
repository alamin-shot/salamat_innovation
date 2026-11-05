"use client";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Eye, Edit, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";

export function AssetLedgerTable({ manager }: { manager: ReturnType<typeof useAssetManager> }) {
    return (
        <div className="flex flex-col h-full overflow-hidden w-full">
            <Table containerClassName="flex-1 overflow-x-auto min-h-[400px] w-full">
                <TableHeader>
                    <TableHeadCell className="w-10 text-center"><input type="checkbox" className="rounded text-brand-primary" /></TableHeadCell>
                    <TableHeadCell>Asset Detail</TableHeadCell>
                    <TableHeadCell>Custody</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="text-right">Net Value</TableHeadCell>
                    <TableHeadCell className="text-right w-28">Actions</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {manager.paginatedAssets.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-16 text-gray-400 text-xs">No assets match your search criteria.</TableCell>
                        </TableRow>
                    ) : (
                        manager.paginatedAssets.map((asset) => (
                            <TableRow key={asset.id} className="hover:bg-gray-50/70">
                                <TableCell className="text-center"><input type="checkbox" className="rounded text-brand-primary" /></TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 text-xs">{asset.name}</span>
                                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-500 font-mono">
                                            <span className="bg-gray-100 px-1.5 rounded">{asset.assetCode}</span> • SN: {asset.serialNumber}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {asset.status === "Assigned" ? (
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800 text-xs">{asset.assignedToName}</span>
                                            <span className="text-[10px] text-gray-400">Since {asset.purchaseDate}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unassigned</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${asset.status === "Available" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                        asset.status === "Assigned" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                            asset.status === "Under Maintenance" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                                "bg-gray-50 text-gray-600 border-gray-200"
                                        }`}>
                                        {asset.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold font-mono text-gray-900 text-xs">৳ {asset.currentDepreciatedValue.toLocaleString()}</span>
                                        <span className="text-[9px] text-gray-400 line-through">৳ {asset.purchaseCost.toLocaleString()}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-0.5">
                                        <Button variant="ghost" size="icon-sm" onClick={() => manager.setDrawerMode("ledger")} title="View Lifecycle Ledger">
                                            <Eye className="w-4 h-4 text-brand-primary" />
                                        </Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => manager.openAssetDrawer(asset)} title="Edit Asset">
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        <Button variant="destructive-ghost" size="icon-sm" title="Delete Asset">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="mt-auto border-t border-gray-100 bg-white">
                <Pagination
                    currentPage={manager.currentPage}
                    totalPages={manager.totalPages}
                    perPage={manager.perPage}
                    onPageChange={manager.setCurrentPage}
                    onPerPageChange={(v) => { manager.setPerPage(v); manager.setCurrentPage(1); }}
                />
            </div>
        </div>
    );
}