"use client";
import { useApplicantManager } from "@/hooks/applicant_hooks/useApplicantManager";
import { ApplicantDrawer } from "./ApplicantDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Trash2, Eye, CheckCircle, XCircle } from "lucide-react";

export function ApplicantClient() {
    const manager = useApplicantManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.applicants.map(a => a.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600';
            case 'Shortlisted': return 'bg-green-50 text-green-600';
            case 'Rejected': return 'bg-red-50 text-red-500';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Job Applicants</h1>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input type="text" placeholder="Search applicants by name, email, or job..." className="erp-input max-w-sm" />
                </div>

                <div className="w-full overflow-x-auto min-h-[350px]">
                    <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                        checked={manager.applicants.length > 0 && manager.selectedIds.length === manager.applicants.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold w-48">Applicant Name</th>
                                <th className="p-4 font-semibold w-48">Position</th>
                                <th className="p-4 font-semibold w-64">Contact Info</th>
                                <th className="p-4 font-semibold w-24">Gender</th>
                                <th className="p-4 font-semibold w-32">Date</th>
                                <th className="p-4 font-semibold w-28">Status</th>
                                <th className="p-4 font-semibold text-right w-44">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.applicants.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">No applicants found.</td>
                                </tr>
                            ) : (
                                manager.applicants.map((applicant) => (
                                    <tr key={applicant.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 align-top">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(applicant.id)}
                                                onChange={() => toggleSelect(applicant.id)}
                                            />
                                        </td>
                                        <td className="p-4 align-top font-medium text-gray-900">{applicant.name}</td>
                                        <td className="p-4 align-top text-gray-700">{applicant.jobTitle}</td>
                                        <td className="p-4 align-top">
                                            <div className="text-gray-800">{applicant.email}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{applicant.phone}</div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded">
                                                {applicant.gender}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top text-gray-700">{formatDate(applicant.appliedOn)}</td>
                                        <td className="p-4 align-top">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${getStatusStyles(applicant.status)}`}>
                                                {applicant.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openDrawer(applicant.id)} title="View Detail">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {applicant.status === 'Pending' && (
                                                    <>
                                                        <Button variant="ghost" size="icon-sm" onClick={() => manager.handleStatusUpdate(applicant.id, "Shortlisted")} title="Shortlist" className="text-green-600 hover:bg-green-50">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon-sm" onClick={() => manager.handleStatusUpdate(applicant.id, "Rejected")} title="Reject" className="text-red-500 hover:bg-red-50">
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(applicant.id)} title="Delete">
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

            <ApplicantDrawer manager={manager} />
        </div>
    );
}