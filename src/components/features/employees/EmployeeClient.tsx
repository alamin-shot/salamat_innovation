"use client";
import { useEmployeeManager } from "@/hooks/employee_hooks/useEmployeeManager";
import { EmployeeFormDrawer } from "./EmployeeFormDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

export function EmployeeClient() {
    const manager = useEmployeeManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.employees.map((e) => e.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const quickActionOptions = [
        "Quick Actions...",
        "Activate",
        "Deactivate",
        "Mark Permanent",
        "Mark Probation",
        "Resend Email"
    ];

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Employee Directory</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage workforce records, roles, and lifecycle statuses.</p>
                </div>
                <Button variant="default" onClick={manager.openAddDrawer} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Employee
                </Button>
            </div>

            <div className="erp-card bg-white p-4 flex flex-wrap items-center justify-between gap-4">
                <input
                    type="text"
                    placeholder="Search by name, email, code..."
                    className="erp-input max-w-sm"
                    value={manager.searchQuery}
                    onChange={(e) => manager.setSearchQuery(e.target.value)}
                />
                <div className="w-56">
                    <CustomSelect
                        value={manager.departmentFilter}
                        options={["All Departments", ...manager.departments]}
                        onChange={manager.setDepartmentFilter}
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white overflow-hidden min-h-[500px] pb-32">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-12">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                checked={manager.employees.length > 0 && manager.selectedIds.length === manager.employees.length}
                                onChange={toggleSelectAll}
                            />
                        </TableHeadCell>
                        <TableHeadCell className="w-64">Name</TableHeadCell>
                        <TableHeadCell className="w-56">Email</TableHeadCell>
                        <TableHeadCell className="w-44">Designation</TableHeadCell>
                        <TableHeadCell className="w-32">Department</TableHeadCell>
                        <TableHeadCell className="w-28">Status</TableHeadCell>
                        <TableHeadCell className="w-32">Joining Date</TableHeadCell>
                        <TableHeadCell className="w-28 text-right">Salary</TableHeadCell>
                        <TableHeadCell className="w-60 text-right">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="p-12 text-center text-gray-500">
                                    No employees found matching your filter.
                                </TableCell>
                            </TableRow>
                        ) : (
                            manager.employees.map((emp) => {
                                const initials = getInitials(emp.name);
                                const colorClass = getAvatarColorClass(emp.id);
                                return (
                                    <TableRow key={emp.id} className="group">
                                        <TableCell>
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(emp.id)}
                                                onChange={() => toggleSelect(emp.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${colorClass}`}>
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{emp.name}</div>
                                                    <div className="text-[11px] text-brand-primary font-medium bg-brand-primary/10 px-1.5 py-0.5 rounded w-fit mt-0.5">
                                                        {emp.badgeLabel}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-700">{emp.email}</TableCell>
                                        <TableCell className="text-gray-800 font-medium">{emp.designation}</TableCell>
                                        <TableCell className="text-gray-700">{emp.department}</TableCell>
                                        <TableCell>
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${emp.status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                                                }`}>
                                                {emp.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-600 text-xs">{emp.joiningDate}</TableCell>
                                        <TableCell className="text-right font-medium text-gray-900">
                                            $ {emp.salary.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-36 text-left">
                                                    <CustomSelect
                                                        value="Quick Actions..."
                                                        options={quickActionOptions}
                                                        onChange={(val) => {
                                                            if (val !== "Quick Actions...") {
                                                                manager.handleQuickAction(emp.id, val);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon-sm" onClick={() => manager.navigateToDetails(emp.id)} title="View 360° Profile">
                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(emp.id)} title="Edit Employee">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(emp.id)} title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                <div className="mt-auto border-t border-gray-100 p-4 bg-white">
                    <Pagination
                        currentPage={manager.table.currentPage}
                        totalPages={manager.table.totalPages}
                        perPage={manager.table.perPage}
                        onPageChange={manager.table.onPageChange}
                        onPerPageChange={manager.table.onPerPageChange}
                    />
                </div>
            </div>

            {manager.selectedIds.length > 0 && (
                <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={() => manager.setSelectedIds([])}>
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>Delete Selected</Button>
                </BulkActionBar>
            )}

            <EmployeeFormDrawer manager={manager} />
        </div>
    );
}