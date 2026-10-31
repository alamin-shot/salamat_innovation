"use client";
import { useCareerManager } from "@/hooks/career_hooks/useCareerManager";
import { CareerDrawer } from "./CareerDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, Power, Users, Plus } from "lucide-react";
import Link from "next/link";

export function CareerClient() {
    const manager = useCareerManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.careers.map(c => c.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Careers</h1>
                <Button variant="default" onClick={manager.openAddDrawer} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Career
                </Button>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input type="text" placeholder="Search job postings..." className="erp-input max-w-sm" />
                </div>

                <div className="w-full overflow-x-auto min-h-[350px]">
                    <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                        checked={manager.careers.length > 0 && manager.selectedIds.length === manager.careers.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold w-64">Heading</th>
                                <th className="p-4 font-semibold w-32">Type</th>
                                <th className="p-4 font-semibold w-24">Vacancies</th>
                                <th className="p-4 font-semibold w-48">Salary</th>
                                <th className="p-4 font-semibold w-32">Deadline</th>
                                <th className="p-4 font-semibold w-28">Status</th>
                                <th className="p-4 font-semibold text-right w-44">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.careers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">No job postings found.</td>
                                </tr>
                            ) : (
                                manager.careers.map((career) => (
                                    <tr key={career.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 align-top">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(career.id)}
                                                onChange={() => toggleSelect(career.id)}
                                            />
                                        </td>
                                        <td className="p-4 align-top font-medium text-gray-900">{career.heading}</td>
                                        <td className="p-4 align-top text-gray-700">{career.type}</td>
                                        <td className="p-4 align-top text-gray-700">{career.vacancies}</td>
                                        <td className="p-4 align-top text-gray-700">{career.salary}</td>
                                        <td className="p-4 align-top text-gray-700">{formatDate(career.deadline)}</td>
                                        <td className="p-4 align-top">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${career.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                                }`}>
                                                {career.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/applicants?jobId=${career.id}`} passHref>
                                                    <Button variant="ghost" size="icon-sm" title="View Applicants" className="text-blue-600 hover:bg-blue-50">
                                                        <Users className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.handleToggleStatus(career.id)} title={career.status === 'Active' ? "Deactivate" : "Activate"}>
                                                    <Power className={`h-4 w-4 ${career.status === 'Active' ? 'text-amber-500' : 'text-green-600'}`} />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(career.id)} title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(career.id)} title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {manager.selectedIds.length > 0 && (
                <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={() => manager.setSelectedIds([])}>
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>Delete Selected</Button>
                </BulkActionBar>
            )}

            <CareerDrawer manager={manager} />
        </div>
    );
}