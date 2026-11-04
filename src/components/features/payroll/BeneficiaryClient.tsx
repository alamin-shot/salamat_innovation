"use client";
import { useBeneficiaryManager } from "@/hooks/payroll_hooks/useBeneficiaryManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, Columns, FileSearch } from "lucide-react";
import { BeneficiaryDrawer } from "./beneficiary/BeneficiaryDrawer";

export function BeneficiaryClient() {
    const manager = useBeneficiaryManager();

    const getTypeColor = (type: string) => {
        if (type === "Allowance") return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (type === "Deduction") return "bg-rose-50 text-rose-700 border-rose-200";
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">

            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Beneficiaries</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Define enterprise allowances, deductions, and statutory compliance heads.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="sm" className="h-9 bg-white flex items-center gap-1.5">
                        <Columns className="w-3.5 h-3.5" /> Columns
                    </Button>
                    <Button variant="default" onClick={manager.openAdd} className="h-9 flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Beneficiary
                    </Button>
                </div>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                <div className="p-4 border-b border-gray-100">
                    <input
                        type="text"
                        placeholder="Search beneficiaries..."
                        className="erp-input max-w-xs"
                        value={manager.searchQuery}
                        onChange={(e) => manager.setSearchQuery(e.target.value)}
                    />
                </div>

                <Table containerClassName="flex-1 min-h-[380px]">
                    <TableHeader>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Type</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-gray-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FileSearch className="w-12 h-12 text-gray-300" />
                                        <span className="text-xs font-medium">No Beneficiaries found</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            manager.logs.map((b) => (
                                <TableRow key={b.id} className="hover:bg-gray-50/80">
                                    <TableCell className="font-semibold text-gray-900 text-xs">
                                        {b.name}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${getTypeColor(b.type)}`}>
                                            {b.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${b.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                            {b.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon-sm" onClick={() => manager.openEdit(b.id)}>
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(b.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="mt-auto border-t border-gray-100">
                    <Pagination
                        currentPage={manager.table.currentPage}
                        totalPages={manager.table.totalPages}
                        perPage={manager.table.perPage}
                        onPageChange={manager.table.onPageChange}
                        onPerPageChange={manager.table.onPerPageChange}
                    />
                </div>
            </div>

            <BeneficiaryDrawer
                isOpen={manager.drawerMode !== "none"}
                mode={manager.drawerMode === "edit" ? "edit" : "add"}
                activeItem={manager.getActiveItem()}
                onClose={manager.closeDrawer}
                onSave={manager.handleSave}
            />

        </div>
    );
}